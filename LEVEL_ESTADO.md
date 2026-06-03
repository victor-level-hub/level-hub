# LEVEL · ESTADO DO PROJETO
> Memória estendida do BO7 Tactical Hub. Atualizado a cada marco.
> **Última atualização:** 3 Jun 2026 — fecho do marco v2.7.0

---

## 0. COMO USAR ESTE DOCUMENTO (handoff de chat)

Ao abrir um chat novo, anexar **sempre**:
1. `index.html` (o estado atual do Hub — sem ele, Cráudio trabalha de base errada)
2. Este `LEVEL_ESTADO.md`

Sem o `index.html` anexado, **não começar a editar**. Pedir o arquivo primeiro.

---

## 1. IDENTIDADE & REGRAS DE COMUNICAÇÃO (sempre ativas)

- Respostas em **pt-BR**
- Todo termo técnico de jogo (hipfire, ADS, TTK, sprint-to-fire, slide-cancel, dropshot, etc.) → **parênteses explicativos** logo após, proativamente
- **Recomendações decisivas** — nunca listas de opções para o Victor escolher (exceto quando ele pede explicitamente para ver alternativas)
- **Sem emojis em UI nova** — apenas SVG inline
- **Nunca** mencionar limites de sessão/tokens/uso — gatilho de ansiedade
- Victor tem **TDAH + ansiedade**: uma coisa por vez, próximo passo concreto, sem despejos de texto
- Ao orientar UIs de terceiros: **sempre link direto e completo** (Edge Function específica, repo+branch — não dashboard genérico), nunca chutar nomes de botões
- DevTools Chrome: avisar que Chrome bloqueia paste — Victor digita `allow pasting` no console antes de colar
- **Plataforma = LEVEL** (palíndromo). Coach IA dentro do Hub = **Le Vél** (personagem, tom direto/técnico)

---

## 2. ESTADO ATUAL DO HUB

**Versão:** `v2.7.0` (SemVer desde v2.0.0)
**Arquivo:** single-file `index.html` (~2.3 MB, ~37.190 linhas)
**Stack:** HTML/CSS/JS inline + Supabase backend
**Deploy:** repo `victor-level-hub/level-hub` (privado) → branch main → auto-deploy Netlify `le-vel-hub` → domínio le-vel.games

### O marco v2.7.0 (3 Jun 2026) — três entregas num único deploy

**1. Análise de build com veredito (tarefa 5.A resolvida).** A análise IA deixou de ser ficha técnica genérica e passou a dar veredito narrativo. O payload enviado à Edge Function `analyze-build` (v2) agora inclui:
- `player_profile`: estilo rusher CQB, plataforma PS5, perk-chave Dexterity, ADS Multiplier 0.85 (constantes de produto)
- `active_struggles`: dificuldades cadastradas na aba Evolução, com causa provável + nota mais recente (resolvidas contra `STRUGGLE_CATALOG` + entries custom da IA)

O system prompt foi reescrito do zero seguindo o padrão `analyze-capture-v6` (retry com backoff, `friendlyError`, instrumentação completa em `ana_gemini_usage`). Devolve uma narrativa de 2-4 frases em 3 eixos: (a) encaixe com o estilo, (b) cruzamento com struggles — incluindo dizer claramente quando "não é problema de build" (ex: flinch resolve-se com perk + ADS, não com attachment), (c) veredito final em 3 modos possíveis: otimizada/troca X por Y/o problema não está na arma. Schema da resposta (`summary` + `suggestions`) **preservado** — zero impacto no `_renderAIAnalysisHtml` do front. Validação anti-alucinação server-side mantida (suggestions filtradas contra `candidates_by_weakness` + `perks_pool`).

Arquivo da Edge Function: `analyze-build-v2.ts` em `/outputs` — Victor cola no Supabase manualmente.

