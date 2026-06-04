# LEVEL · ESTADO DO PROJETO
> Memória estendida do BO7 Tactical Hub. Atualizado a cada marco.
> **Última atualização:** 3 Jun 2026 — fecho do marco v2.7.6 (análise IA respeita estilo real + fraqueza relativa)

---

## 0. COMO USAR ESTE DOCUMENTO (handoff de chat)

Ao abrir um chat novo, anexar **sempre**:
1. `index.html` (o estado atual do Hub — sem ele, Cráudio trabalha de base errada)
2. Este `LEVEL_ESTADO.md`

Sem o `index.html` anexado, **não começar a editar**. Pedir o arquivo primeiro.

**Primeira mensagem sugerida pro próximo chat:**
> "Anexei o index.html (v2.7.6) e o LEVEL_ESTADO.md. Próxima tarefa: [escolher do roadmap, secção 5]."

---

## 1. IDENTIDADE & REGRAS DE COMUNICAÇÃO (sempre ativas)

- Respostas em **pt-BR**
- Todo termo técnico de jogo (hipfire, ADS, TTK, sprint-to-fire, slide-cancel, dropshot, flinch, etc.) → **parênteses explicativos** logo após, proativamente
- **Recomendações decisivas** — nunca listas de opções para o Victor escolher (exceto quando ele pede explicitamente para ver alternativas)
- **Sem emojis em UI nova** — apenas SVG inline
- **Nunca** mencionar limites de sessão/tokens/uso — gatilho de ansiedade
- Victor tem **TDAH + ansiedade**: uma coisa por vez, próximo passo concreto, sem despejos de texto
- Ao orientar UIs de terceiros: **sempre link direto e profundo** (até a subtab/subpágina onde a ação acontece), nunca chutar nomes de botões; seguir o link com os passos concretos ("apaga X, cola Y, clica Z")
- DevTools Chrome: avisar que Chrome bloqueia paste — Victor digita `allow pasting` no console antes de colar
- **Plataforma = LEVEL** (palíndromo). Coach IA dentro do Hub = **Le Vél** (personagem, tom direto/técnico)

### Checklist de entrega (cravado — fazer TODOS aplicáveis e listar explícito no fim)
1. **SemVer bump** (PATCH=bugfix/visual/data · MINOR=feature · MAJOR=quebra)
2. **Footer** `LEVEL vX.Y.Z` + ver-tag (linha ~15258)
3. Bloco **"O QUE MUDOU NESTA VERSÃO"** no topo do Painel Hoje (PT + EN no i18n)
4. Entrada no topo do **Histórico de Versões** (`vh-entry` no topo da `vh-list`, ~linha 13705)
5. **Título do commit < 50 chars**
6. **Descrição do commit** (corpo com bullets — NUNCA esquecer)
7. **Link direto e completo** do destino externo + passos no destino

> Itens 1–4 só em release do Hub. Itens 5+6+7 valem pra **todo** arquivo commitado no GitHub (index.html, LEVEL_ESTADO.md, .ts, doc).

### Verificação de estado real (não confiar em memória)
Antes de cravar uma versão, conferir o footer real do arquivo:
```bash
grep "LEVEL · <strong>v" index.html
```
A memória do `LEVEL_ESTADO.md` pode estar desatualizada por várias versões — o footer no arquivo é a fonte de verdade.

---

## 2. ESTADO ATUAL DO HUB

**Versão:** `v2.7.6` (SemVer desde v2.0.0)
**Arquivo:** single-file `index.html` (~2.34 MB, ~37.716 linhas)
**Stack:** HTML/CSS/JS inline + Supabase backend
**Deploy:** repo `victor-level-hub/level-hub` (privado) → branch main → auto-deploy Netlify `le-vel-hub` → domínio le-vel.games

