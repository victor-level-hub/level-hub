# LEVEL · ESTADO DO PROJETO E CONVENÇÕES
### Documento mestre — memória estendida do projeto
**Última atualização: 1 de Junho de 2026**

> Este documento é a fonte de verdade do estado técnico e das convenções do LEVEL.
> Guardar no repo `level-hub` ao lado do `index.html`. Anexar (ou referenciar) no
> início de cada sessão de trabalho para o Claude ter contexto completo sem depender
> só da memória automática.

---

## 1. O QUE É O LEVEL

Plataforma de coaching tático para **Call of Duty: Black Ops 7 (BO7)**, desenvolvida
por **Victor** (dev solo). Hub web em **le-vel.games**. O coach de IA dentro do produto
é o personagem **Le Vél** — instrutor tático veterano, tom direto e técnico.

**Perfil do operador (Victor):** jogador PS5, estilo **rusher agressivo (CQB)**,
comunicação exclusivamente em **pt-BR**.

### Frases-marca do Le Vél
- "Operador, próximo passo."
- "Analisei. Vamos ao plano."
- "Sinto evolução aqui."
- "Não recomendo. Te explico por quê."

### Monetização (decidida 18/Mai/26)
Três tiers + fundadores:
- **FREE** — Hub com regras determinísticas, até 5 loadouts, badges.
- **PLUS R$19,90/mês** — IA conversacional (LLM), leitura de print (Vision API),
  coaching adaptativo, loadouts ilimitados, sync, "Falar com Le Vél".
- **PRO R$49,90/mês** — replay analysis, coach session 30min, meta builds curadas, comunidade.
- **FOUNDER VITALÍCIO** — 100 primeiros Plus / 50 primeiros Pro: preço travado se não
  cancelar + badge Fundador permanente + acesso antecipado + voz na roadmap.

Pagamento: Stripe (internacional) + Mercado Pago (BR, PIX/boleto). NÃO BYOK
(fricção mata conversão). Free nunca toca o backend.

---

## 2. AS TRÊS FRENTES HTML (IMPORTANTE — NÃO CONFUNDIR)

O projeto tem **três aplicações HTML distintas**, cada uma no seu repo, e todas se
chamam `index.html` dentro do próprio repo (padrão do Netlify). São arquivos diferentes.

| Frente | O que é | Repo / Deploy | Roda em |
|--------|---------|---------------|---------|
| **HUB** (principal) | App completo (~36 mil linhas), HTML puro single-file | `victor-level-hub/level-hub` → Netlify `le-vel-hub` → **le-vel.games** | PC |
| **Captura de arma** | Página leve, tira foto de arma/loadout via QR | `victor-level-hub/bo7-capture` → **Cloudflare Worker** `bo7-capture.victor-abap.workers.dev` | Telemóvel |
| **Captura de avatar** | Página leve, tira selfie pra gerar avatar | `level-capture-avatar.html` | Telemóvel |

### CONVENÇÃO DE ENTREGA DE ARQUIVOS (regra fixa)
- **O padrão é o HUB.** Quando o Claude entrega `index.html` sem aviso especial, é o Hub.
  Não precisa repetir "este é o Hub" toda vez — é o default.
- **Qualquer outra frente (captura de arma/avatar) = aviso destacado** + nome de
  arquivo distinto (ex: `captura-arma-index.html`) + dizer explicitamente o repo de destino.
- **Nunca** entregar uma captura disfarçada de `index.html` comum (risco de commit no repo errado).
- Regra resumida: **silêncio = Hub; captura = aviso claro e nome distinto.**

---

## 3. INFRAESTRUTURA

### Domínio e deploy
- **Domínio:** le-vel.games
- **Hub:** GitHub `victor-level-hub/level-hub`, branch `main` → auto-deploy Netlify
  `le-vel-hub` a cada push no `main`.
- **Captura mobile (arma):** GitHub `victor-level-hub/bo7-capture` → **Cloudflare Worker**
  `bo7-capture.victor-abap.workers.dev` (migrou do Netlify p/ Workers; descoberto 1/Jun). URL do QR:
  `bo7-capture.victor-abap.workers.dev/?token=...&type=weapon`. Claude NÃO tem o código deste Worker.

