# LEVEL · ESTADO DO PROJETO
> Memória estendida do BO7 Tactical Hub. Atualizado a cada marco.
> **Última atualização:** 12 Jun 2026 — v2.35.0 (tela ① Home Hub — nova entrada do Hub)

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

**Versão:** `v2.35.0` (SemVer desde v2.0.0)
**Arquivo:** single-file `index.html` (~3,24 MB, ~42.900 linhas, 16 blocos `<script>`)
**Stack:** HTML/CSS/JS inline + Supabase backend
**Deploy:** repo `victor-level-hub/level-hub` (privado) → branch main → auto-deploy Netlify `le-vel-hub` → domínio le-vel.games
**Captura mobile:** repo `victor-level-hub/bo7-capture` → `level-capture.netlify.app`

### Marcos recentes
- **v2.35.0** (12 Jun) — **Tela ① Home Hub (nova entrada do Hub).** Sétima entrega Claude Design. Nova secção `#section-home` (1ª no DOM, `class="section active"`) + nav-item `data-section="home"` no topo; o antigo briefing virou item "Painel Hoje" (`nav.briefing.label` PT "Painel Hoje" / EN "Daily Brief"), SEM perder funcionalidade. **Total de secções subiu de 13 → 14** (atualizado o note de validação). ESTRUTURA: hero (`.home-hero` com glow radial `::before`, chip mono, headline `.home-hero-headline` clamp 36-64px gradiente branco→#FFD79E, sub Plex, 2 CTAs reusando `.lvl-empty-cta`, 3 readouts `.home-readout`) + resume strip (`.home-continue` grid 1.3/1fr com `.home-tip`) + `.home-explore` grid repeat(4,1fr) de 8 `.home-card` (cores `hc-*` por categoria). JS `levelHome()` IIFE: delegação `[data-home-goto]` → `.click()` no nav-item respetivo; `[data-home-smart]` → clica `btn-smart-build`; `renderHome()` preenche readouts (weapons.length / builds.length), card "continuar" (última build por updatedAt, escondido se 0 builds) e dica do dia (array 6 tips PT/EN, índice = dia-do-ano % 6); re-roda em `level:builds-change` e `languagechange`. App-header sincroniza via `initAppHeaderSync` (apanha `.section.active` = Home → mostra "LEVEL"). i18n: chaves `home.*` + `nav.home.*` PT/EN. CUIDADO: `home.card.*` e `home.ro.*` usam `data-i18n` (textContent) — sem entidades HTML, só UTF-8 direto. Vitrine pura, zero mecânica nova. Validado: node 16/16, html5lib 1 main + 14 sections, render isolado (`shot_home_v2350.png`) fiel ao print do Victor. Polimento adiado (igual ao CC): botões de ação no topo do detalhe.
- **v2.34.0** (12 Jun) — **Command Center: master-detail alternável (tela ② Claude Design).** Decisão do Victor: em vez de substituir o grid, **toggle de 2 opções** "Grade · Command Center" na toolbar (`[data-mw-layout]`, persistido em `localStorage['level.mwLayout']`; HUD Strip descartado — exploração não desenvolvida, manutenção 3× sem ganho). ARQUITETURA-CHAVE: o detalhe do CC **É um `.build-card`** (`renderBuildCard(build, 'cc')` → classe extra `mw-cc-card`) — todas as delegações existentes (`closest('.build-card')` + `data-id`: abas, estrelas, save-rating, editar/duplicar/deletar, análise IA) funcionam **sem nenhuma alteração**. Modo cc muda só: abas [`loadana` "Loadout + Análise" (spec-sheet + análise lado a lado em `.bc-cc-cols` grid 1fr/1.05fr) · `rating` · `history` (CTA `[data-cc-open-history]` → clica `btn-gen-history`)]; `_bcActiveTab` mapeia loadout/analysis→loadana ao entrar no cc (e loadana/history→loadout ao voltar). ATENÇÃO: `filtered.map(renderBuildCard)` passa index como 2º arg — o modo só ativa com a string `'cc'`. Sidebar: busca em tempo real (`#mw-cc-search`, filtra nome da build + arma base), itens `[data-cc-id]` com barra de classe + halo, ativo = gradiente laranja; estado em `_ccSelectedId`/`_ccQuery`. Filtros de classe valem nos 2 modos; estados vazios da tela ⓪ têm prioridade sobre o CC. Sidebar sticky top 76px; ≤1000px empilha. CSS: bloco `mw-cc-*`/`bc-cc-*` após os estados. Validado: node 16/16, html5lib ok, render isolado do CC (`shot_cc_v2340.png`) fiel ao mockup `02-arsenal.png`. **As 2 decisões pendentes (master-detail + fusão de abas) estão RESOLVIDAS por este toggle.** Falta da tela ②: histórico inline na aba (hoje abre o modal), botões de ação no topo do detalhe (hoje ficam no rodapé do card).
- **v2.33.0** (12 Jun) — **Corpo em IBM Plex Sans — 3-tier completo.** Sexta entrega Claude Design (aprovada pelo Victor: "tudo o que o Claude Design fez ficou mais bonito"). Body base + 23 declarações primárias `'Rajdhani', sans-serif` → `'IBM Plex Sans', 'Rajdhani', sans-serif` (Rajdhani vira fallback local). Rajdhani REMOVIDA do link Google Fonts; Plex Sans ganhou peso 700 no link (`400;500;600;700`). O sistema tipográfico do design cobre agora 100% do Hub: Chakra Petch (display) · IBM Plex Sans (prosa) · JetBrains Mono (dados). Restam fora do sistema só os ~8 pontos soltos de Inter (fora dos cards). Validado: node 16/16, html5lib ok, render dos cards sem regressão. **Tipografia: transição CONCLUÍDA** — as secções "em transição" deste doc e do CLAUDE.md podem ser simplificadas no próximo marco.
- **v2.32.0** (12 Jun) — **Sweep tipográfico final: Black Ops One aposentada.** Quinta entrega Claude Design. 47 regras CSS + 6 inline migradas via script (`migrate_v2320.py`): 36 → Chakra Petch (títulos/nomes: eventos, BP, mapas, armas, loadouts, codenames, marketplace) e 11 → JetBrains Mono pela regra "valor → mono" (`.score-num`, `.score-rating`, `.p-tier`, `.p-level-line strong`, `.prestige-hero .h-tier/.h-level`, `.oc-stat-num`, `.opp-gemini-stat-value`, `.sr-num`, `.rate-slider-val`, `.aimt-routine-big strong`). LIÇÃO: a BOO era **caps-only** — toda regra migrada pra Chakra precisou de `text-transform: uppercase` + peso ≥600, senão texto minúsculo apareceria pela 1ª vez. Black Ops One removida do link Google Fonts (zero usos). O Hub agora tem o 3-tier completo: Chakra (display) · Plex Sans (prosa) · JetBrains Mono (dados). Resta fora do sistema: Rajdhani (corpo base — substituível por Plex gradualmente) e Inter (~8 pontos soltos). Validado: node 16/16, html5lib ok, render isolado.
- **v2.31.0** (12 Jun) — **Moldura de Minhas Armas + navegação no design system.** Quarta entrega Claude Design. (1) **app-header** (título visível do Hub): Black Ops One → Chakra Petch 700 caps, intro em Plex Sans, e o próprio header na espec do top-nav de vidro (`rgba(10,13,22,0.55)` + blur 18px + hairline azul). ATENÇÃO: os `.section-header` (h2/breadcrumb/p) estão `display:none` desde que o título migrou pro app-header — também foram migrados no CSS, mas o elemento visível é o app-header (`syncAppHeaderFromSection` copia o texto). (2) **Toolbar Minhas Armas** na espec Button: `.btn-add-weapon` base = secundário (surface-raised, h38, radius 8, Chakra), gradientes âmbar v75 removidos; `.variant-ai` (Montagem Inteligente) = ÚNICO primário laranja com glow; `.variant-master`/`.variant-orange` viraram hooks neutros. (3) **Filtros de classe** = pills SegmentedControl (mono 11px/0.07em, radius 999): ativo preenche `#FF9800` com `--action-ink` e contador embutido escuro. (4) **Nav lateral mono-caps** (JetBrains Mono 12px/0.07em uppercase, idle = `--text-muted`); ativo mantém barra laranja. Focus-visible ring nos filtros/botões. Validado: node 16/16, html5lib ok, render isolado (`shot_frame_v2310.png`). Black Ops One ainda vive em ~50 outros pontos (títulos internos de cards/modais) — sweep completo planejado como release própria.
- **v2.30.0** (12 Jun) — **Estados da tela ⓪ (vazios, erros, loading).** Terceira entrega Claude Design. (1) **Arsenal vazio** (`#mw-empty-zero`): ícone com glow, título Chakra, corpo Plex, CTAs "Montagem Inteligente" (primário) + "Importar Build" (abre o dropdown `import-dd`); (2) **filtro sem resultados** (`#mw-empty-filter`, novo): mono `// nenhuma build nesta classe` + ghost "+ Adicionar Arma" — `renderBuildsGrid` decide a variante por `builds.length`; (3) **Evolução sem registos**: `lvl-empty accent-blue` + CTA que clica `btn-add-struggle` (texto PT hardcoded, consistente com o módulo); (4) **Histórico** (gh e ah): loading → `lvlSkeletonCards(3)` (shimmer 1.4s), erro de load → `lvlErrorPanel(code, retryId)` (borda vermelha 35%, dot glow, código mono `hh:mm`, retry chama `openGenHistory`/`loadAnalysisHistory`); erro de DELETE mantém `ghStatus` (painel apagaria a lista). CSS novo: classes genéricas `.lvl-empty*`, `.lvl-error-*`, `.lvl-skeleton`, `.gh-skeleton-card` — REUSAR nos próximos estados. i18n: `mw.empty.*`, `mw.noresults.*`, `gh.errTitle/errBody/errRetry` PT+EN (atenção: o painel usa `esc()` → NÃO usar `&rsquo;` nessas chaves, reformular sem apóstrofo). Estado "análise aguardando dados" da espec não foi criado (o fluxo bc-ai-cta existente já cobre). Validado: node 16/16, html5lib ok, render isolado dos 5 estados (`shot_states_v2300.png`).
- **v2.29.0** (12 Jun) — **Acabamento Glass/Neon + paleta global do Claude Design.** Regra mudou (decisão do Victor): "manter paleta atual" foi revogada — tudo o que o design propõe de visual entra. Aplicado: (1) **paleta global** — `--accent-orange` âmbar `#F0B952` → **`#FF9800`** (114 tints `rgba(240,185,82` + 21 `rgba(255,107,53` migrados p/ `rgba(255,152,0`), ink ramp do design (`--text-primary #DCE5F2`, secondary `#AEC7E0`, muted `#8497B8`), favicon/SVGs/JS atualizados; (2) **cores de classe novas** (3 blocos: `.we-class`, `.bcc-*::before`, `.bc-class`): SMG ciano `#58C4DC`, AR laranja `#FF9800`, Sniper violeta `#C77DFF`, MR âmbar `#FFC857`, SG coral `#F2784B`, Pistol azul `#AEC7E0` (Tac/Launcher sem token no design — mantidos); (3) **cards de vidro**: `rgba(31,40,63,0.34)` + `backdrop-filter blur(12px)`, radius 16, `--shadow-md`, hover `translateY(-3px)` + glow na cor da classe, top edge 2px com halo neon `0 0 12px`; (4) **nome da build** 22px/600 com gradiente branco→`#FFD79E` (background-clip:text, padding-bottom 2px contra corte); meta line única mono 12px azul; head sem divisória; (5) **ClassBadge pill** (999px, 12px, tints 14%/50%); (6) **abas mono-caps** (JetBrains Mono 12px/0.07em, alinhadas à esquerda, ativo só cor+underline — espec do componente Tabs; o README do design põe "nav labels" em Chakra mas o componente e o mockup usam mono); (7) **spec-sheet** na espec AttachmentRow: zebra `nth-child(even)`, colunas 108px/1fr, rows 7px 12px, valores 13px, vazio `#5F6E8C`; (8) **painel Le Vél** = CoachMessage completo (barra 3px no painel inteiro, tint laranja, glow suave, chip com avatar `{{i:bot}}` + nome "Le Vél" em Chakra — novo no renderBuildCard); (9) **botões** espec Button: altura 30, radius 8, primário com glow + texto `--action-ink #1A1206` + hover `#FFB23E`, danger `#E74C3C` 45%/16%; (10) **estrelas** 20px stroke 1.8, vazia contorno neutro `#5F6E8C`, cheia laranja; (11) **focus ring** laranja 1px + 3px `rgba(255,152,0,0.45)`; (12) **fundo do Hub** com glow ambiente (radial laranja topo + ciano canto + gradiente 160deg) sobre a grelha HUD 40px; (13) tokens do design no `:root` (`--class-*`, `--shadow-*`, `--glow-*`, `--dur-*`, `--ease-out`, `--border-*`, `--surface-*`, `--ink-*`, `--focus-ring`). **Fora desta entrega (aguardam decisão — conflito de mecânica):** master-detail Command Center, fusão "Loadout + Análise" + aba Histórico; estados (tela ⓪) e mobile 390px ficam para versões próprias. Validado: node --check 16/16, html5lib 1 main + 13 sections, render isolado (Chrome headless, 3 cards × 3 abas, zoom 2x no head). Labels do Avalie já batiam 1:1 com o design (Velocidade/Mobilidade/Recuo/Mira/Alcance). CLAUDE.md ficou com a secção PALETA desatualizada (edição bloqueada por permissão) — atualizar quando o Victor pedir.
- **v2.28.1** (12 Jun) — **Novo visual dos cards de arsenal** (primeira entrega da direção Claude Design, vinda do README do design system). Tipografia 3-tier nos cards: **Chakra Petch** (nomes de build, abas, botões — elimina a Inter dos cards), **IBM Plex Sans** (prosa do Le Vél, 15px/1.62, máx 65ch, barra laranja 3px no resumo), **JetBrains Mono** mantida nos dados. Borda superior 2px na cor da classe (classe `bcc-<classe>` na raiz do card, CSS `::before`) + ClassBadge com tint de fundo. Spec-sheet dos 9 slots em well afundado único `#0F1422` (labels dim, valores claros, rows 7px). Radius 8px, hairline azul-claro translúcida, sombra suave, motion 150ms `cubic-bezier(0.2,0.7,0.2,1)`, press 1px nos botões. Emoji ⭐ da aba Avalie → `{{i:star}}`. Paleta de classes MANTIDA (decisão: o README sugeria outras cores de classe, mas a regra acordada era manter a paleta). Fontes novas no link Google Fonts. Mecânicas intactas (3 abas, glossário, análise server-side, 9 slots). Verificado com render isolado (Chrome headless, 3 cards × 3 abas).
- **v2.28.0** (11 Jun) — **duas entregas.** (1) **Decisão server-side de análise** (roadmap item 3): o motor determinístico do Hub passou a ESCOLHER os swaps de attachment (função `_decideSwaps`), e o Le Vél só EXPLICA. Garante consistência (mesma build → mesmos swaps). `analyze-build` v6 com regra R5-DECIDIDO. Fallback v5 preservado. (2) **i18n EN da tela de login** (parte do item 11): landing/cadastro/login/reset agora bilíngues via `data-i18n` + chaves `auth.*` no `window.I18N`. Era o maior buraco de i18n (a vitrine ficava em PT mesmo no modo EN).
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
- `analyze-build` v6 — análise de build com veredito. **v6 (11/Jun): DECISÃO SERVER-SIDE** — recebe `decided_swaps` (swaps escolhidos pela engine) e regra R5-DECIDIDO no prompt faz a IA só EXPLICAR (preenche rationale), não escolher. Se `decided_swaps` vazio, cai no comportamento v5 (IA propõe). Grava histórico em `analysis_history`. `verify_jwt: false`. NÃO condensar o SYSTEM_PROMPT em deploys (degrada coaching)
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
3. ✅ **Decisão server-side de análise** — FEITO (v2.28.0): `_decideSwaps` no front decide os swaps (melhor candidato por fraqueza relevante ao estilo, valida ganho vs margem, até 3, 1 por slot); payload envia `decided_swaps`; `analyze-build` v6 + regra R5-DECIDIDO faz a IA só explicar. Testado em produção nos dois caminhos (com e sem decided_swaps). Fundação do Pre-Match Advisor (item 10)
4. ✅ **Histórico de análises no banco** — FEITO (v2.27.0): tabela `analysis_history` + gravação no `analyze-build` v5 + Edge `analysis-history` v1 + UI (aba no modal de histórico). Backend e front completos, testados em produção.
5. **e-mail de eventos** — notificar novos eventos por e-mail (precisa coletar emails + Resend/SendGrid + cron)
6. **Controller fase 2** — mais ajuste fino além do que já está mapeado
7. **user-assets** — migração RLS do bucket + migração de storage (localStorage→Supabase, paths por auth.uid)
8. **UI Codenames** (admin + botão "Sugerir" em build/loadout)
9. **Avatar IA Nano Banana 2**
10. **Pre-Match Advisor** (futuro grande) — sugere loadout/arma conforme mapa + modo MP em tempo real
11. **Marketplace** + **i18n EN** — PARCIAL: tela de login/cadastro/reset já 100% EN (v2.28.0). FALTA: Meus Loadouts (~5KB) e Construtor (~8KB) ainda têm strings PT hardcoded; ~74 botões PT sem `data-i18n` mapeados (mas muitos são da área admin, que não precisa EN). Padrão p/ traduzir: dar `data-i18n` ao elemento + chave PT/EN no `window.I18N` (dict principal, 1406+ chaves; aplicado no boot por `window.applyI18N`)
12. **Atualização de dados de Eventos por Season** — manter a grade de eventos do Painel Hoje em dia

---

## 5.B · EXPLORAÇÃO VISUAL EM ANDAMENTO (Claude Design)

> Iniciada 11 Jun 2026. Victor está a usar o **Claude Design** (`claude.ai/design`) pra explorar direção visual do Hub, começando pela tela **Minhas Armas (cards de arsenal)**.

### Fluxo decidido
- Claude Design = exploração de **direção visual** (aparência, hierarquia, tipografia). NÃO conhece a lógica do Hub (9 slots fixos, abas, glossário, análise server-side).
- Referência usada: **screenshot** dos cards (`shot_cards.png` — montado renderizando a função real `renderBuildCard` com 3 builds do arsenal: CICADA 3301-45/Sturmwolf SMG, RAIO/AK-27 AR, GUARDIÃ/Peacekeeper Mestre). NÃO usar GitHub (repo privado + arquivo 3,2MB único) nem Figma (terceira ferramenta sem ganho; o destino é o index.html).
- Quando Victor escolher uma direção, ele traz o screenshot de volta → Claude implementa no `index.html` real, preservando as mecânicas (abas, glossário, análise do Le Vél).
- Setup do "design system" no Claude Design: blurb com identidade LEVEL + notas com paleta e tipografia. Em "fonts/logos/assets" anexar SÓ o screenshot (e logo), NÃO arquivos de fonte — pra que ele OPINE sobre tipografia em vez de só executar.

### Sistema de tipografia e visual (direção Claude Design — Glass/Neon aplicado nos cards na v2.29.0)
- **Fonte da verdade do design:** projeto "LEVEL Design System" no claude.ai/design (link compartilhado do Victor) — README do design system + handoff `design_handoff_level_glassneon/README.md` (espec agente-para-agente das 9 telas Glass/Neon) + tokens (`tokens/*.css`) + componentes JSX. Acabamento escolhido: **Glass/Neon** (Direção C · Command Center). Acesso aos ficheiros: endpoint `GetFile` do projeto (POST JSON `{projectId, path}`, devolve base64) — útil para puxar specs sem navegar a UI.
- **3-tier:** Chakra Petch (display: nomes, botões, badges), IBM Plex Sans (prosa ≥1 frase, 15px/1.62), JetBrains Mono (dados **e abas** — espec do componente Tabs: mono-caps; o README é ambíguo ["nav labels" no tier display] mas componente + mockup usam mono). Regra: "valor → mono; frase → Plex Sans; nome/comando → Chakra Petch".
- **Aplicado nos `.build-card`** (v2.28.1 tipografia, v2.29.0 acabamento completo + paleta global).
- **Resto do Hub ainda no sistema tipográfico antigo:** Black Ops One (títulos de secção), Rajdhani (corpo), JetBrains Mono (dominante), Inter (~8 pontos fora dos cards). Migração gradual conforme Victor aprovar tela a tela. A PALETA, porém, já é global (v2.29.0).
- **REGRA REVOGADA (12 Jun, decisão do Victor):** "manter paleta atual" caiu — para escolhas VISUAIS, seguir o design sempre. Só conflitos com MECÂNICA (abas, glossário, 9 slots, análise server-side) precisam de discussão antes. Pendentes dessa categoria: master-detail Command Center (tela ② do handoff) e fusão de abas "Loadout + Análise" + aba "Histórico".

### Estrutura do card de arsenal (`.build-card`, via `renderBuildCard`)
- head: `.bc-name` + `.bc-class cls-SMG/AR/Sniper` (SMG laranja `#ff8155`, AR azul `#93b8d4`, Sniper roxo `#c084fc`)
- base: arma + `.bc-master-badge` (MESTRE 250/250) ou `P{n} {lvl}/{max}` / MAX / L{lvl}
- 3 abas (`.bc-tab`): Loadout / Nossa Análise / Avalie → 3 painéis (`.bc-tab-panel`)
- loadout: imagem da arma (`getUserImage` ou silhueta SVG fallback) + 9 slots fixos (`SLOT_LABELS`: Optic/Muzzle/Barrel/Underbarrel/Magazine/Rear Grip/Stock/Laser/Fire Mods)
- `.bc-updated` + `.bc-actions` (Editar/Duplicar/Deletar)
- Para testes visuais isolados: a página `test_cards.html` (no working dir do chat anterior) extrai `renderBuildCard` real + CSS + ícones e renderiza com mocks de LevelDB/getUserImage/generateBuildAnalysis/renderRatingsBlock.

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
- Inserção de `vh-entry` pode consumir a tag de abertura da próxima entry → sempre validar html5lib após (1 main + **14 sections** desde v2.35.0; era 13)
- Ícones LUCIDE: o `<svg>` do template só tem `viewBox`; o CSS `.lvl-icon svg` é que aplica `stroke: currentColor; fill: none; stroke-width: 2`. Ao testar ícone isolado, **incluir o `<style>`** ou ele renderiza como bloco preto. Ícones de stroke (ex: `history`) precisam desse CSS
- Resolução de `{{i:NAME}}` em `data-i18n`: o boot detecta via `window.hasIconPlaceholder` e aplica `window.renderIconsText(valor_do_dict)`. Aplicar `renderIconsText` sobre HTML já-renderizado escapa o conteúdo (vira texto cru)
- `str_replace` que falha no meio de um script Python que só grava no final: as edições anteriores **se perdem** (não foram gravadas). Sempre reconferir o estado após erro
- **`renderIconsText` vs `renderIconsHtml`** (ambos em `window`): `renderIconsText` **escapa o HTML** e só resolve `{{i:}}` — usar só em texto plano. Para conteúdo que JÁ contém tags HTML + placeholders de ícone (ex: innerHTML montado com `<div>`), usar **`renderIconsHtml`** (resolve `{{i:}}` sem escapar o resto). Usar o Text no lugar do Html faz as tags aparecerem cruas na tela. Bug pego e corrigido na v2.26.1 (estado vazio + cards do histórico)
- **Apóstrofo em string JS de aspas simples:** dentro de `'...'` no dicionário i18n, `''` (dois apóstrofos) NÃO escapa — fecha a string e quebra o JS. Para apóstrofo literal em conteúdo PT/EN, usar a entidade HTML `&rsquo;` (ex: `weapon&rsquo;s`), nunca `''`. Pego na v2.27.0
- **Âncora de str_replace que começa com aspa:** ao ancorar numa chave i18n como `'gh.noStruggle':`, garantir que o replacement reponha a aspa inicial — senão a linha fica `gh.noStruggle':` sem abertura e quebra o JS. Pego na v2.27.0
- **Ângulo de variante vive no wrapper, não no build:** no fluxo de variantes simultâneas, cada variante é `{angle, build, error}` — o `build` em si NÃO carrega o ângulo. Ao passar `v.build` pra funções que precisam do ângulo (ex: histórico), carimbar antes: `v.build._variant_angle_id = v.angle.id`. Bug pego e corrigido na v2.26.1

### i18n (dois sistemas coexistem)
- **`window.I18N`** (dict `pt`/`en`, 1406+ chaves) + **`window.applyI18N(lang)`** — sistema principal. Aplica `data-i18n` (textContent), `data-i18n-html` (innerHTML), `data-i18n-attr` ("attr:chave", ex placeholder), `data-i18n-placeholder`. Rodado no boot via `initI18N` (DOMContentLoaded) → aplica ANTES do login, então a tela de auth traduz. Idioma em `localStorage['bo7hub_lang_v1']`
- **`TXT`** + `t()` + `getLang()` — sistema secundário (mesma chave de localStorage). Para traduzir UI: dar `data-i18n` ao elemento + chave PT/EN no `window.I18N`. NÃO traduzir texto direto no HTML
- A tela de login (`level-auth-gate`, classes `lag-*`) é HTML estático (não injetado por JS) — fica nas linhas ~11255+

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