### Histórico do marco v2.7.x
- **v2.7.0** — Três entregas num deploy:
  - **Análise IA de build com veredito** (era a prioridade #1 do roadmap). Edge Function `analyze-build` v3 passou a receber `player_profile` + `active_struggles` no payload, e a dar veredito acionável em vez de descrição genérica.
  - **Eventos auto-limpam.** `POST_END_GRACE_MS = 4 dias`; `renderEvents` filtra eventos terminados há mais de 4 dias.
  - **Captura — dropdown robusto.** Helper `_getAllKnownWeapons()` = união `DEFAULT_WEAPONS` ∪ `LevelDB.weapons`.
- **v2.7.1** — Grid de eventos 3-col (desktop) / 1-col (mobile); banner de lançamento **MW4** (23 Out 2026, `kind: 'launch'`); scroll de modais reseta via MutationObserver global; sugestões da IA reformatadas (SLOT destacado + "Atual → Novo · L<level>" + rationale; schema da Edge Function ganhou campo `replaces`).
- **v2.7.2** — Avatar do card Configurações ▸ Operador agora retangular 3:4 (era círculo); campo "Estilo" passou a aparecer (bug: lia `player.style` em vez de `player.playstyle`).
- **v2.7.3** — **Catálogo BO7 completo** em Configurações ▸ Imagens ▸ Vantagens & Séries. Scorestreaks 4→32, specialties 4→6, field upgrades 2→12. Ver secção 9.
- **v2.7.4** — Aba Configurações ▸ Imagens ▸ **Mapas povoada** (fallback `DEFAULT_MAPS_BO7`, 40 mapas) + **Stim Shot** adicionado ao Level 21 da Progressão.
- **v2.7.5** — **Bug crítico DELETAR build resolvido** (handler de struggle sem scope sequestrava o clique). Ver secção 8 (aprendizado).
- **v2.7.6** — **Análise IA agora respeita o estilo real do operador.** Dois bugs encadeados do `analyze-build` descobertos em uso real (BELEROFONTE / Voyak KT-3). Ver secção 5.A.

### Identidade visual (FECHADA no marco v2.6.x — não mexer)
- **Logo LEVEL própria** em SVG embutido (viewBox 0 0 706 178): corpo **laranja `#FF9800`**, detalhes em **azul-claro `#AEC7E0`**, triângulo laranja no topo entre E e V, recorte triangular vazado no 2º E.
- **Posições:** sidebar topo → logo **LEVEL** (`cod-bo7-logo`); cabeçalho (`app-header-brand-mark`) → logo **Call of Duty: Black Ops 7**; tela de login (`lag-logo-svg`) → logo **LEVEL**.
- **Paleta de fundo** (Cenário A): `--bg-darkest #141a2b`, `--bg-dark #1a2238`, `--bg-panel #1f283f`, `--bg-row #25304f`, `--bg-row-hover #303d5f`. Login: gate `#141a2b`, cartão `#252f48`.
- **Sem efeito scanline** — fundo uniforme.
- Logos standalone em /outputs (favicon/OG futuros): `level-logo.svg`, `level-logo-white.svg` — NÃO usados pelo Hub (que tem tudo inline).

---

## 3. AUTH & BACKEND (Path B — fechado 1/Jun/2026)

- Auth email+senha ativo, Confirm email OFF, 18+ universal
- Victor: `auth.uid = 1438a611`, `hub_users.id = 3fa59ebd`
- Edge Functions migradas p/ `auth.uid` + `verify_jwt: true`: `sync-push v6`, `user-asset v4`, `sync-pull v6`
- **Edge Function `analyze-build` v3** (deployada 3/Jun/2026) — recebe `player_profile` + `active_struggles`, dá veredito em 3 eixos (estilo / dificuldades / veredito final), schema fechado com campo `replaces`, validação server-side anti-alucinação, respeita `payload.language` (pt/en). **Não foi tocada na v2.7.6** — o prompt já estava certo, faltava era o payload. Ver secção 5.A.
- Hub: `pushAll`/`pullAll`/`_cloudHeaders` mandam token JWT
- 25 armas + perfil migrados para auth.uid
- `cat_attachments` = **1102 rows**, 25 armas, fonte codmunity — **NÃO MEXER**
- `user-assets` bucket existe (criado 25/Mai), **zero objetos, zero RLS policies** ainda
- Instrumentação Gemini em `ana_gemini_usage` (tokens + custo + latência por chamada)
- Supabase: conta GitHub `victor-abap-pt`, projeto `bo7-tactical-hub` (ref `cqkhqtgmolmrfgzozocr`, sa-east-1)
- Captura mobile: tabela `capture_sessions`, bucket `capture-photos`, Edge Functions Deno
- Gemini 2.5 Flash (Vision API); Avatar: Nano Banana 2

**Link direto Edge Functions:**
`https://supabase.com/dashboard/project/cqkhqtgmolmrfgzozocr/functions/<nome>/code`

---

## 4. PERFIL DO JOGADOR (gameplay sempre ativo)

- PS5, estilo **rusher agressivo CQB**. Marksman rifles vetadas.
- Controller: MP normal (não CDL), +aim assist, +agressividade; **ADS Multiplier 0.85**
- **Dexterity perk = prioridade máxima** (combate flinch)
- Áudio: mix **Headphones**
- Prestige 4-6 / Level ~39-54 (oscila — confirmar com Victor a cada sessão se relevante)
- Arma principal: **Sturmwolf 45** (Weapon Prestige 2, build CICADA 3301-45)
- Foco de grind: Sturmwolf P2 → Voyak P1→P2 → snipers
- Arsenal: 25 armas cadastradas

> O perfil acima é o estado de Victor hoje. O **Hub** lê de `LevelDB.player` (chaves `playstyle`, `platform`, `prestige`, `level`, `name`, `photo`). O select de Configurações ▸ Operador oferece 6 estilos: `RUSHER`, `SLAYER`, `ANCHOR`, `OBJECTIVE`, `SNIPER SUPPORT`, `FLEX` — o Hub não tem (ainda) input para editar `platform` (default `PS5` no estado).

---

## 5. PRÓXIMAS PENDÊNCIAS (roadmap por prioridade)

> A análise de build com veredito (antiga #1) está **implementada e funcionando** (v2.7.0 + Edge v3 + fix v2.7.6). Roadmap reordenado:

1. **user-assets bucket** — migrar imagens localStorage→Supabase Storage (paths por auth.uid)
   - RLS policies ainda **pendentes**
   - Migração de capturas mobile (QR → auth.uid) pendente
   - O **catálogo de Vantagens & Séries + Mapas** (hoje constantes JS, ver secção 9) migra junto, se fizer sentido virar BD/Storage
   - Faltam os arquivos `bo7-capture` e `level-capture-avatar` para Cráudio trabalhar
2. **cat_struggles BD + admin UI** — hoje as dificuldades vivem no localStorage (`level.struggles`) + `STRUGGLE_CATALOG`. A análise de build já consome o que existe no front; uma BD dedicada + admin permitiria curar o catálogo.
3. **Input de Platform** no modal de Configurações ▸ Operador — hoje só lê de `player.platform` (default `'PS5'`). Sem UI pra editar. Trivial: select com PS5/PC/Xbox no `modal-status`, salvar via `LevelDB.player.update`. Análise IA já está pronta pra consumir o valor real.
4. **UI Codenames** (admin + botão "Sugerir" em build/loadout)
5. **Avatar IA Nano Banana 2** (arquivo `level-capture-avatar.html` já existe no projeto)
6. **PRE-MATCH ADVISOR** (futuro grande) — sugere loadout/arma conforme mapa + modo MP em tempo real. Consome o catálogo de Mapas (secção 9) + a análise com veredito (5.A).
7. **Marketplace** + **i18n EN** (Loadout/Meus Loadouts) — menor prioridade
   - i18n hoje ~95% coberto; pendência: Meus Loadouts (~5KB) e Construtor (~8KB) sem EN

### Pendências menores (não-bloqueantes)
- **8 nomes do Mid-Season S1** — os scorestreaks `streak_s1m_1` … `streak_s1m_8` são placeholders (Activision anunciou "8 legacy do BO6" mas não publicou a lista). Quando Victor mandar print da grid completa de scorestreaks do jogo, substituir os nomes mantendo os IDs.
- **`analyze-capture` v7** — schema com `build_code` (Gemini Vision não extrai hoje).
- **Análise de Loadout completo** separada da análise de arma (hoje só analisa build de arma).
- **Tradução `cat_attachments` PT-BR** (1102 rows, hoje em inglês do codmunity).
- **Inconsistência no Painel Hoje:** o changelog "O QUE MUDOU NESTA VERSÃO" hardcoded no HTML está sempre 1-2 versões atrás dos chaves i18n. Considerar gerar do mesmo source, ou remover a duplicação.

---

## 5.A · Análise de build com veredito — IMPLEMENTADA E AFINADA (v2.7.0 + Edge v3 + v2.7.6)

> Tarefa #1 original. Tem 3 entregas em camada: payload básico (v2.7.0), prompt v3 (Edge), e fix de bugs descobertos em uso real (v2.7.6). Esta secção é referência da arquitetura, não tarefa pendente.

### O que foi entregue (v2.7.0 + Edge v3)
A análise deixou de ser descrição genérica do jogador médio e passou a dar **veredito acionável** pro rusher CQB do Victor, cruzando build + estilo + dificuldades.

- **Frontend (`index.html`):** o payload do `analyze-build` (construído ~linha 23330, antes do `fetch` em ~23356) inclui:
  - `player_profile` — estilo, platform, priority perk Dexterity, ADS 0.85 *(originalmente hardcoded; corrigido em v2.7.6)*
  - `active_struggles` — array das dificuldades cadastradas (do `level.struggles` + `STRUGGLE_CATALOG`), `{title, possible_cause}`
- **Edge Function `analyze-build` v3 (Supabase):** system prompt em 3 eixos obrigatórios:
  1. **Estilo** — a build serve ao `player_profile.style`?
  2. **Dificuldades** — cruza com `active_struggles`; diz quais a build resolve, quais NÃO são de build, e o que trocar
  3. **Veredito final** — (a) "está no teto pro teu estilo", (b) "troca X por Y por causa de Z", (c) "o problema não é a arma, é [perk/config concreto]"
  - PT-BR/EN total com sigla explicada na 1ª menção; PROIBIDO placeholders literais; se há desalinhamento estilo↔build + candidatos, suggestions DEVE ter ≥1 adaptação; schema fechado + validação server-side; campo `replaces` (nome exato do attachment a trocar, validado contra `build.attachments[].name`).
- **Render:** `_renderAIAnalysisHtml(analysis, build, ctx)` (~linha 23158) formata cada suggestion com SLOT destacado + "Atual → Novo · L<level>" + rationale. CSS: `.bc-sug-item`, `.bc-sug-from`, `.bc-sug-arrow`, `.bc-sug-to`.

### Fixes da v2.7.6 — descobertos em uso real
Dois bugs encadeados, encontrados quando a Voyak KT-3 "BELEROFONTE" (recoil `-42`, range `+61`, mobility `+25`, handling `-20`) deu o veredito correto de desalinhamento mas com `suggestions: []` — a IA via o problema, não tinha matéria-prima pra sugerir adaptação.

**Bug 1 — perfil hardcoded.** O `requestAIAnalysis` (~linha 23290) mandava `style: 'rusher CQB agressivo'` literal e `platform: 'PS5'` literal, **ignorando** `player.playstyle` / `player.platform` persistidos (mesma chave que sidebar, card resumo e sync já usam). Foi um atalho da sessão original que esquecia: se Victor trocasse para SLAYER no select, todo o resto do Hub atualizava menos a análise.

**Fix:** criada tabela `PLAYSTYLE_PROFILE` (~linha 22996) que mapeia cada uma das 6 opções do select para descrição expandida + flags `needsMobility`/`needsHandling`/`needsRange`. `_resolvePlaystyleProfile(raw)` faz o resolve com fallback seguro para `RUSHER`. `requestAIAnalysis` agora lê `await LevelDB.player.get()` antes de montar o payload e envia `sp.label` no `style` + `player.platform || 'PS5'` no `platform`.

**Bug 2 — buraco lógico no motor determinístico.** `_computeBuildContext` (~linha 23008) classificava fraquezas só em **valores absolutos**: recoil > -5, mobility < 0, handling > -5, range < -10, mag < 0. Uma build long-range otimizada (recoil profundamente negativo, range positivo, mobility/handling neutros ou levemente baixos) tinha **zero fraquezas absolutas detectadas**. Resultado: `candidates_by_weakness: {}`, `perks_pool: []`. A IA cumpria R5 do prompt v3 ("sem candidatos compatíveis, suggestions pode ficar vazio") corretamente — mas o veredito final ficava insatisfatório.

**Fix:** `_computeBuildContext(build, base, playerStyle)` ganhou parâmetro opcional. Quando presente (chamada do `requestAIAnalysis`), aplica **fraquezas RELATIVAS ao estilo** logo após as absolutas:
- `needsHandling` + `handling > -25` → fraqueza relativa de handling
- `needsMobility` + `mobility < 15` → fraqueza relativa de mobility
- `needsRange` + `range < 10` → fraqueza relativa de range

Quando ausente (chamada de `generateBuildAnalysis` no render síncrono), pula a regra — não há prejuízo, é só pra render de UI. **Compat zero-risco.**

Resultado real testado em produção: para a BELEROFONTE, `weaknesses` agora tem `[{key: 'handling', text: 'handling não-agressivo para rusher CQB agressivo'}]`, `candidates_by_weakness.handling` tem 5 attachments ranqueados (Crisis-Q Grip score 54 → 1mW Instinct Laser Array score 18), `perks_pool` tem Fast Hands, e a IA devolveu 3 suggestions concretas em vez de array vazio.

### Pendências futuras (refinos)
- Refazer test em mais armas além da BELEROFONTE.
- Quando `cat_struggles` virar BD (roadmap #2), trocar a fonte das `active_struggles` do front para a BD.
- Calibrar os thresholds da fraqueza relativa (`-25`, `15`, `10`) se aparecer falso positivo/negativo em uso real.
- Quando houver input de Platform (roadmap #3), confirmar que está chegando ao payload.

---

## 6. ESTADO DE DEPLOY (v2.7.6 — pronto, não commitado)

- [x] `index.html` (v2.7.0→v2.7.5) commitado e no ar — feito 3/Jun/2026
- [ ] **`index.html` (v2.7.6) commitar** no repo `level-hub`, branch main
  - Title commit (<50 chars): `fix: análise IA respeita playstyle real (v2.7.6)`
  - Corpo do commit:
    ```
    Dois bugs encadeados do analyze-build descobertos em uso real (BELEROFONTE/Voyak KT-3):

    - Bug 1: requestAIAnalysis mandava player_profile.style hardcoded como
      'rusher CQB agressivo' ignorando player.playstyle real. Criada tabela
      PLAYSTYLE_PROFILE com as 6 opções do select expandidas + flags
      needsMobility/needsHandling/needsRange. Agora lê de LevelDB.player.

    - Bug 2: _computeBuildContext classificava fraquezas só em valores
      absolutos. Build long-range com zero fraquezas absolutas mandava
      candidates_by_weakness={} e perks_pool=[] pra IA, que via desalinhamento
      mas não tinha como sugerir adaptação. Adicionado bloco de fraquezas
      RELATIVAS ao playstyle do operador (handling > -25, mobility < 15,
      range < 10 quando o estilo exige a dimensão).

    Edge Function analyze-build NÃO foi tocada — o prompt v3 já estava certo,
    faltava era o payload chegar correto.
    ```
- [ ] **Este `LEVEL_ESTADO.md` atualizado** — commitar no repo `level-hub`
  - Title commit: `docs: estado em v2.7.6 (análise IA afinada)`
- [ ] Quando puder: rodar grid de scorestreaks do jogo pra fechar os 8 placeholders do Mid-Season S1

### Link direto pra commitar
- `https://github.com/victor-level-hub/level-hub/upload/main`
  - Arrasta os arquivos `index.html` e `LEVEL_ESTADO.md` da pasta /outputs
  - Cola o commit message acima
  - Clica **Commit changes**
- Netlify auto-deploya em ~1min. Conferir em `le-vel.games` que o footer mostra v2.7.6.

---

## 7. WORKFLOW & PADRÕES TÉCNICOS

- Edições sempre via Python `read → str_replace → write` em `/home/claude/hub.html`, **nunca** edição manual de linhas
- `str_replace` Python com `assert count == 1` antes de cada substituição
- Validação após cada alteração: `node --check` no maior bloco `<script>` (wrappar em `(async function(){...})()` se houver `await` top-level dentro)
- Para mudanças visuais: renderizar com Playwright (chromium headless) e inspecionar screenshot ANTES de entregar — não confiar só no código
- Output final: `/mnt/user-data/outputs/index.html`; Victor commita no GitHub
- **NUNCA** sugerir Google Drive ou Files do Projeto (Victor parou 31/Mai/2026)
- Mudança de frontend que afete schema → backend Supabase na mesma sessão
- **Diagnóstico de bug de comportamento:** quando o sintoma não bate com o código óbvio, instrumentar via console (monkeypatch das funções suspeitas + listeners) e pedir o output. Foi o que destravou os bugs DELETAR (v2.7.5) e suggestions vazio (v2.7.6).

### Fontes de dados do jogo
- **codmunity.gg**: fonte primária de attachments (`browser_batch` navigate→wait 3s→`get_page_text`; requer aprovação de permissão na 1ª navegação)
- **game8.co**: não funciona com `get_page_text` — usar `web_fetch` com URLs archive.org
- **callofduty.com / gamespot.com / dexerto / Fandom Wiki / allthings.how**: usadas pra compilar o catálogo de scorestreaks, specialties, field upgrades e mapas. callofduty.com bloqueia `web_fetch` direto (robots) — usar snippets de busca.

### Links diretos (sempre incluir ao orientar, o mais profundo possível)
- GitHub repo: `https://github.com/victor-level-hub/level-hub/blob/main/index.html`
- GitHub upload: `https://github.com/victor-level-hub/level-hub/upload/main`
- Supabase Edge Functions: `https://supabase.com/dashboard/project/cqkhqtgmolmrfgzozocr/functions/<nome>/code`
- Netlify: app.netlify.com · Supabase: supabase.com/dashboard · GitHub: github.com · Cloudflare: dash.cloudflare.com

---

## 8. APRENDIZADOS — NÃO REPETIR

### 8.A · Bug DELETAR build (v2.7.5) — handler sem scope

**Sintoma:** clicar Apagar numa build mostrava o modal, confirmavas, e a build continuava na lista.

**Causa-raiz:** havia **dois handlers `click` globais no `document`**, ambos usando `e.target.closest('[data-action][data-id]')`:
- Handler do Construtor (~linha 23957) — filtrava `closest('.build-card')` ✓ correto
- Handler de Struggles (~linha 29884) — filtrava **apenas** `[data-action][data-id]`, **sem scope** ❌

Como o botão Apagar de uma build tem `[data-action="delete"][data-id]`, **ambos disparavam** no mesmo clique. O handler de struggle abria por cima um 2º `LevelModal.confirm` ("Remover dificuldade"); como `LevelModal.confirm` é **singleton**, o 2º modal sequestrava o resultado.

**Fix (1 linha):** handler de struggle agora exige `sAction.closest('.struggle-card')` além de `[data-action][data-id]`.

**Princípio geral:** todo handler de click delegado no `document` que use seletor genérico (`[data-action]`, `[data-id]`) **tem de amarrar a um container de scope** (`.build-card`, `.struggle-card`, `.loadout-card`, etc.). Há ainda um 3º handler de delete (loadout, ~linha 33718 `deleteLoadout`) — conferir scope próprio se mexer.

### 8.B · Análise IA "vazia" (v2.7.6) — fraqueza absoluta vs relativa ao estilo

**Sintoma:** Análise da BELEROFONTE devolvia o veredito correto de desalinhamento ("o teu jogo é rusher CQB e a build é long-range") mas com `suggestions: []` — sem nenhuma sugestão concreta de adaptação.

**Causa-raiz 1:** `requestAIAnalysis` ignorava o estado real do operador (`player.playstyle`) e enviava `'rusher CQB agressivo'` hardcoded. Funcionava por coincidência (Victor É rusher), mas se trocasse o select, a análise mentia.

**Causa-raiz 2 (a fundamental):** `_computeBuildContext` classificava fraquezas só em **valores absolutos** dos stats agregados. Uma build perfeita pra long-range (recoil profundamente negativo, range alto, mobility/handling neutros) não tinha fraqueza absoluta nenhuma. Resultado: `candidates_by_weakness` e `perks_pool` chegavam **vazios** à IA — ela via o desalinhamento mas não tinha matéria-prima.

**Fix:** o frontend agora lê `LevelDB.player.get()` antes de montar o payload, e `_computeBuildContext` aceita um terceiro parâmetro opcional `playerStyle` que ativa **fraquezas RELATIVAS ao estilo** (uma build pode estar perfeita em valores absolutos e ainda assim ser mal alinhada com o operador).

**Princípio geral 1:** quando um sistema lê estado do usuário em vários pontos, **um deles vai ficar pra trás** se o estado for hardcoded em vez de lido. Sempre ler do `LevelDB.player` (ou equivalente), nunca repetir o valor literal num lugar fora.

**Princípio geral 2:** sistemas de análise/diagnóstico devem **separar dois eixos**: o que é desbalanceado em valor absoluto (ex: build sem mira), e o que é desbalanceado em relação ao contexto do usuário (ex: build perfeita pra sniper, mas o user é rusher). Tratar ambos como "fraqueza" pra mesma pipeline de candidatos resolve o desalinhamento sem inflar o prompt.

**Princípio geral 3 (sobre `LEVEL_ESTADO.md`):** este documento estava **5 versões atrás** (dizia v2.6.4) quando a sessão começou. O footer real do `index.html` é a fonte de verdade — sempre conferir `grep "LEVEL · <strong>v" index.html` antes de cravar próxima versão. Memória persistida pode mentir.

---

## 9. CATÁLOGOS BO7 (constantes JS no front — sem BD hoje)

> Adicionados nas v2.7.3/v2.7.4. Vivem **só** como constantes no `index.html`. NÃO há tabelas `cat_streaks` / `cat_specialties` / `cat_field_upgrades` / `cat_maps` no Supabase. Migração entra junto com o item 1 do roadmap (user-assets bucket), se fizer sentido.

### Scorestreaks — `STREAK_ITEMS` (~linha 30888) — 32 itens
21 do lançamento + Deadeye Drone (S1) + **8 placeholders** `streak_s1m_1..8` (Mid-Season S1, legacy BO6, nomes a confirmar) + Lockshot (S2) + Ion Core (S3). Cada item: `{id, name, cost, desc}`.

### Specialties — `SPECIALTY_ITEMS` (~linha 30968) — 6 itens
3 core (Enforcer/vermelho, Recon/azul, Strategist/verde) + 3 hybrid (Scout, Tactician, Operative).

### Field Upgrades — `EXTRA_EQUIPMENT_ITEMS` (~linha 30987) — 12 itens
10 do lançamento + Morphine Injector + Tactical Insertion (S1 Mid). **Stim Grenade saiu** (é tático).

### Mapas — `DEFAULT_MAPS_BO7` (~linha 30791) — 40 itens (fallback)
Source da aba MAPAS faz UNIÃO: `window.MAPS_CATALOG` (servidor) + `DEFAULT_MAPS_BO7` (fallback hardcoded).

### Render compartilhado — `renderSettings()` (~linha 31167)
Cards mostram `desc` e badge `cost`. CSS: `.img-card-desc`, `.img-card-cost`.

### Level Unlocks — DUAS structs separadas (não confundir)
- **`UNLOCKS_LIST`** (~linha 20552) — agregada por level, categorias múltiplas. Tela Progressão. **Stim Shot** no Level 21.
- **`UNLOCKS_BY_PLAYER_LEVEL`** (~linha 20741) — só perks + wildcards.

### Playstyle (novo na v2.7.6) — `PLAYSTYLE_PROFILE` (~linha 22996)
Mapinha das 6 opções do select de Configurações ▸ Operador para descrição expandida + flags `needsMobility`/`needsHandling`/`needsRange`. Usado pelo `_computeBuildContext` (fraqueza relativa) e pelo `requestAIAnalysis` (payload da IA). Resolve via `_resolvePlaystyleProfile(raw)` com fallback `RUSHER`.

---

## 10. MONETIZAÇÃO (decidido 18/Mai/2026)

- **FREE:** regras determinísticas, até 5 loadouts
- **PLUS R$19,90/mês:** IA conversacional, Vision API, coaching, loadouts ilimitados, sync, "Falar com Le Vél"
- **PRO R$49,90/mês:** replay analysis, coach session, meta builds, comunidade
- **Founder vitalício:** 100 primeiros Plus / 50 primeiros Pro — preço travado, badge permanente
- BYOK descartado (fricção mata conversão); backend centralizado para Plus

---

*LEVEL · BO7 Tactical Hub — documento de estado. Regenerar ao fim de cada marco.*
