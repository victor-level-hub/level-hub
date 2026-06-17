// LEVEL · Edge Function: analyze-stats (v1)
// Espelha a analyze-capture, mas lê o ecrã de ESTATÍSTICAS (Combat Record / Barracks)
// de Call of Duty Black Ops 7 e devolve os stats de carreira do jogador (multiplayer).
// Recebe { token, local_id? }, baixa as fotos da capture_sessions do Storage, chama o
// Gemini Vision com schema fechado, grava vision_result = { kind:"stats", stats:{...} }
// + status='ready'. Instrumenta em ana_gemini_usage (igual analyze-capture v6+).
//
// IMPORTANTE: regra anti-alucinação — só extrai o que está claramente legível. Nunca adivinha.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GEMINI_API_KEY  = Deno.env.get("GEMINI_API_KEY")!;
const GEMINI_MODEL    = "gemini-2.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const SUPABASE_URL              = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const BUCKET = "capture-photos";

const GEMINI_FLASH_INPUT_USD_PER_1M  = 0.075;
const GEMINI_FLASH_OUTPUT_USD_PER_1M = 0.30;

const RETRY_STATUSES = new Set([429, 500, 502, 503, 504]);
const RETRY_DELAYS_MS = [1500, 3000, 6000];

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ─── Schema fechado dos stats de carreira (multiplayer) ────────────────────────
// Todos os campos numéricos são opcionais: a Vision OMITE o que não estiver legível.
const STATS_SCHEMA = {
  type: "object",
  properties: {
    stats: {
      type: "object",
      description: "Estatísticas de carreira multiplayer lidas do ecrã (Combat Record / Barracks). Só preenche o que está claramente visível; omite o resto.",
      properties: {
        prestige:         { type: "integer", description: "Prestígio atual do jogador (número). Lê só o número, ex: 9. Omite se não visível." },
        level:            { type: "integer", description: "Nível atual dentro do prestígio (número inteiro). Omite se não visível." },
        kills:            { type: "integer", description: "Total de kills (abates). Omite se não visível." },
        deaths:           { type: "integer", description: "Total de deaths (mortes). Omite se não visível." },
        kd_ratio:         { type: "number",  description: "K/D ratio (kills ÷ deaths), normalmente com 2 casas (ex: 1.34). Lê o valor mostrado; não recalcules." },
        wins:             { type: "integer", description: "Total de vitórias. Omite se não visível." },
        losses:           { type: "integer", description: "Total de derrotas. Omite se não visível." },
        win_loss_ratio:   { type: "number",  description: "Win/Loss ratio mostrado (ex: 1.12). Lê o valor; não recalcules." },
        win_pct:          { type: "number",  description: "Percentagem de vitórias (ex: 53.2 para 53,2%). Só o número, sem o símbolo %." },
        score_per_minute: { type: "number",  description: "Score Per Minute (SPM). Omite se não visível." },
        kills_per_game:   { type: "number",  description: "Kills por partida (Kills/Game). Omite se não visível." },
        games_played:     { type: "integer", description: "Total de partidas jogadas. Omite se não visível." },
        time_played:      { type: "string",  description: "Tempo total jogado, exatamente como mostrado (ex: '5d 12h', '320h'). Omite se não visível." },
        longest_streak:   { type: "integer", description: "Maior killstreak / sequência de abates. Omite se não visível." },
        accuracy_pct:     { type: "number",  description: "Precisão em percentagem (ex: 21.4). Só o número, sem %." },
        headshots:        { type: "integer", description: "Total de headshots (tiros na cabeça). Omite se não visível." },
        assists:          { type: "integer", description: "Total de assistências. Omite se não visível." },
        score:            { type: "integer", description: "Score total acumulado, se mostrado. Omite se não visível." },
      },
      required: [],
    },
    confidence: {
      type: "string",
      enum: ["high", "medium", "low"],
      description: "Confiança geral na leitura: high = números nítidos e claros, medium = parte legível, low = chute educado.",
    },
    notes: { type: "string", description: "Observações livres (ex: 'imagem cortada', 'ecrã de arma e não de carreira', 'overlay do HUD')." },
  },
  required: ["stats", "confidence"],
};

