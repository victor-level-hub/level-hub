# LEVEL · ESTADO DO PROJETO
> Memória estendida do BO7 Tactical Hub. Atualizado a cada marco.
> **Última atualização:** 11 Jun 2026 — v2.27.0 (Histórico de Análises)

---

## 0. COMO USAR ESTE DOCUMENTO (handoff de chat)

Ao abrir um chat novo, anexar **sempre**:
1. `index.html` (o estado atual do Hub — sem ele, trabalho de base errada)
2. Este `LEVEL_ESTADO.md`

Sem o `index.html` anexado, **não começar a editar**. Pedir o arquivo primeiro.

---

## 1. IDENTIDADE & REGRAS DE COMUNICAÇÃO (sempre ativas)

- Respostas em **pt-BR**
- Todo termo técnico de jogo (hipfire, ADS, TTK, sprint-to-fire, slide-cancel, dropshot, gun kick, etc.) → **tradução/resumo em português entre parênteses**, proativamente. Abreviações (ADS, TTK, DPS, RPM, CQB, FOV) → significado por extenso também
- **Recomendações decisivas** — nunca listas de opções pro Victor escolher (exceto quando ele pede explicitamente alternativas)
- **Uma coisa por vez** — Victor tem TDAH + ansiedade; próximo passo concreto, sem despejos de texto
- **Sem emojis em UI nova** — apenas SVG inline / Lucide. Emojis só se Victor pedir
- **Nunca** mencionar limites de sessão/tokens/uso
- **Nunca** sugerir Google Drive ou Files do Projeto (Victor parou 31/Mai/2026). Memória estendida = este `LEVEL_ESTADO.md` commitado no repo
- Ao orientar UIs de terceiros: **sempre link direto** (URL mais profunda possível) + passos concretos; nunca chutar nomes de botões
- DevTools Chrome: avisar **antes** que Chrome bloqueia paste e mostra warning amarelo — Victor digita `allow pasting` no console e Enter antes de colar
- **Plataforma = LEVEL** (palíndromo). Coach IA dentro do Hub = **Le Vél** (personagem, tom direto/técnico/empático, trata o operador pelo nome)

---

## 2. ESTADO ATUAL DO HUB

**Versão:** `v2.27.0` (SemVer desde v2.0.0)
**Arquivo:** single-file `index.html` (~3,24 MB, ~42.900 linhas, 16 blocos `<script>`)
**Stack:** HTML/CSS/JS inline + Supabase backend
**Deploy:** repo `victor-level-hub/level-hub` (privado) → branch main → auto-deploy Netlify `le-vel-hub` → domínio le-vel.games
**Captura mobile:** repo `victor-level-hub/bo7-capture` → `level-capture.netlify.app`

### Marcos recentes
- **v2.27.0** (11 Jun) — **Histórico de Análises.** O modal de Histórico (botão na toolbar de Minhas Armas) virou unificado com 2 abas: "Builds Geradas" (gen_history) e "Análises" (novo). Cada análise do Le Vél é registrada automaticamente: veredito, sugestões, ponto fraco percebido (weakest_dim), dificuldade ativa. Filtrável por arma. Backend: tabela `analysis_history` + gravação no `analyze-build` v5 + Edge `analysis-history` v1 (list/delete).
- **v2.26.1** (11 Jun) — duas correções no Histórico de Builds: (1) ângulo da variante (VELOCIDADE/EQUILÍBRIO/CONTROLE) agora grava certo ao salvar do fluxo de variantes simultâneas — antes vinha `null`; (2) render do estado vazio e dos cards corrigido (usava `renderIconsText` que escapa HTML → tags cruas na tela; trocado por `renderIconsHtml`).
- **v2.26.0** (11 Jun) — **Histórico de Builds.** Gerações da Montagem Inteligente que o operador adota (salva) ficam registradas. Botão "Histórico" na toolbar de Minhas Armas → modal filtrável por arma. Cada card: codename, ângulo da variante (VELOCIDADE/EQUILÍBRIO/CONTROLE), foco, modo, mapa, dificuldade ativa na época, attachments, data. **Opção 1: grava só no save** (não em toda geração). Backend: tabela `gen_history` + Edge Function `gen-history` v1.
- **v2.25.1** (10 Jun) — polimento dos cards de evento: ícones SVG removidos, badges ATIVO/EM BREVE viraram overlay no canto superior direito da arte.
- **v2.25.0** (10 Jun) — variantes simultâneas na Montagem Inteligente (2-3 gerações em paralelo, ângulos VELOCIDADE/EQUILÍBRIO/CONTROLE) + arte oficial do Double XP. Edge `generate-build` v3.
- **v2.24** — mapa na Montagem (pergunta de mapa quando MP).
- **v2.22.1** — toolbar Minhas Armas reorganizada (Montagem Inteligente · Importar Build ▾ · + Adicionar Arma).
- **v2.6.x** — identidade visual fechada (logo LEVEL própria, paleta recalibrada, scanline removido).