**2. Eventos auto-limpam.** O painel "EVENTOS NO AR" no Painel Hoje passou a filtrar eventos cuja data de fim já passou há mais de 4 dias (constante `POST_END_GRACE_MS = 4 * 86400000`). Saem do grid automaticamente sem precisar editar o array `EVENTS`. Se a lista filtrada ficar vazia, a secção inteira (`.briefing-events`) esconde-se em vez de mostrar um cabeçalho órfão. Localização: bloco `renderEvents` (~linha 33627).

**3. Captura — dropdown de armas robusto.** No modal de aprovação da captura por foto, o seletor "escolhe a arma" lia o catálogo só de `DEFAULT_WEAPONS`. Quando `/bootstrap-defaults` falhava silenciosamente sem cache local, o array caía pro fallback hardcoded de **apenas 2 armas** (Sturmwolf 45 + Peacekeeper MK1) — o utilizador ficava preso sem conseguir escolher a arma certa. Correção: novo helper `_getAllKnownWeapons()` que retorna a UNIÃO de `DEFAULT_WEAPONS` ∪ `LevelDB.weapons` (deduplicada por id). `openApprovalModal` virou async, carrega a união uma vez e passa pro `buildApprovalCard`. O `matchWeapon` também recebe a lista como 3º parâmetro — o **matcher melhora junto com o dropdown** (mais armas conhecidas = mais chance de bater o nome correto).

### Identidade visual (FECHADA no marco v2.6.x)
- **Logo LEVEL própria** em SVG embutido (viewBox 0 0 706 178): palavra em estilo angular, corpo **laranja `#FF9800`**, detalhes internos em **azul-claro `#AEC7E0`**, triângulo laranja no topo entre o E e o V, e **recorte triangular vazado** no 2º E (deixa ver o fundo — funciona em qualquer tom)
- **Posições das marcas:**
  - Topo da **barra lateral** → logo **LEVEL** (classe `cod-bo7-logo`, herdada do slot antigo)
  - **Cabeçalho** (`app-header-brand-mark`) → logo **Call of Duty: Black Ops 7**
  - **Tela de login** (`lag-logo-svg`) → logo **LEVEL**
- A antiga logo LEVEL em texto (fonte Inter, letras espelhadas, `sidebar-header`/`brand-logo`) foi **removida**
- **Paleta de fundo recalibrada** (Cenário A — clareamento contido):
  - `--bg-darkest: #141a2b` · `--bg-dark: #1a2238` · `--bg-panel: #1f283f` · `--bg-row: #25304f` · `--bg-row-hover: #303d5f`
  - Tela de login: gate `#141a2b`, cartão `#252f48`
- **Efeito scanline removido** — não há mais `repeating-linear-gradient` no CSS; fundo uniforme em todo o Hub

### Histórico v2.6.x (referência)
- v2.6.0 → logo LEVEL no login/header + paleta recalibrada
- v2.6.1 → triângulo vazado + traços unificados em azul-claro
- v2.6.2 → corpo das letras em laranja (resolveu sumiço no fundo escuro)
- v2.6.3 → troca de posições (LEVEL na sidebar, CoD no header) + remoção da logo textual antiga
- v2.6.4 → remoção total do efeito scanline

### Logos standalone (fora do Hub, em `/outputs` — para favicon/OG futuros)
- `level-logo.svg` (corpo laranja, versão final, fundo escuro)
- `level-logo-white.svg` (tudo branco, para watermark)
- **NÃO usados pelo Hub** (que tem tudo inline). Guardar para quando for montar favicon/meta tags.

### Logos-fonte do Figma (Victor mantém)
- `Logo_LEVEL_-_Azul_Claro.svg` (corpo claro `#AEC7E0` + traços laranja) → usada como base no Hub
- `Logo_LEVEL_-_Azul_Escuro.svg` (corpo escuro `#21293F` + traços laranja) → para fundos claros

---

## 3. AUTH & BACKEND (Path B — fechado 1/Jun/2026)