### Supabase
- **Conta:** GitHub `victor-abap-pt`
- **Projeto:** `bo7-tactical-hub` — ref **`cqkhqtgmolmrfgzozocr`**, região **sa-east-1** (São Paulo), Free tier.
- **Painel:** supabase.com/dashboard

### IA / Vision
- **Gemini 2.5-flash** (Vision API) — análise de prints de arma.
- **Avatar:** Nano Banana 2.

### Links diretos de painéis (sempre mandar junto com a instrução)
- Supabase: supabase.com/dashboard
- Netlify: app.netlify.com
- GitHub: github.com
- Cloudflare: dash.cloudflare.com

---

## 4. AUTENTICAÇÃO — ESTADO ATUAL (FECHADO 1/Jun/26)

Implementado o **caminho B**: autenticação real com Supabase Auth, identidade por `auth.uid()`.

### Configuração
- **Método:** e-mail + senha (sem segundo fator).
- **Confirm email:** OFF (desligado — para facilitar testes; religar antes do público).
- **Idade mínima:** 18+ universal (gate no cadastro por data de nascimento). Razão:
  fica acima do piso de RGPD/LGPD/COPPA com uma regra só, sem detectar país.
- **Anonymous sign-ins:** OFF (era o que gerava usuários fantasma).

### Identidade do Victor (usuário real único)
- **auth.uid:** `1438a611-556b-4250-a079-c85066d7d781`
- **e-mail:** victor.abap@outlook.com
- **hub_users.id:** `3fa59ebd-b507-4f87-bf24-61e39d4ca785`
- **Ligação:** coluna `hub_users.auth_user_id` aponta para o `auth.uid`.

### O que foi construído no Hub
- Overlay de Auth `#level-auth-gate` (telas: landing, cadastro, login, resgate de senha).
- Controlador IIFE `window.LEVEL_AUTH` (signUp com gate 18+, signInWithPassword,
  resetPasswordForEmail, signOut, getSession, getUserId, getClient). Cria client
  `supabase-js@2.45.4` via esm.sh, com `persistSession: true`, storageKey `level.auth.session`.
- O overlay cobre o Hub com fundo opaco (NÃO mexe na visibility do `.app` — fazer isso
  quebrava o layout do menu; bug corrigido em 1/Jun).
- `pushAll`, `pullAll` e `_cloudHeaders` agora enviam o **token de Auth** (não mais a chave anon).
- `autoPullIfEmpty`: no login (evento `level-auth-ready`), se o dispositivo está vazio
  (sem armas/loadouts locais), puxa o estado do banco automaticamente e recarrega. Cobre
  "logo num computador novo e vejo tudo", sem clique. Se já há dados locais, NÃO faz pull
  (evita sobrescrever mudanças não-sincronizadas) — sync manual continua disponível.

### Migração de dados (feita 1/Jun)
- Dado de jogo do Victor migrado do localStorage para o banco sob o `auth.uid`.
- Migrado: **25 armas** + **perfil** (display_name VICTOR, Prestige 6, Level 39, rusher, PS5).
- Loadouts/builds: 0 (Victor não tinha salvos — não é bug).
- Migração é **cópia única**: o Hub continua rodando do localStorage; o banco é o destino
  do push. NÃO foi feita a "virada de chave" (Hub passar a viver do banco) — isso é projeto à parte.

### PENDÊNCIAS de Auth
- **Sync bidirecional validado** (push + pull sob auth.uid, testado 1/Jun). Todas as três
  Edge Functions migradas e no ar: sync-push v6, sync-pull v6, user-asset v4 (todas verify_jwt).
- **Auto-sync ao MUDAR + estratégia de CONFLITO (frente grande, próxima):** o objetivo é
  "sempre sincronizado, invisível" (estilo Notion/Google Docs) — pull-ao-logar mesmo com
  dados locais + push-ao-mudar automático. O nó é o conflito: dois dispositivos que mexem
  offline e depois sincronizam — quem vence? Hoje há LWW (last-write-wins) no sync-push, mas
  pull automático cego sobre dados locais divergentes APAGA mudanças não-sincronizadas. Por
  isso o auto-pull atual só age em dispositivo vazio. Resolver conflito de verdade (LWW
  consistente / merge / perguntar ao usuário) é pré-requisito pro automático completo e seguro.