---

## 3. AUTH & BACKEND

- Auth email+senha ativo, Confirm email OFF, 18+ universal
- Victor: `auth.uid = 1438a611`, `hub_users.id = 3fa59ebd-b507-4f87-bf24-61e39d4ca785`, `local_id = u_mpk3pyux_y3eo55ua`, display_name VICTOR
- Supabase: conta GitHub `victor-abap-pt`, projeto `bo7-tactical-hub` (ref `cqkhqtgmolmrfgzozocr`, sa-east-1)
- Gemini 2.5 Flash (Vision + texto); Avatar: Nano Banana 2

### Edge Functions ativas (principais)
- `generate-build` v5 — Montagem Inteligente (Gemini). Campo opcional `variant_angle` {id, label, directive} + R13. `verify_jwt: true` (front manda anon key, que é JWT válido)
- `parse-build-text` v1 — Capturar via Texto (fuzzy matching 3 camadas)
- `analyze-build` v6 — análise de build com veredito (arquitetura híbrida: engine determinística + IA redige)
- `analyze-capture` v13 — Vision API (foto → build)
- `analysis-history` v1 — **NOVO (v2.27.0)** — leitura do histórico de análises. 2 actions: `list` / `delete` (o `record` acontece dentro do `analyze-build` v5). service_role, resolve local_id→hub_users.id. `verify_jwt: true`. URL: `.../functions/v1/analysis-history`
- `gen-history` v1 — **NOVO (v2.26.0)** — histórico de gerações adotadas. 3 actions: `record` / `list` / `delete`. service_role, resolve `local_id`→`hub_users.id`, CORS, friendly errors. `verify_jwt: true`. URL: `https://cqkhqtgmolmrfgzozocr.supabase.co/functions/v1/gen-history`
- `sync-push` v6 / `sync-pull` v6 — sync (JWT do Auth)
- `user-asset` v4 — imagens (JWT)

### Tabelas Supabase (principais)
- `hub_users` (9 rows) — perfil. Tem `prefs jsonb`, `local_id` unique, `auth_user_id`
- `cat_attachments` (1102 rows) — catálogo, fonte codmunity. **NÃO MEXER**. AK-27 weapon_id='ak'
- `cat_weapons` (25), `cat_perks` (14), `cat_struggles` (22, PK id+language text), `cat_maps` (26), `cat_codenames` (125), `cat_glossary` (132)
- `cat_ideal_builds` (build ideal por arma×estilo — fundação do coaching futuro)
- `hub_builds` / `hub_weapons` (33) / `hub_loadouts` / `hub_struggles` / `hub_settings`
- `hub_build_ratings` — **histórico de avaliações por estrelas (5 dims)**, append-only. PADRÃO seguido pelo gen_history
- **`gen_history`** — **NOVA (v2.26.0)**. 16 colunas: id, user_id (FK→hub_users CASCADE), weapon_id/name/class, codename, variant_angle ('speed'|'balanced'|'control'|null), focus, game_mode, map_name, active_struggle (snapshot textual), slots/perks/stats_summary (jsonb), created_at, server_updated_at. RLS + 3 policies (select/insert/delete own via auth.uid). Índices: (user_id, created_at DESC) e (user_id, weapon_id)
- `ana_gemini_usage` (53 rows) — tracker Gemini (retenção 90d)
- `user_assets` (24 rows) — índice bucket user-assets

---

## 4. PERFIL DO JOGADOR (gameplay sempre ativo)