- Auth email+senha ativo, Confirm email OFF, 18+ universal
- Victor: `auth.uid = 1438a611`, `hub_users.id = 3fa59ebd`
- Edge Functions migradas p/ `auth.uid` + `verify_jwt: true`: `sync-push v6`, `user-asset v4`, `sync-pull v6`, `analyze-build v2`
- Hub: `pushAll`/`pullAll`/`_cloudHeaders` mandam token JWT
- 25 armas + perfil migrados para auth.uid
- `cat_attachments` = **1102 rows**, 25 armas, fonte codmunity — **NÃO MEXER**
- `user-assets` bucket existe (criado 25/Mai), **zero objetos, zero RLS policies** ainda
- Supabase: conta GitHub `victor-abap-pt`, projeto `bo7-tactical-hub` (ref `cqkhqtgmolmrfgzozocr`, sa-east-1)
- Captura mobile: tabela `capture_sessions`, bucket `capture-photos`, Edge Functions Deno
- Gemini 2.5 Flash (Vision API + análise textual); Avatar: Nano Banana 2
- Instrumentação: `ana_gemini_usage` registra usage tokens + custo + latência + sucesso/erro por chamada (preenchida por `analyze-capture v6` e `analyze-build v2`)

---

## 4. PERFIL DO JOGADOR (gameplay sempre ativo)

- PS5, estilo **rusher agressivo CQB**. Marksman rifles vetadas.
- Controller: MP normal (não CDL), +aim assist, +agressividade; **ADS Multiplier 0.85**
- **Dexterity perk = prioridade máxima** (combate flinch — desvio de mira ao levar tiro)
- Áudio: mix **Headphones**
- Prestige 4-6 / Level ~39-54 (oscila — confirmar com Victor a cada sessão se relevante)
- Arma principal: **Sturmwolf 45** (Weapon Prestige 2, build CICADA 3301-45)
- Foco de grind: Sturmwolf P2 → Voyak P1→P2 → snipers
- Arsenal: 25 armas cadastradas

---

## 5. PRÓXIMAS PENDÊNCIAS (roadmap por prioridade)

> A tarefa anterior nº 1 (★ análise com veredito) foi entregue na v2.7.0. Lista atualizada:

1. **user-assets bucket** — migrar imagens localStorage→Supabase Storage (paths por auth.uid)
   - RLS policies ainda **pendentes**
   - Migração de capturas mobile (QR → auth.uid) pendente
   - Faltam os arquivos `bo7-capture` e `level-capture-avatar` para Cráudio trabalhar
2. **cat_struggles BD + admin UI** — feeds a análise IA com mais profundidade. Hoje as struggles vêm do `STRUGGLE_CATALOG` hardcoded (11 entries) + entries custom geradas por IA. Mover pro DB destrava admin UI e enriquecimento.
3. **UI Codenames** (admin + botão "Sugerir" em build/loadout)
4. **Avatar IA Nano Banana 2**
5. **PRE-MATCH ADVISOR** (futuro grande) — sugere loadout/arma conforme mapa + modo MP em tempo real. **Fundação plantada na v2.7.0:** consome o `player_profile` + arsenal + a mesma narrativa de veredito da `analyze-build v2`.
6. **Marketplace** + **i18n EN** (Loadout/Meus Loadouts) — menor prioridade
   - i18n hoje ~95% coberto; pendência: Meus Loadouts (~5KB) e Construtor (~8KB) sem EN

---

## 6. CHECKLIST PÓS-DEPLOY (v2.7.0)

> Fazer ANTES de considerar o marco v2.7.0 100% no ar. Está em **DOIS LADOS** (Hub no GitHub + Edge Function no Supabase).