- **Capturas de telemóvel (arma e avatar) ainda NÃO usam Auth** — identificam-se por token
  de sessão de captura (do QR) + chave anon, sem login. Plano: o QR passa a levar o auth.uid()
  (createSession no Hub já aceita userId). Falta migrar as Edge Functions de captura e as
  páginas (bo7-capture e level-capture-avatar.html — Claude não tem esses arquivos ainda).
- **Confirm email:** religar antes de abrir ao público (hoje OFF p/ testes).
- **RLS do bucket user-assets:** dispensável. Todo acesso ao bucket passa pela Edge Function
  com service-role (que bypassa RLS); o cliente nunca toca o bucket direto. Segurança está na
  função (só devolve assets do userId correto), não em política de Storage.

---

## 5. BANCO DE DADOS (Supabase Postgres)

### Tabelas de catálogo (compartilhadas, conteúdo admin)
- **cat_attachments** (16 col) — **1102 registros, 25/25 armas, fonte única `codmunity`,
  nomes JÁ em MARCA** (ex: `14" Prism Light Barrel`, `VAS Convergence Foregrip`). Correção de
  nomenclatura FEITA na troca atômica da v2.4.0. **ZERO genéricos. NÃO MEXER.**
- cat_attachments_staging / cat_attachments_staging2 — tabelas de staging (pré-produção).
- cat_codenames — codenames de build (UI Codenames, admin).
- cat_default_builds / cat_default_weapons — seeds de armas e builds.
- cat_maps — 22 mapas BO7 Multiplayer.
- cat_perks, cat_sources, cat_struggles, cat_weapons.

### Tabelas de dados do usuário (por user_id → hub_users.id)
- **hub_users** (14 col) — inclui `local_id`, `auth_user_id`, display_name, prestige, level,
  style, platform, photo_inline, prefs, server_updated_at.
- hub_weapons (12 col), hub_builds (14), hub_loadouts (19), hub_settings (7),
  hub_struggles (10), hub_struggle_notes (6), hub_unlocks (8), hub_player_history (6).
- user_assets (10 col) — índice das imagens no bucket user-assets.

### Outras
- mkt_builds (19), mkt_votes (5) — marketplace.
- ana_gemini_usage (12) — telemetria de custo/latência da Gemini.
- avatar_sessions (14), capture_sessions (9) — sessões de captura mobile.
- admin_config (4).

### Buckets de Storage
- **capture-photos** — fotos de arma (captura mobile).
- **avatar-selfies** — selfies de entrada.
- **avatar-generated** — avatares gerados pela Nano Banana 2.
- **user-assets** — imagens pessoais do operador (avatar, emblemas de prestígio).
  Privado, limite 5MB, aceita jpeg/png/webp. Path: `{hub_users.id}/{category}/{sub}/{item}.{ext}`.

---

## 6. EDGE FUNCTIONS (24 ativas)

**Com verify_jwt = TRUE (migradas pra auth.uid em 1/Jun):**
- **sync-push** (v6) — recebe snapshot do Hub, grava sob auth.uid via auth_user_id. LWW por
  chave natural, upserts, deletes. Bug de perfil-vazio corrigido (v2.1: preenche perfil null sem LWW).
- **sync-pull** (v6) — read-only, devolve dado do banco por auth.uid. Suporta `since` incremental.
- **user-asset** (v4) — CRUD de imagens no bucket user-assets, por auth.uid. Endpoints list/upload/delete.

**Com verify_jwt = FALSE (modelo antigo, por local_id ou token de captura):**
- sync-pull-v2 (v5) — função antiga/duplicada do modelo local_id (a sync-pull canônica é v6, migrada p/ auth.uid).
- analyze-capture (v11) — Gemini Vision em prints de arma → vision_result. Instrumentado em ana_gemini_usage.
  v11 (1/Jun): prompt distingue CODENAME de loadout (ANTARES, VIRTUE, KNIFE) do NOME REAL da arma
  (que está no Gunsmith); pós-processa pra devolver SÓ a arma principal (a com attachments),
  descartando slots de secundária/faca vazios. Schema ganhou `is_primary`.