- PS5, estilo **rusher agressivo CQB** (combate de curta distância). Marksman rifles vetadas
- **Dexterity perk = prioridade máxima** (combate flinch — tremor da mira ao levar dano)
- **ADS Multiplier 0.85** (sensibilidade ao mirar). Áudio mix **Headphones**
- Controller PS5: layout Tactical, Horizontal/Vertical 1.80, ADS Low/Mid 0.85 High 1.00, Aim Response Curve Dynamic, Left Stick Min 0/Max 70, Right Stick Min 1/Max 99, L2/R2 deadzones 0
- Prestige 9 / Level ~14 (oscila — confirmar se relevante)
- Arsenal: 33 armas cadastradas

---

## 5. PRÓXIMAS PENDÊNCIAS (roadmap por prioridade)

> A V2 da Montagem Inteligente está **fechada**: mapa (v2.24) + variantes (v2.25) + histórico (v2.26).

1. **Plano de progressão até a build ideal** — roadmap de attachments a desbloquear (level/prestige) pra chegar na build ideal curada (`cat_ideal_builds`). Consome a tabela que já existe
2. **Loadout completo Primary + Secondary** — montar loadout inteiro, não só arma primária (`hub_loadouts` já tem a estrutura)
3. **Decisão server-side de análise** (engine decide swaps, IA só explica) — evoluir `analyze-build`. Hoje a IA tem mais autonomia do que devia no veredito
4. ✅ **Histórico de análises no banco** — FEITO (v2.27.0): tabela `analysis_history` + gravação no `analyze-build` v5 + Edge `analysis-history` v1 + UI (aba no modal de histórico). Backend e front completos, testados em produção.
5. **e-mail de eventos** — notificar novos eventos por e-mail (precisa coletar emails + Resend/SendGrid + cron)
6. **Controller fase 2** — mais ajuste fino além do que já está mapeado
7. **user-assets** — migração RLS do bucket + migração de storage (localStorage→Supabase, paths por auth.uid)
8. **UI Codenames** (admin + botão "Sugerir" em build/loadout)
9. **Avatar IA Nano Banana 2**
10. **Pre-Match Advisor** (futuro grande) — sugere loadout/arma conforme mapa + modo MP em tempo real
11. **Marketplace** + **i18n EN** (Loadout/Meus Loadouts) — menor prioridade
12. **Atualização de dados de Eventos por Season** — manter a grade de eventos do Painel Hoje em dia

---

## 6. WORKFLOW & PADRÕES TÉCNICOS

### Edição
- Sempre via Python `read → str_replace → write` em `/home/claude/hub.html`, **nunca** edição manual de linhas
- `str_replace` com `assert count == 1` antes de cada substituição; âncoras longas/únicas
- **Validação obrigatória após mudanças:**
  - `node --check` em **todos** os 16 blocos `<script>` (extraídos via regex `re.findall(r'<script[^>]*>(.*?)</script>', src, re.S)`, gravados em arquivo `/tmp/*.js` — NÃO testar via `/dev/stdin`, dá falso-positivo de falha)
  - `html5lib` após mudanças estruturais: deve mostrar **1 `<main>` + 13 `<section>`**
- **Inspeção visual:** Hub tem login gate → extrair CSS (`<style>`) + HTML do componente + bloco JS dos ícones (LUCIDE) pra página de teste isolada, renderizar no Playwright (chromium em `/opt/pw-browsers`). **Dica:** extrair a própria função de render do arquivo (ex: `renderGhList`) e rodá-la com dados de teso, em vez de remontar mock — pega bugs reais do código (foi assim que o bug renderIconsText do histórico apareceu)
- Output final: `/mnt/user-data/outputs/index.html`; Victor commita no GitHub

### Checklist de release do Hub (aplicar TODOS e listar no fim)
1. SemVer bump (PATCH=bugfix/visual, MINOR=feature, MAJOR=quebra)
2. Footer `LEVEL · vX.Y.Z` + ver-tag (texto curto do que mudou)
3. Bloco "O QUE MUDOU NESTA VERSÃO" no Painel Hoje — via chaves i18n `briefing.changelog.*` (date/pill/headline/summary), PT **e** EN. Atenção: a data tem 2 espaços após `:` no dict, e EN usa formato `Jun 11, 2026`
4. `vh-entry` no topo do Histórico de Versões (com vh-ver/vh-date/vh-kind/vh-desc)
5. Título do commit < 50 chars
6. Descrição do commit (corpo em bullets — NUNCA omitir)
7. Link direto e completo pro destino externo + passos concretos

