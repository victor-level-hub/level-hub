# LEVEL · ESTADO DO PROJETO
> Memória estendida do BO7 Tactical Hub. Atualizado a cada marco.
> **Última atualização:** 8 Jun 2026 — fecho do marco de Análise (v2.15 → v2.20) + Edge Function `analyze-build` v4

---

## 0. COMO USAR ESTE DOCUMENTO (handoff de chat)

Ao abrir um chat novo, anexar **sempre**:
1. `index.html` (o estado atual do Hub — sem ele, trabalha-se de base errada)
2. Este `LEVEL_ESTADO.md`

Sem o `index.html` anexado, **não começar a editar**. Pedir o arquivo primeiro.
Quando houver dúvida se a base está atual, conferir via `curl` contra o GitHub raw — a versão no GitHub é a fonte da verdade.

---

## 1. IDENTIDADE & REGRAS DE COMUNICAÇÃO (sempre ativas)

- Respostas em **pt-BR**
- Todo termo técnico de jogo em inglês (hipfire, ADS, TTK, sprint-to-fire, slide-cancel, dropshot, recoil, handling…) → **tradução/resumo em português entre parênteses** logo após, **proativamente**, sem pedir. Abreviações (ADS, TTK, CQB, FOV, DPS, RPM…) → significado por extenso também
- **Recomendações decisivas** — nunca listas de opções para escolher (exceto quando Victor pede alternativas explicitamente); uma coisa por vez
- Victor tem **TDAH + ansiedade**: evitar listas longas, despejos de texto, "também posso X, Y, Z" no fim. **Nunca** mencionar limites de uso/sessão/tokens
- **Sem emojis em UI nova** — apenas SVG inline (registro Lucide). Emojis só se Victor pedir
- **Nunca** sugerir Google Drive nem Project Files — Victor usa exclusivamente o GitHub desde 31/Mai/26
- Links externos: sempre a URL **mais profunda** possível + passos concretos do destino. Nunca chutar nomes de botões
- DevTools Chrome: avisar **antes** que o Chrome bloqueia paste — Victor digita `allow pasting` no console e Enter para liberar
- **Plataforma = LEVEL** (palíndromo). Coach IA dentro do Hub = **Le Vél** (personagem; ver §1.A)

### 1.A · Voz do Le Vél (atualizada v2.19+)
Direto, técnico e decisivo — **MAS humano e caloroso** (mudança pedida pelo Victor). Trata o operador **pelo nome**, reconhece o esforço da build antes de criticar, encoraja. Firmeza COM empatia: sem "talvez/considere", mas nunca frio, seco ou submisso. Frases-marca: "Operador, próximo passo.", "Analisei. Vamos ao plano.", "Não recomendo. Te explico por quê."

---

## 2. ESTADO ATUAL DO HUB

**Versão:** `v2.20.0` (SemVer desde v2.0.0)
**Arquivo:** single-file `index.html` (~2,76 MB, ~40.798 linhas, 15 blocos `<script>`)
**Stack:** HTML/CSS/JS inline + Supabase backend
**Deploy:** repo `victor-level-hub/level-hub` (privado) → branch main → auto-deploy Netlify → domínio le-vel.games

### Identidade visual — FECHADA (marco v2.6.x, mantida)
- Logo **LEVEL** própria em SVG embutido (corpo laranja `#FF9800`, detalhes azul-claro `#AEC7E0`, recorte triangular vazado no 2º E). LEVEL na sidebar + tela de login; **Call of Duty: Black Ops 7** no cabeçalho.
- Paleta de fundo recalibrada (`--bg-darkest #141a2b` … `--bg-row-hover #303d5f`), **sem scanline**.
- Fontes: **Black Ops One** + **JetBrains Mono**.
- Elemento de marca: "cunha" (corte triangular de espaço negativo entre o 2º E e o L no wordmark).