- generate-avatar (v5), avatar-session-create (v6), avatar-session-approve (v4), upload-avatar-selfie (v4).
- bootstrap-defaults (v7) — seeds iniciais.
- record-player-snapshot (v5), get-gemini-usage (v4).
- mkt-publish-build (v4), mkt-vote (v4) — marketplace.
- admin-bulk-attachments (v5), admin-cat-maps (v4), admin-cat-default-weapons (v3),
  admin-cat-default-builds (v3), admin-cat-codenames (v4), admin-cat-struggles (v3) — admin de catálogo.
- analyze-build (v1), report-attachment (v1), test-deploy (v5).

### Padrões técnicos de Edge Function
- DDL e pg_cron via `apply_migration`.
- Upserts confiáveis: `ON CONFLICT (id) DO UPDATE` com enumeração completa de campos.
- Bulk inserts grandes: Edge Function temporária com verify_jwt=false + shared secret +
  `curl --data-binary`, neutralizada após uso.
- Migração pra auth.uid (padrão usado em sync-push, sync-pull e user-asset): valida token via
  `supabase.auth.getUser(token)` com service-role client (não depende do secret ANON_KEY);
  resolve hub_users por auth_user_id; adota órfão por local_id; senão cria. Deploy com verify_jwt=true.
- **DICA DE DEPLOY (descoberta 1/Jun):** o deploy de Edge Function pela ferramenta exige a
  estrutura de subpasta (`slug/index.ts` + `slug/deno.json` + import_map_path apontando pro
  deno.json), NÃO um `index.ts` solto na raiz. Tentar deployar `index.ts` na raiz dá
  `InternalServerErrorException` repetido — que PARECE instabilidade do Supabase mas é a
  estrutura errada. Replicar a estrutura da versão anterior resolve.

---

## 7. ESTADO DO HUB (v2.4.0)

- Versão atual **v2.4.0**. SemVer desde v2.0.0 (PATCH=bugfix/visual/copy; MINOR=feature;
  MAJOR=quebra compat). Bloco "O QUE MUDOU NESTA VERSÃO" no topo do Painel Hoje + link discreto
  pro histórico completo.
- Hub é single-file `index.html`, HTML puro, ~36 mil linhas.
- **WPN_ID_MAP** traduz id curto → `wpn_` no boot (CatalogSync). Bug de weapon_id resolvido
  (Peacekeeper 0 → 69).
- **Chaves localStorage principais:** `level.player`, `level.weapons`, `level.loadouts`
  (via LevelDB); `USER_IMG_KEY` = `bo7hub_user_images_v1` (cofre único de TODAS as imagens do
  usuário: armas, emblemas, mapas, avatar, itens do Construtor e Vantagens); `level.sync.local_id`;
  `level.auth.session` (sessão Auth).
- **TAB_TO_CATSUB** mapeia cada aba de Configurações → categoria/subcategoria de imagem.
- **Emblemas de Prestígio:** 100% via upload do usuário (sem WebP base64 embutido).
  PRESTIGE_ITEMS (linha ~13758) tem 11 ids P1–P10+Master. P10 Death + Master Demon of War:
  zero código, só upload.
- **Imagens:** USER_IMG_MAX_SIZE = 720px + WebP 0.92. Imagens antigas em 200px continuam blur até reupload.
- **i18n:** ~95% coberto (676 elementos, ~815 chaves PT+EN). Pendências: Meus Loadouts (5KB) e
  Construtor (8KB).
- **Bug recorrente conhecido:** navegação tab-based é frágil (clicar arma já voltou pra aba
  Loadout). Atenção a mudanças de navegação.
- **Modal "ARMAS DETECTADAS" (importação de captura, v96, 1/Jun):** agora SEMPRE mostra um
  seletor de arma (`<select>` do catálogo) + botão "Abrir no Construtor". Vem pré-selecionado no
  match automático; se a Vision não casa o nome (ex: leu "VOYAK XT-3" em vez de "Voyak KT-3"), o
  usuário escolhe da lista e importa na mesma — os attachments lidos são re-mapeados contra a arma
  escolhida. Antes só mostrava botão se a arma casava no catálogo (travava sem opção de salvar).
  Funções: matchWeapon (fuzzy bestMatch), matchAttachment, buildApprovalCard, importIntoBuilder.
