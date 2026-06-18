// LEVEL · Edge Function: share-ingest (v3)
// Recebe uma imagem partilhada pela Share Extension/Atalho do iOS e cria uma
// capture_session COM DONO, subindo a foto para o bucket capture-photos.
//
// DOIS modos de envio (auto-detectados pelo Content-Type):
//   1) RAW (recomendado p/ iOS Atalhos): corpo = o ficheiro da imagem (binário).
//      mime vem do header `x-mime` (ou do Content-Type); dono vem do header
//      `x-local-id` (ou query ?local_id=). Evita base64 de vez — e o Atalho deve
//      converter HEIC→JPEG antes (o iPhone fotografa em HEIC, que o bucket recusa).
//   2) JSON: { local_id, image_base64, mime?, kind? } — usado em testes/cURL.
//
// NÃO dispara a Vision aqui (a foto pode ser de stats OU de arma): deixa a sessão
// em status='uploaded' e o Hub decide o analisador na reconciliação (igual ao QR).
// verify_jwt:false — gated por local_id (e/ou Bearer JWT de utilizador, opcional).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL              = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SUPABASE_ANON_KEY         = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

const BUCKET = "capture-photos";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB — mesmo teto do bucket
const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png":  "png",
  "image/webp": "webp",
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-local-id, x-mime, x-kind",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

// base64 → Uint8Array, tolerante a quebras de linha / base64url / padding.
function base64ToBytes(b64: string): Uint8Array {
  let clean = b64.includes(",") ? b64.slice(b64.indexOf(",") + 1) : b64;
  clean = clean.replace(/-/g, "+").replace(/_/g, "/");   // base64url → padrão
  clean = clean.replace(/[^A-Za-z0-9+/]/g, "");          // mantém SÓ o alfabeto base64 (remove whitespace, chars de controlo, '=' e qualquer lixo)
  while (clean.length % 4 !== 0) clean += "=";           // repõe o padding
  const binary = atob(clean);
  const len = binary.length;
  const out = new Uint8Array(len);
  for (let i = 0; i < len; i++) out[i] = binary.charCodeAt(i);
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });
  if (req.method !== "POST")    return json({ error: "use POST", code: "METHOD" }, 405);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const url = new URL(req.url);
  const contentType = (req.headers.get("content-type") || "").toLowerCase();

  try {
    let bytes: Uint8Array;
    let mime: string;
    let localId: string | null;
    let kind: string | null;

    if (contentType.includes("application/json")) {
      // ── Modo JSON (base64) ──────────────────────────────────────────────────
      const body = await req.json().catch(() => null);
      if (!body) return json({ error: "JSON inválido", code: "BAD_JSON" }, 400);
      if (!body.image_base64) return json({ error: "image_base64 obrigatório", code: "NO_IMAGE" }, 400);
      mime    = body.mime || "image/jpeg";
      localId = body.local_id ?? null;
      kind    = body.kind ?? null;
      try { bytes = base64ToBytes(body.image_base64); }
      catch (e) {
        const s = String(body.image_base64 ?? "");
        return json({ error: "base64 inválido", code: "BAD_B64", len: s.length, head: s.slice(0, 16), tail: s.slice(-16), technical: String((e as Error).message || e) }, 400);
      }
    } else {
      // ── Modo RAW (ficheiro binário — iOS Atalhos) ───────────────────────────
      const buf = await req.arrayBuffer();
      bytes   = new Uint8Array(buf);
      mime    = (req.headers.get("x-mime") || contentType.split(";")[0] || "").trim();
      if (!ALLOWED_MIME[mime]) mime = "image/jpeg"; // default seguro (o Atalho converte p/ JPEG)
      localId = req.headers.get("x-local-id") || url.searchParams.get("local_id");
      kind    = req.headers.get("x-kind") || url.searchParams.get("kind");
    }

    console.log(`[share-ingest] mode=${contentType.includes("application/json") ? "json" : "raw"} mime=${mime} bytes=${bytes.length} owner=${localId ?? "?"}`);

    if (!ALLOWED_MIME[mime]) return json({ error: `mime não suportado: ${mime} (converta a foto para JPEG)`, code: "BAD_MIME" }, 400);
    if (bytes.length === 0)        return json({ error: "imagem vazia", code: "EMPTY" }, 400);
    if (bytes.length > MAX_BYTES)  return json({ error: "imagem acima de 10 MB", code: "TOO_LARGE" }, 413);

    // ── Dono: Bearer JWT de utilizador (opcional) → auth_user_id; senão local_id ─
    let authUserId: string | null = null;
    const authHeader = req.headers.get("Authorization") || "";
    const bearer = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : "";
    if (bearer && bearer !== SUPABASE_ANON_KEY) {
      const { data: u } = await supabase.auth.getUser(bearer);
      if (u?.user?.id) authUserId = u.user.id;
    }
    if (!authUserId && localId) {
      const { data: hubUser } = await supabase
        .from("hub_users").select("auth_user_id").eq("local_id", localId).maybeSingle();
      if (hubUser?.auth_user_id) authUserId = hubUser.auth_user_id;
    }
    if (!localId && !authUserId) {
      return json({ error: "sem dono: envie local_id (header x-local-id) ou um JWT de utilizador", code: "NO_OWNER" }, 401);
    }

    // ── Cria a sessão COM DONO ──────────────────────────────────────────────────
    const { data: session, error: insErr } = await supabase
      .from("capture_sessions")
      .insert({ source: "share", local_id: localId, auth_user_id: authUserId })
      .select("token")
      .single();
    if (insErr || !session) {
      return json({ error: "falha a criar sessão", code: "SESSION_INSERT", technical: insErr?.message }, 500);
    }
    const token = session.token as string;

    // ── Sobe a foto ─────────────────────────────────────────────────────────────
    const ext  = ALLOWED_MIME[mime];
    const path = `${token}/share_0.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: mime, upsert: false });
    if (upErr) {
      await supabase.from("capture_sessions")
        .update({ status: "failed", error_message: JSON.stringify({ code: "UPLOAD", technical: upErr.message }) })
        .eq("token", token);
      return json({ error: "falha no upload da foto", code: "UPLOAD", technical: upErr.message }, 500);
    }

    // ── Marca como 'uploaded' (mesmo estado que o Hub espera no fluxo QR) ────────
    const patch: Record<string, unknown> = { status: "uploaded", photo_paths: [path] };
    if (kind) patch.vision_result = { kind_hint: kind };
    await supabase.from("capture_sessions").update(patch).eq("token", token);

    return json({ ok: true, token, path });
  } catch (err) {
    return json({ error: "erro inesperado", code: "UNKNOWN", technical: String((err as Error).message || err) }, 500);
  }
});