### Marcos recentes (v2.7 → v2.20)
- **v2.12.1** — componente `.help-pop` (popover de ajuda) substituindo tooltip nativo; hover (CSS) + clique/toque (JS, guard de 60ms p/ bug de duplo evento SVG); variante `.help-pop-right`/`-left`.
- **v2.13.0** — admin UI para `cat_glossary` em Configurações · Operador + Edge Function `admin-cat-glossary` (ações list/upsert/upsert_pair/delete/delete_pair; `verify_jwt:false`; auth via `x-level-admin-secret`).
- **v2.14.0** — tradutor de glossário (sistema de TRADUÇÃO, switch "Termos") estendido a Constructor e Minhas Armas (`data-glossary-zone`); `data-glossary-skip` protege nomes próprios.
- **v2.15.0** — 10 tooltips de ajuda contextuais (`.help-pop`) em 7 seções + fix das estrelas amarelas (AVALIE).
- **v2.15.1** — inversão do título no seletor de attachments: **nome do modelo** em destaque, **categoria** em cinza (como no Gunsmith do jogo).
- **v2.16.0** — **explicações dos stats no Construtor**: os 22 stats da linha verde/vermelha viraram termos do glossário de EXPLICAÇÃO (hover/toque mostra o que melhora/piora). Verde/vermelho preservado; "?" suprimido na linha densa.
- **v2.17.0** — **dicas nos tipos de ótica**: óticas não têm stats (0 de 43), então o TIPO da mira (Reflex/Holographic/Hybrid/Thermal/Scope/Target Finder/Iron Sight — 7 famílias, mapeadas por palavra-chave) ganhou tooltip. Só o slot `Optic`.
- **v2.18.0** — **fix do "destrocar"** na análise de build (convergência). Ver §5.A.
- **v2.19.0** — **Le Vél mais empático**: envia `player.name` + `weapon_rating` à IA; re-analisar pede avaliação fresca da arma; + Edge Function `analyze-build` **v4**.
- **v2.20.0** — **contraponto nas sugestões de troca** (o que a troca custa, calculado no motor) + fix do título do changelog (entidades HTML cruas).

---

## 3. AUTH & BACKEND

- Auth email+senha (Path B, fechado 1/Jun/26), Confirm email OFF, 18+ universal.
- Victor: `auth.uid = 1438a611`, `hub_users.id = 3fa59ebd`.
- Supabase: conta GitHub `victor-abap-pt`, projeto `bo7-tactical-hub` (ref `cqkhqtgmolmrfgzozocr`, sa-east-1).
- **Admin secret:** `level_admin_…` (header `x-level-admin-secret`) — para Edge Functions admin.
- Cloud save usa `window.LEVEL_AUTH.getClient().auth.getSession()` para o JWT (NÃO existe `LevelAuth.getToken`).

### Edge Functions (Deno, subdiretório `slug/index.ts` + `slug/deno.json`)
- `sync-push v6`, `sync-pull v6`, `user-asset v4` — `verify_jwt:true`, auth.uid.
- `analyze-build` **v4** — análise de build (Gemini 2.5 Flash). Ver §5.A. `verify_jwt:true`.
- `analyze-capture v6` — Vision das capturas mobile (Gemini 2.5 Flash), instrumentado em `ana_gemini_usage`.
- `admin-cat-glossary` — CRUD do glossário (`verify_jwt:false`, secret no header).
- `upload-avatar-selfie` — pipeline do avatar (futuro).

### Tabelas relevantes
- `cat_attachments` = **1102 rows**, 25 armas, fonte codmunity — **NÃO MEXER**.
- `cat_glossary` — termos PT+EN do tradutor (sistema de TRADUÇÃO; distinto do objeto `GLOSSARY` de explicação — ver §7).
- `hub_build_ratings` — histórico da avaliação da arma (AVALIE): `rate_of_fire, mobility, recoil, accuracy, range_rating, rated_at`. RLS dono-lê-o-seu + service_role.
- `ana_gemini_usage` — telemetria de tokens/custo/latência por chamada Gemini.
- `hub_builds` — **não tem coluna de ratings** (por isso `hub_build_ratings` é a fonte da verdade das notas).
- `user-assets` bucket existe, **RLS policies ainda pendentes**.
- Gemini: 2.5 Flash. Avatar futuro = Nano Banana 2 (`gemini-3.1-flash-image-preview`).