const SYSTEM_PROMPT = `Você é um analisador de screenshots do jogo Call of Duty Black Ops 7 (BO7).
Recebe 1+ imagens do ecrã de ESTATÍSTICAS de carreira do jogador — telas tipo "Combat Record", "Barracks", "Career", resumo de multiplayer.
A tua tarefa é extrair os números das estatísticas de carreira no multiplayer e devolvê-los no schema \`stats\`.

Regras críticas:
- Extrai APENAS o que está claramente legível. Se um valor está cortado, borrado ou ausente, OMITE esse campo (não o devolvas).
- NUNCA adivinhes nem recalcules. Para ratios (K/D, W/L), lê o valor já mostrado no ecrã — não faças contas.
- Percentagens (win %, precisão): devolve só o número, sem o símbolo %.
- Prestígio e nível: lê só os números.
- Se a imagem NÃO for um ecrã de estatísticas de carreira (ex: é Gunsmith/arma), devolve stats vazio, confidence "low" e explica em notes.
- Se vários ecrãs vierem, combina os valores legíveis (um print pode ter K/D e outro o SPM).`;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function logUsage(supabase: any, params: {
  user_id: string | null;
  edge_function: string;
  model: string;
  prompt_tokens?: number | null;
  candidates_tokens?: number | null;
  total_tokens?: number | null;
  cost_estimate_usd?: number | null;
  latency_ms?: number;
  success: boolean;
  error_code?: string | null;
}) {
  try {
    await supabase.from("ana_gemini_usage").insert(params);
  } catch (e) {
    console.warn("[ana_gemini_usage] insert failed (non-blocking):", e);
  }
}

function computeCost(promptTok: number | null, candidatesTok: number | null): number {
  const p = promptTok ?? 0;
  const c = candidatesTok ?? 0;
  return (p / 1_000_000) * GEMINI_FLASH_INPUT_USD_PER_1M +
         (c / 1_000_000) * GEMINI_FLASH_OUTPUT_USD_PER_1M;
}

function friendlyError(rawError: string): { code: string; message: string } {
  const lower = rawError.toLowerCase();
  if (lower.includes("503") || lower.includes("overloaded") || lower.includes("high demand")) {
    return { code: "AI_OVERLOADED", message: "A IA está com sobrecarga. As fotos já estão guardadas — espera 1-2 min e usa 'Tentar novamente'." };
  }
  if (lower.includes("429") || lower.includes("quota") || lower.includes("rate limit")) {
    return { code: "AI_RATE_LIMITED", message: "Limite de chamadas atingido. Tenta de novo em alguns minutos." };
  }
  if (lower.includes("401") || lower.includes("403") || lower.includes("api key") || lower.includes("unauthorized")) {
    return { code: "AI_AUTH", message: "Problema com a chave de acesso à IA. Avisa o admin do LEVEL." };
  }
  if (lower.includes("400") || lower.includes("invalid") || lower.includes("image too large") || lower.includes("unsupported")) {
    return { code: "AI_BAD_REQUEST", message: "A IA não conseguiu processar essa imagem. Tenta com um print mais nítido." };
  }
  if (lower.includes("download") || lower.includes("not found") || lower.includes("storage")) {
    return { code: "STORAGE_ERROR", message: "Não consegui acessar a foto enviada. Tenta enviar de novo." };
  }
  if (lower.includes("sessão não encontrada") || lower.includes("session not found") || lower.includes("expired")) {
    return { code: "SESSION_ERROR", message: "Sessão de captura inválida ou expirada. Gera um novo QR." };
  }
  if (lower.includes("sem fotos") || lower.includes("no photos")) {
    return { code: "NO_PHOTOS", message: "A sessão não tem fotos. Tira pelo menos uma foto do ecrã de estatísticas." };
  }
  if (lower.includes("timeout") || lower.includes("timed out") || lower.includes("deadline")) {
    return { code: "TIMEOUT", message: "A análise demorou demais. Tenta de novo em 30s." };
  }
  if (lower.includes("json") || lower.includes("unexpected token") || lower.includes("parse")) {
    return { code: "PARSE_ERROR", message: "A IA retornou uma resposta estranha. Tenta de novo — geralmente resolve." };
  }
  if (lower.includes("sem texto") || lower.includes("no response") || lower.includes("empty")) {
    return { code: "AI_EMPTY", message: "A IA não conseguiu ler nada. Tenta com outro print do ecrã de estatísticas." };
  }
  return { code: "UNKNOWN", message: "Algo deu errado na análise. Tenta de novo — se persistir, abre o console (F12) e copia o erro." };
}