### Bugs estruturais conhecidos
- Inserção de `vh-entry` pode consumir a tag de abertura da próxima entry → sempre validar html5lib após (1 main + 13 sections)
- Ícones LUCIDE: o `<svg>` do template só tem `viewBox`; o CSS `.lvl-icon svg` é que aplica `stroke: currentColor; fill: none; stroke-width: 2`. Ao testar ícone isolado, **incluir o `<style>`** ou ele renderiza como bloco preto. Ícones de stroke (ex: `history`) precisam desse CSS
- Resolução de `{{i:NAME}}` em `data-i18n`: o boot detecta via `window.hasIconPlaceholder` e aplica `window.renderIconsText(valor_do_dict)`. Aplicar `renderIconsText` sobre HTML já-renderizado escapa o conteúdo (vira texto cru)
- `str_replace` que falha no meio de um script Python que só grava no final: as edições anteriores **se perdem** (não foram gravadas). Sempre reconferir o estado após erro
- **`renderIconsText` vs `renderIconsHtml`** (ambos em `window`): `renderIconsText` **escapa o HTML** e só resolve `{{i:}}` — usar só em texto plano. Para conteúdo que JÁ contém tags HTML + placeholders de ícone (ex: innerHTML montado com `<div>`), usar **`renderIconsHtml`** (resolve `{{i:}}` sem escapar o resto). Usar o Text no lugar do Html faz as tags aparecerem cruas na tela. Bug pego e corrigido na v2.26.1 (estado vazio + cards do histórico)
- **Apóstrofo em string JS de aspas simples:** dentro de `'...'` no dicionário i18n, `''` (dois apóstrofos) NÃO escapa — fecha a string e quebra o JS. Para apóstrofo literal em conteúdo PT/EN, usar a entidade HTML `&rsquo;` (ex: `weapon&rsquo;s`), nunca `''`. Pego na v2.27.0
- **Âncora de str_replace que começa com aspa:** ao ancorar numa chave i18n como `'gh.noStruggle':`, garantir que o replacement reponha a aspa inicial — senão a linha fica `gh.noStruggle':` sem abertura e quebra o JS. Pego na v2.27.0
- **Ângulo de variante vive no wrapper, não no build:** no fluxo de variantes simultâneas, cada variante é `{angle, build, error}` — o `build` em si NÃO carrega o ângulo. Ao passar `v.build` pra funções que precisam do ângulo (ex: histórico), carimbar antes: `v.build._variant_angle_id = v.angle.id`. Bug pego e corrigido na v2.26.1

### Supabase Edge Functions
- Deploy via MCP `deploy_edge_function` com `files: [{name, content}]` funciona direto pra imports via URL (esm.sh) — sem precisar de deno.json
- Migrations DDL via `apply_migration`; queries via `execute_sql`
- **RLS sem policy bloqueia tudo em silêncio** (status 200, data null) → criar policy na MESMA migration

### Comunicação técnica
- `getLocalId()` lê `localStorage.getItem('level.localId')` — mas o local_id real do Victor no banco é `u_mpk3pyux_y3eo55ua`
- `postJson(url, body)` usa anon key (ANON_KEY) no escopo da Montagem
- `SUPABASE_URL` (não `SB_URL`) é a const visível no escopo da Montagem Inteligente

### Fontes de dados do jogo
- **codmunity.gg**: fonte primária de attachments. Slugs: M15 = `m15-mod-0`, DS20 = `ds20-mirage`
- **Arte oficial de eventos**: `imgs.callofduty.com` via blog oficial → embedar como **base64 WebP**, nunca link CDN externo (regra da casa)

### Links diretos
- Commit: `https://github.com/victor-level-hub/level-hub/upload/main`
- Netlify: app.netlify.com · Supabase: supabase.com/dashboard · GitHub: github.com

---

## 7. MONETIZAÇÃO (decidido 18/Mai/2026)

- **FREE:** regras determinísticas, até 5 loadouts
- **PLUS R$19,90/mês:** IA conversacional, Vision API, coaching, loadouts ilimitados, sync, "Falar com Le Vél"
- **PRO R$49,90/mês:** replay analysis, coach session, meta builds, comunidade
- **Founder vitalício:** 100 primeiros Plus / 50 primeiros Pro — preço travado, badge permanente

---

*LEVEL · BO7 Tactical Hub — documento de estado. Regenerar ao fim de cada marco.*