> **RLS Supabase:** toda tabela com RLS habilitada precisa de ≥1 policy SELECT imediatamente — RLS com zero policies bloqueia queries autenticadas silenciosamente (status 200, `data:null`); Edge Functions com service_role mascaram o problema.

---

## 4. PERFIL DO JOGADOR (gameplay sempre ativo)

- PS5, estilo **rusher agressivo CQB**. Marksman rifles **vetadas**.
- Controller: MP normal (não CDL), +aim assist, +agressividade; **ADS Multiplier 0,85**.
- **Dexterity perk = prioridade máxima** (combate flinch — desvio de mira ao levar tiro).
- Áudio: mix **Headphones** (passos valem mais que mini-mapa).
- Permanent Unlock só itens de level alto (≥40 servem ao rusher): Lightweight, Ninja confirmados.
- Prestige/Level oscilam — **confirmar com Victor por sessão** se relevante. Arsenal e loadout ativo também mudam; não fixar build específica neste doc.

---

## 5. PRÓXIMAS PENDÊNCIAS (roadmap por prioridade)

1. **Análise de build com veredito** — **largamente FEITA** nos marcos v2.18–v2.20 (convergência + empatia + contraponto). Resta o passo server-side completo: fazer a `analyze-build` **decidir** as trocas (hoje o motor só veta no front) e a IA só **explicar** — ver §5.A "próximo passo".
2. **Histórico de análises no BD (coaching de evolução)** — ideia do Victor, reenquadrada: guardar cada análise NÃO para policiar redundância (isso o guarda já resolve), e sim para mostrar a **jornada da build** ao longo do tempo. Casa com `hub_build_ratings` (já guarda o histórico de percepção).
3. **Tombstones de builds deletados** (sync pendente no Supabase) + push do arsenal localStorage→banco (IDs ainda fora do banco: `m15`, `ds20`, `1911`, `coda9`, `jager45`, `velox57`, `aarow109`, `arcm1`, `siren`, `nxravager`).
4. **user-assets bucket** — RLS policies + migração de imagens localStorage→Storage (paths por auth.uid) + migração das capturas mobile (QR→auth.uid).
5. **UI Codenames** (admin + botão "Sugerir Codename").
6. **Avatar IA Nano Banana 2** — arquitetura definida (Gemini `gemini-3.1-flash-image-preview`, buckets `avatar-selfies`+`avatar-generated`, tabela `avatar_sessions`).
7. **PRE-MATCH ADVISOR** (futuro grande) — sugere loadout/arma por mapa+modo em tempo real. Consome a fundação da análise.
8. **Marketplace** + **i18n EN** (Meus Loadouts ~5KB e Construtor ~8KB ainda sem EN).

---

## 5.A · ANÁLISE DE BUILD — ARQUITETURA ATUAL (pós v2.20.0)

### O que era o problema (resolvido em v2.18.0)
A análise sugeria trocar A→B e, depois de aplicada, na re-análise mandava B→A (loop). Causa: o `style_hint` era **inferido da própria build** e as fraquezas eram relativas ao que estava equipado — ao trocar, o "objetivo" se movia. Quem decidia as trocas era o LLM, sem critério fixo nem memória.