- **Dica de uso da captura:** fotografar a tela do GUNSMITH (nome da arma no topo + attachments),
  não a tela de seleção de loadout (que só mostra codenames). Print nítido, bem iluminado, esperar
  nomes longos pararem de rolar. A precisão da leitura depende da qualidade do print (limite do Gemini).

---

## 8. ARSENAL E PERFIL DO OPERADOR

**Status:** Prestige 6, Level 39 (confirmado no banco 1/Jun/26; era P4 L50 em 13/Mai — evoluiu).
Estilo rusher. PS5.

**Arma principal:** Sturmwolf 45, Weapon Prestige 2 (✦✦). Build **CICADA 3301-45**
(.40 Conversion Kit, 5-attach): FANG HoverPoint ELO, VAS Convergence Foregrip, MFS Tigris .40 Cal Mag,
Selene Rover Grip (Permanent Attachment Token aqui, Lvl 28), .40 Cal Overpressured.
Stats: range +27%, TTK 300ms até 26m, 600 RPM, mag 30. Build code: `S07-43S8E-MGLI4-5511`.

**Arsenal (25 armas, snapshot 20/Mai/26):**
- Snipers: Strider 1/37, Hawker HX 22/38 (build ANTARES — Warzone OSK: Tishina-11+Teleos Range+
  Ridge Grip+Volant Tight+Infiltrator Stock; HX-ANTR-OSKW-2205), VS Recon 19/45, Shadow 23/46, XR-3 16/44.
- SMGs: VST 21/39, REV-46 19/34, Sturmwolf P2 ATIVA, Kogot 36/39, Ryden 24/42, RK-9 1/42,
  Razor MAX, Dravec 14/36, Carbon 20/41, MPC 14/42.
- ARs: MK35 21/43, Voyak P1 19/42, EGRT 9/41, Maddox 33/43, M15 16/47, AK 24/47, MXR 6/47,
  X9 4/42, DS20 10/43, Peacekeeper 60/250.

**Prestige & Unlocks:** Tokens Permanent usados (4): Lightweight + Ghost + Ninja + Gunfighter Wildcard.
Mapa de unlocks por level: Lvl6 Scavenger, Lvl9 Blast Link, Lvl11 Tac Sprinter, Lvl14 Fast Hands,
Lvl17 Cold-Blooded, Lvl18 Gung Ho, Lvl21 Flak Jacket, Lvl26 Ghost, Lvl27 Assassin,
Lvl29 Gunfighter Wildcard, Lvl33 Perk Greed, Lvl45 Lightweight, Lvl53 Ninja.

**Regras de gameplay (preferências fixas do Victor):**
- Tudo otimizado pra rusher agressivo (CQB). **Marksman rifles vetadas.**
- Permanent Unlock só vale pra itens de level alto (≥40). Lightweight e Ninja foram acertos.
- Foco de grind: Sturmwolf P2 → Voyak P1→P2 → snipers.
- Controller: MP normal (não CDL), +aim assist, +agressividade. **ADS Multiplier 0.85**
  (fix do "atiro 1º mas morro"). **Dexterity** = prioridade máxima contra flinch.
- Áudio: mix Headphones (passos valem mais que minimapa).

---

## 9. ARQUITETURA DE IA (visão)

- Hoje a "IA" é **motor de regras determinístico em JS** (analyzeLoadout = score 0-100, tier S-D;
  STRUGGLE_CATALOG = 8 dificuldades com why+tips+nota 0-10). Auditável.
- **Meta:** IA efetivamente ativa. Doc `LEVEL_IA_Especificacao.md` escrito no PRESENTE como se já
  fosse ativa (Victor pediu assim).
- **Consenso de arquitetura:** híbrido. Motor de regras = cérebro (scoring determinístico,
  auditável). LLM = camada de linguagem/coaching presa a SCHEMA FECHADO.
- LLM próprio inviável pra 1 usuário (só API, ou fine-tuning futuro). Cloud/aprendizado coletivo
  prematuro (1 user; cloud só serve sync). RAG depende de schema de vetores + normalização
  (aguarda amigo cientista de dados).