- [ ] **Deployar Edge Function `analyze-build` v2** no Supabase:
  - Link: https://supabase.com/dashboard/project/cqkhqtgmolmrfgzozocr/functions/analyze-build
  - Colar conteúdo do arquivo `analyze-build-v2.ts` (entregue em `/outputs`)
  - Confirmar **Verify JWT** ligado nas settings
- [ ] **Commitar `index.html` v2.7.0** no repo do Hub:
  - Link: https://github.com/victor-level-hub/level-hub (branch `main`)
  - Título: `feat: veredito + eventos auto + captura robusta`
  - Descrição (corpo do commit):
    ```
    - Análise IA de build deixa de descrever e passa a dar veredito.
      Edge Function analyze-build (v2) recebe player_profile + active_struggles
      e devolve narrativa de 2-4 frases em 3 eixos: estilo / struggles / conclusão.
      Schema da resposta inalterado — zero impacto no render.
    - Eventos encerrados há mais de 4 dias somem do painel automaticamente.
      Secção inteira esconde-se se a lista filtrada ficar vazia.
    - Captura: dropdown de armas une catálogo (DEFAULT_WEAPONS) + arsenal
      do utilizador (LevelDB.weapons). Corrige bug que mostrava só 2 armas
      quando bootstrap-defaults falhava silenciosamente.

    Versão: v2.6.4 → v2.7.0 (MINOR).
    ```