### Como está montado hoje (`index.html`, dentro do IIFE do Constructor)
- **Motor determinístico** (`_computeBuildContext`): agrega stats em 5 dimensões (recoil, mobility, handling, range, mag via `ANALYSIS_DIMS`), identifica fraquezas e pré-filtra `candidates_by_weakness`.
- **Objetivo FIXO** (v2.18): `_styleObjectiveWeights(sp)` deriva pesos por dimensão do **perfil** do operador (rusher CQB → handling 2.2, mobility 2.0, recoil 1.0, range 0.2, mag 0.5), NÃO da build. `style_hint` enviado à IA passou a ser o estilo fixo do perfil.
- **Guarda de convergência** (v2.18): `_attStyleScore(stats, w)` pontua cada attachment; `_gateBuildSuggestions()` só deixa passar troca cujo ganho > margem (6). O reverso de uma troca boa tem delta negativo → sempre vetado → **idempotente**. Sem troca que passe → veredito **"no teto"** (card verde `.bc-analysis-verdict`).
- **Contraponto** (v2.20): `_attDimGoodness(stats)` + `_swapTradeoffHtml(s, build)` calculam a **dimensão que mais piora** numa troca e mostram a linha âmbar "Em troca:" (`.bc-sug-tradeoff`). Determinístico, não sai da IA. Só em troca real (`replaces`); perk/slot vazio não têm.
- **Payload enviado à `analyze-build`** (em `requestAIAnalysis`): `player_profile` (com **`name`** = `player.name`), `weapon`, `build`, `stats_totals`, `weaknesses`, `candidates_by_weakness`, `perks_pool`, `style_hint` (fixo), **`weapon_rating`** (AVALIE — `build.userRatings`), `active_struggles`, `language`.
- **Render**: `_renderAIAnalysisHtml(analysis, build, ctx)`; análise cacheada em `build.config.aiAnalysis`. `analysis = { summary, suggestions:[{type, slot, replaces, name, unlock_level, rationale}], verdict }`.
- **Re-analisar** (v2.19): se já há análise, `_reanalyzeWithRatingPrompt` pergunta (via `window.LevelModal.confirm`) se quer avaliar a arma antes — "Avaliar agora" leva à aba AVALIE (`data-bc-tab="rating"`), "Re-analisar assim mesmo" segue.

### Edge Function `analyze-build` v4 (deployada à parte no Supabase)
- System prompt do **Le Vél** reescrito: trata pelo **nome**, tom **empático** (firme mas humano), usa **`weapon_rating`** pra mirar a dimensão de nota baixa (a dor do operador), e — quando `active_struggles` vem vazio — **convida** (pelo nome) a registrar as dificuldades na seção **Evolução** (melhora a acurácia).
- `temperature` 0.4 → **0.2** (texto mais estável).
- Schema fechado + anti-alucinação mantidos: `name` valida contra `candidates_by_weakness`/`perks_pool`; `replaces` contra `build.attachments[].name`.

### Próximo passo (não feito)
Fazer a `analyze-build` **decidir** as trocas a partir dos `recommended_swaps` do motor (em vez de escolher as dela) — fecha 100% o descompasso entre o texto da IA e os cards. Hoje o front veta (guarda), o que já mata a reversão; o resto é polimento server-side.

---

## 6. WORKFLOW & PADRÕES TÉCNICOS

- Edições via Python `read → str_replace → write` em `/home/claude/hub.html`, **nunca** edição manual de linhas. `assert count == 1` antes de cada substituição. Âncoras longas e únicas (linhas mudam de sessão p/ sessão — `grep -n` para confirmar).
- Validação após cada mudança: `node --check` em **cada** bloco `<script>` extraído + `html5lib` (confirmar **1 `<main>` + 13 `<section>`**) quando mexer no Histórico de Versões.
- **Bug estrutural recorrente:** inserir `vh-entry` via `str_replace` pode consumir o `<div>` da entrada seguinte → `</div>` órfão fecha `<main>` cedo e expulsa seções. **Sempre validar com html5lib após inserir vh-entry.**
- Mudanças visuais: **renderizar com Playwright** (chromium headless) e inspecionar screenshot ANTES de entregar.
- Output final: `/mnt/user-data/outputs/index.html`; Victor commita no GitHub. Edge Functions: entregar `.ts` + passos de deploy (Victor deploya).
- SemVer: PATCH=bugfix/visual, MINOR=feature, MAJOR=quebra.