- **Fonte de dados:** codmunity.gg (primária dos números), Game8 (fallback/verificação).
  Risco: se codmunity mudar layout/fechar, catálogos viram lixo → precisa plano B de
  scraping/cache local versionado.

---

## 10. ROADMAP (ordem de prioridade, atualizado 25/Mai/26)

1. **user-assets bucket** — migrar imagens localStorage → Storage. (Backend pronto: bucket existe,
   user-asset v4 no ar com Auth. Falta ligar o fluxo de imagens do Hub ponta a ponta e testar.)
2. **cat_struggles BD + admin UI** — (Edge Function admin-cat-struggles v3 já existe.)
3. **UI Codenames** — admin + botão "Sugerir" em build/loadout. (cat_codenames + admin-cat-codenames existem.)
4. **Avatar IA Nano Banana 2.**
5. **PRE-MATCH ADVISOR** (grande) — em tempo real, sugere loadout/arma conforme mapa + modo MP
   (TDM, Dom, Hardpoint).

Também pendentes: Marketplace (`db.market.*`), i18n EN Loadout/Meus Loadouts, seções Áudio e
Vídeo do doc IA, migração do `pullAll` pra Auth, migração das capturas de telemóvel pra Auth.

---

## 11. COMO TRABALHAR COM O VICTOR (preferências)

### Comunicação
- Respostas em **pt-BR**, diretas, **uma coisa por vez**, sem listas de opções.
- Todo termo técnico de jogo recebe resumo entre parênteses logo após (hipfire, ADS, TTK,
  sprint-to-fire, slide-cancel, dropshot, gun kick, flinch, etc.) — proativamente.
- Recomendações **decisivas**, sem hedging nem listas de alternativas.
- Instruções mapeiam exatamente a UI visível na tela.
- Em UIs de terceiros: sempre o **link direto** do painel; nunca chutar nomes de botões/menus
  (pedir screenshot ou usar descrição genérica).
- DevTools Chrome: avisar ANTES que o Chrome bloqueia paste no console; pra liberar, digitar
  `allow pasting` + Enter. Lembrar proativamente em toda sessão que exigir DevTools.

### Atenção / ritmo (Victor tem TDAH + ansiedade)
- Evitar listas longas, despejos de texto, "também posso X, Y, Z" no fim (gatilho de paralisia).
- Foco total, próximo passo concreto.
- **NUNCA mencionar limites de uso/sessão/tokens.** Não pausar preventivamente nem fazer
  checkpoint antecipado (gatilho de ansiedade). Trabalhar até o fim real da tarefa.

### Estética do Hub
- **Zero emojis** em UI nova (📷 🎯 ✅ etc.). Padrão: ícones SVG inline, tipografia limpa.
  Emojis só se Victor pedir explicitamente.

### Workflow de desenvolvimento
- Victor anexa o `index.html` atual no início de cada sessão. Sem o arquivo, Claude trabalha
  em base errada.
- Edições via Python `read → str_replace → write` em `/home/claude/hub.html`.
- Validação JS: extrair maior bloco `<script>` via regex → `/tmp/c.js` → `node --check`.
- Deploy do Hub: `cp` para `/mnt/user-data/outputs/index.html` + `present_files`.
- Ao fim da sessão: Claude deixa a versão final em `/mnt/user-data/outputs`.
- **Victor NÃO usa mais Google Drive nem Files do Projeto pra backup** (parou 31/Mai). Guarda no
  **GitHub**. NÃO insistir em Drive/Files do Projeto.
- Claude não tem escrita no Files do Projeto nem no Drive (read-only). Gera em /outputs; Victor sobe.
- Mudança de frontend que afete dados/schema exige backend Supabase na MESMA sessão.

### Catálogo (princípios)
- Nunca inventar dados. Só registrar attachments verificados na fonte. Gaps ficam como gaps.
- Uma arma por vez. codmunity = nomes genéricos; Game8 = nomes de marca (já reconciliado no banco).

---

*LEVEL · BO7 Tactical Hub — documento mestre de estado e convenções. Atualizar ao fim de cada
marco do projeto e commitar no repo `level-hub` junto do index.html.*