async function callGeminiWithRetry(body: unknown): Promise<Response> {
  let lastError: { status: number; text: string } | null = null;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    if (attempt > 0) {
      const delay = RETRY_DELAYS_MS[attempt - 1];
      console.log(`[gemini] retry ${attempt}/${RETRY_DELAYS_MS.length} após ${delay}ms (last: ${lastError?.status})`);
      await sleep(delay);
    }
    let res: Response;
    try {
      res = await fetch(GEMINI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (netErr) {
      lastError = { status: 0, text: `Network: ${(netErr as Error).message}` };
      continue;
    }
    if (res.ok) return res;
    const errText = await res.text();
    lastError = { status: res.status, text: errText.slice(0, 500) };
    if (!RETRY_STATUSES.has(res.status)) {
      throw new Error(`Gemini retornou ${res.status}: ${errText}`);
    }
  }
  throw new Error(`Gemini retornou ${lastError?.status} após ${RETRY_DELAYS_MS.length + 1} tentativas: ${lastError?.text}`);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const startTime = Date.now();
  let currentToken: string | null = null;
  let trackedUserId: string | null = null;
  let success = false;
  let errorCode: string | null = null;
  let usageMeta: any = null;

  try {
    const body = await req.json();
    currentToken = body.token;
    if (!currentToken) {
      errorCode = "MISSING_TOKEN";
      return json({ error: "token obrigatório", code: "MISSING_TOKEN" }, 400);
    }

    if (body.local_id) {
      const { data: hubUser } = await supabase
        .from("hub_users").select("id").eq("local_id", body.local_id).maybeSingle();
      if (hubUser) trackedUserId = hubUser.id;
    }

    const { data: session, error: sessErr } = await supabase
      .from("capture_sessions")
      .select("token, status, photo_paths")
      .eq("token", currentToken)
      .maybeSingle();

    if (sessErr || !session) {
      errorCode = "SESSION_NOT_FOUND";
      return jsonError(supabase, currentToken, new Error("sessão não encontrada"), 404);
    }
    if (!session.photo_paths || session.photo_paths.length === 0) {
      errorCode = "NO_PHOTOS";
      return jsonError(supabase, currentToken, new Error("sessão sem fotos"), 400);
    }

    await supabase.from("capture_sessions").update({ status: "processing" }).eq("token", currentToken);

    const imageParts = [];
    for (const path of session.photo_paths) {
      const { data: blob, error: dlErr } = await supabase.storage.from(BUCKET).download(path);
      if (dlErr || !blob) {
        errorCode = "STORAGE_ERROR";
        throw new Error(`download falhou em ${path}: ${dlErr?.message}`);
      }
      const buffer = await blob.arrayBuffer();
      const base64 = bufferToBase64(buffer);
      const mime   = blob.type || "image/jpeg";
      imageParts.push({ inlineData: { mimeType: mime, data: base64 } });
    }

    const geminiRes = await callGeminiWithRetry({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: imageParts }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: STATS_SCHEMA,
        temperature: 0.1,
      },
    });

    const geminiData = await geminiRes.json();
    usageMeta = geminiData?.usageMetadata || null;
    const textOut = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textOut) {
      errorCode = "AI_EMPTY";
      throw new Error("Gemini sem texto de resposta");
    }

    const parsed = JSON.parse(textOut);
    const visionResult = { kind: "stats", stats: parsed.stats || {}, confidence: parsed.confidence || "low", notes: parsed.notes || "" };

    await supabase.from("capture_sessions")
      .update({ vision_result: visionResult, status: "ready" })
      .eq("token", currentToken);

    success = true;
    return json({ ok: true, kind: "stats", fields_read: Object.keys(visionResult.stats || {}).length, confidence: visionResult.confidence });

  } catch (err) {
    return jsonError(supabase, currentToken, err as Error, 500);
  } finally {
    const latency = Date.now() - startTime;
    const promptTok     = usageMeta?.promptTokenCount ?? null;
    const candidatesTok = usageMeta?.candidatesTokenCount ?? null;
    const totalTok      = usageMeta?.totalTokenCount ?? null;
    const cost = success ? computeCost(promptTok, candidatesTok) : 0;
    await logUsage(supabase, {
      user_id: trackedUserId,
      edge_function: "analyze-stats",
      model: GEMINI_MODEL,
      prompt_tokens: promptTok,
      candidates_tokens: candidatesTok,
      total_tokens: totalTok,
      cost_estimate_usd: cost,
      latency_ms: latency,
      success,
      error_code: errorCode,
    });
  }
});

async function jsonError(supabase: any, token: string | null, err: Error, status: number) {
  const errorMsg = String(err.message || err);
  console.error("[analyze-stats] erro final:", errorMsg);
  const friendly = friendlyError(errorMsg);
  if (token) {
    try {
      await supabase.from("capture_sessions").update({
        status: "failed",
        error_message: JSON.stringify({ code: friendly.code, user_message: friendly.message, technical: errorMsg.slice(0, 500) }),
      }).eq("token", token);
    } catch (updateErr) {
      console.error("[analyze-stats] falha a atualizar status:", updateErr);
    }
  }
  return json({ error: friendly.message, code: friendly.code, technical: errorMsg.slice(0, 500) }, status);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function bufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK) as unknown as number[]);
  }
  return btoa(binary);
}