### Checklist de entrega (listar ao fim)
1. SemVer bump · 2. Footer `LEVEL vX.Y.Z` + ver-tag · 3. Bloco "O QUE MUDOU" (Painel Hoje) · 4. Entry no topo do Histórico · 5. Título do commit <50 chars · 6. Descrição do commit (corpo com bullets — nunca omitir) · 7. Link direto ao destino.
Itens 1–4 só em releases do Hub. 5–7 valem para todo arquivo commitado.

### Aprendizados-chave (consolidados)
- **i18n / acentos:** `data-i18n` escreve via `textContent` → **NÃO decodifica entidades HTML** → usar **acento cru** ('é', 'ã'). `data-i18n-html` usa `innerHTML` → entidades (`&eacute;`) funcionam. (Causa do título quebrado, corrigido v2.20.0.)
- **Dois sistemas de glossário:** (1) `LevelGlossary`/`cat_glossary`/switch "Termos" = **TRADUÇÃO** (parêntese). (2) objeto `GLOSSARY` + `.g-term` + `#glossary-tooltip` = **EXPLICAÇÃO** (title+desc no hover/toque). Os tooltips de stats (v2.16) e óticas (v2.17) usam o objeto `GLOSSARY`. `.g-term` usa `color:inherit` (preserva verde/vermelho).
- `formatStats` envolve o nome do stat em `.g-term`; o "?" do glossário é suprimido na linha densa via CSS (`.att-chooser-item-meta .g-term::after{display:none}`).
- Óticas não têm `stats` no catálogo (0 de 43) → o tooltip prende no **label do tipo**, não em stat.
- Helpers úteis: `window.LevelModal.confirm(opts)→Promise<bool>` (opts: title/message/confirmText/cancelText), `window.LevelModal.toast`/`showToast(msg,type)` global. Abas do build-card: `data-bc-tab="loadout|analysis|rating"`. Nome do operador: `player.name`. Avaliação da arma: `build.userRatings` (chaves `rateOfFire/mobility/recoil/accuracy/rangeRating`).
- `cbt()` vive dentro do IIFE do Constructor (acessa só `CBI18N`); strings da UI principal em `window.I18N`. Expor como `window.cbt` se outro IIFE precisar.
- Edge Functions: deploy requer subdiretório (`slug/index.ts` + `slug/deno.json`); `index.ts` bare na raiz dá `InternalServerErrorException` que parece instabilidade mas é erro estrutural.
- INSERT grande (>20KB) inline no `execute_sql` é não confiável → padrão: Edge Function temporária com secret + payload via `curl`, neutralizar depois.

### Fontes de dados do jogo
- **codmunity.gg** — fonte primária de attachments e de **significados de stats** (`/weapon-stats/bo7`, `/weapon/bo7/[slug]`). `web_search`/`web_fetch` para significados (sem permissão); `browser_batch` para dados (precisa aprovação por sessão).
- **Patch notes oficiais** (callofduty.com) + game8/GamesRadar — confirmaram Jump ADS, Jump Sprint to Fire, Slide/Dive to Fire (omnimovement), First Shot Recoil, Kick Reset Speed, e os tipos de ótica.

### Links diretos
- Netlify: app.netlify.com · Supabase: supabase.com/dashboard/project/cqkhqtgmolmrfgzozocr · GitHub: github.com/victor-level-hub/level-hub · Function: supabase.com/dashboard/project/cqkhqtgmolmrfgzozocr/functions/analyze-build/code

---

## 7. MONETIZAÇÃO (decidido 18/Mai/26)

- **FREE:** regras determinísticas, até 5 loadouts.
- **PLUS R$19,90/mês:** IA conversacional, Vision API, coaching, loadouts ilimitados, sync, "Falar com Le Vél".
- **PRO R$49,90/mês:** replay analysis, coach session, meta builds, comunidade.
- **Founder vitalício:** 100 primeiros Plus / 50 primeiros Pro — preço travado, badge permanente.
- BYOK descartado (fricção mata conversão); backend centralizado para Plus.

---

*LEVEL · BO7 Tactical Hub — documento de estado. Regenerar ao fim de cada marco.*