- [ ] Confirmar no **Netlify** (https://app.netlify.com) que o build `le-vel-hub` passou e publicou
- [ ] Abrir **le-vel.games** e verificar o footer mostra **LEVEL v2.7.0**
- [ ] **Testar análise de build:** abrir uma build da Peacekeeper MK1 (já no Mestre 250/250), garantir que "atiro primeiro mas morro" está cadastrada na Evolução, clicar **Analisar**. Conferir que o veredito é **acionável** (toca em estilo + struggle + conclusão clara), não descritivo da arma.
- [ ] **Testar captura:** gerar QR, tirar foto de uma arma, e confirmar que o dropdown lista **as 25 armas** (não só 2).
- [ ] **Testar painel de eventos:** "C.O.D.E. Navigator" (21 mai) e "RoboCop" (28 mai) já não devem aparecer (passaram dos 4 dias de grace); só "Ranked Series · Season 03" (até 4 jun).

### Checklist v2.6.4 (anterior) — fechar se ainda não foi feito
- [ ] Confirmar que o `index.html` v2.6.4 já está commitado e no ar. Se foi pulado na sessão anterior, vai junto no mesmo commit da v2.7.0.

---

## 7. WORKFLOW & PADRÕES TÉCNICOS

### Checklist de entrega (cumprir SEMPRE e listar visivelmente no fim da mensagem)

Victor cobrou explicitamente em 3/Jun/26. **Esquecer qualquer item gera fadiga, é gatilho de TDAH e arrisca o projeto.** Em toda entrega de Cráudio:

1. **Bumpar SemVer** (PATCH=bugfix/visual, MINOR=feature, MAJOR=quebra)
2. **Footer do Hub** atualizado no formato `LEVEL · vX.Y.Z` + `<span class="ver-tag">` descritiva curta dos itens
3. **Bloco "O QUE MUDOU NESTA VERSÃO"** no topo do Painel Hoje (headline + summary + bullets)
4. **Entry nova no topo do Histórico de Versões** (`vh-entry` dentro de `vh-list`, modal de versões)
5. **Título do commit** (< 50 chars — GitHub avisa)
6. **Descrição do commit** (corpo do commit com bullets dos itens — **NÃO esquecer**; foi a falha que motivou cravar este checklist em 3/Jun)
7. **Link DIRETO E COMPLETO** de todo destino externo onde Victor precisa agir:
   - Supabase Edge Fn: `supabase.com/dashboard/project/cqkhqtgmolmrfgzozocr/functions/<nome>` (não a homepage do dashboard)
   - GitHub Hub: `github.com/victor-level-hub/level-hub`
   - GitHub Captura: `github.com/victor-level-hub/bo7-capture`
   - Netlify: `app.netlify.com`

### Padrões de edição

- Edições sempre via Python `read → str_replace → write` em `/home/claude/hub.html`, **nunca** edição manual de linhas
- `str_replace` Python com `assert count == 1` antes de cada substituição (ou usar a tool nativa que falha se não for único)
- Validação após cada alteração: `node --check` no maior bloco `<script>` + sanity checks (contar ocorrências esperadas, ex: `v2.7.0` deve aparecer 3x — footer + changelog title + vh-entry head)
- Para mudanças visuais: **renderizar com Playwright** (chromium headless) e inspecionar screenshot ANTES de entregar — não confiar só no código
- Output final: `/mnt/user-data/outputs/index.html`; Victor commita no GitHub
- **NUNCA** sugerir Google Drive ou Files do Projeto (Victor parou 31/Mai/2026)
- Mudança de frontend que afete schema → backend Supabase na mesma sessão

### Aprendizados da sessão v2.7.0 (3 Jun 2026)

- **Schema fechado é proteção real.** Ao reescrever o `analyze-build`, manter o schema `{summary, suggestions}` do front evitou cascata de mudanças. Quando hesitar entre "estender schema" e "guardar nova lógica no campo existente", preferir o segundo se for compatível.
- **Fallback hardcoded é armadilha silenciosa.** O `DEFAULT_WEAPONS_FALLBACK` de 2 armas existia pra cobrir "primeira visita sem rede" — mas se o bootstrap falha em qualquer sessão posterior sem cache, o user vê 2 armas e nem percebe. Fix defensivo: sempre unir com fonte alternativa (no caso, `LevelDB.weapons`).
- **Sempre confirmar explicitamente no fim da entrega.** Cráudio falhou em listar "footer atualizado + bloco changelog atualizado + entry histórica criada" na entrega da v2.7.0 — Victor cobrou. Memória agora tem o checklist de 7 itens; aplicar sempre.
- **Antes de mexer no fluxo de IA, mapear consumidores do schema.** Antes de tocar no `analyze-build`, leitura de `_renderAIAnalysisHtml` deu o contrato exato (`analysis.summary` + `analysis.suggestions[]`). Sem esse passo, é fácil quebrar o render.

### Aprendizado do marco v2.6.x (logo/visual)
- Vetorizadores automáticos (Image Tracer, etc.) produzem fragmentos soltos, não letras completas — não tentar "remendar" o output; redesenhar ou pedir SVG limpo
- Para um recorte "vazado" funcionar em qualquer fundo: **remover de verdade** a área do path (não pintar com cor fixa de fundo)
- z-index alto em elementos persistentes (sidebar) **quebra modais** — não usar para "esconder" camadas; preferir mover/remover a camada-problema
- Quando o problema parece ser a logo, pode ser o **fundo/contraste** — testar a logo em vários fundos antes de mexer no desenho

### Fontes de dados do jogo
- **codmunity.gg**: fonte primária de attachments (`browser_batch` navigate→wait 3s→`get_page_text`; requer aprovação de permissão na 1ª navegação)
- **game8.co**: não funciona com `get_page_text` — usar `web_fetch` com URLs archive.org

---

## 8. MONETIZAÇÃO (decidido 18/Mai/2026)

- **FREE:** regras determinísticas, até 5 loadouts
- **PLUS R$19,90/mês:** IA conversacional, Vision API, coaching, loadouts ilimitados, sync, "Falar com Le Vél"
- **PRO R$49,90/mês:** replay analysis, coach session, meta builds, comunidade
- **Founder vitalício:** 100 primeiros Plus / 50 primeiros Pro — preço travado, badge permanente
- BYOK descartado (fricção mata conversão); backend centralizado para Plus

---

*LEVEL · BO7 Tactical Hub — documento de estado. Regenerar ao fim de cada marco.*
