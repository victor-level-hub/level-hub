# LEVEL · ESTADO DO PROJETO
> Memória estendida do BO7 Tactical Hub. Atualizado a cada marco.
> **Última atualização:** 3 Jun 2026 — fecho do marco v2.7.x (catálogo BO7 + bug DELETAR)

---

## 0. COMO USAR ESTE DOCUMENTO (handoff de chat)

Ao abrir um chat novo, anexar **sempre**:
1. `index.html` (o estado atual do Hub — sem ele, Cráudio trabalha de base errada)
2. Este `LEVEL_ESTADO.md`

Sem o `index.html` anexado, **não começar a editar**. Pedir o arquivo primeiro.

**Primeira mensagem sugerida pro próximo chat:**
> "Anexei o index.html (v2.7.5) e o LEVEL_ESTADO.md. Próxima tarefa: [escolher do roadmap, secção 5]."

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
2. **Footer** `LEVEL vX.Y.Z` + ver-tag (linha ~15150)
3. Bloco **"O QUE MUDOU NESTA VERSÃO"** no topo do Painel Hoje
4. Entrada no topo do **Histórico de Versões** (`vh-entry` no topo da `vh-list`, ~linha 13632)
5. **Título do commit < 50 chars**
6. **Descrição do commit** (corpo com bullets — NUNCA esquecer)
7. **Link direto e completo** do destino externo + passos no destino

> Itens 1–4 só em release do Hub. Itens 5+6+7 valem pra **todo** arquivo commitado no GitHub (index.html, LEVEL_ESTADO.md, .ts, doc).

---

## 2. ESTADO ATUAL DO HUB

**Versão:** `v2.7.5` (SemVer desde v2.0.0) — **no ar** (Victor subiu 3/Jun/2026)
**Arquivo:** single-file `index.html` (~2.3 MB, ~37.650 linhas)
**Stack:** HTML/CSS/JS inline + Supabase backend
**Deploy:** repo `victor-level-hub/level-hub` (privado) → branch main → auto-deploy Netlify `le-vel-hub` → domínio le-vel.games

### Histórico do marco v2.7.x
- **v2.7.0** — Três entregas num deploy:
  - **Análise IA de build com veredito** (era a prioridade #1 do roadmap — FEITA). Edge Function `analyze-build` passou a receber `player_profile` (estilo rusher CQB, PS5, Dexterity, ADS 0.85) + `active_struggles` (dificuldades cadastradas) no payload, e a dar veredito acionável em vez de descrição genérica. Ver secção 5.A (agora marcada como implementada).
  - **Eventos auto-limpam.** `POST_END_GRACE_MS = 4 dias`; `renderEvents` filtra eventos terminados há mais de 4 dias.
  - **Captura — dropdown robusto.** Helper `_getAllKnownWeapons()` = união `DEFAULT_WEAPONS` ∪ `LevelDB.weapons`.
- **v2.7.1** — Grid de eventos 3-col (desktop) / 1-col (mobile); banner de lançamento **MW4** (23 Out 2026, `kind: 'launch'`); scroll de modais reseta via MutationObserver global; Configurações ▸ Armamento usa união de armas (`_knownWeaponsSync()`); sugestões da IA reformatadas (SLOT destacado + "Atual → Novo · L<level>" + rationale; schema da Edge Function ganhou campo `replaces`).
- **v2.7.2** — Avatar do card Configurações ▸ Operador agora retangular 3:4 (era círculo); campo "Estilo" passou a aparecer (bug: lia `player.style` em vez de `player.playstyle`).
- **v2.7.3** — **Catálogo BO7 completo** em Configurações ▸ Imagens ▸ Vantagens & Séries. Scorestreaks 4→32, specialties 4→6, field upgrades 2→12. Cada item com `desc` pt-BR + `cost` (streaks). Ver secção 9.
- **v2.7.4** — Aba Configurações ▸ Imagens ▸ **Mapas povoada** (fallback `DEFAULT_MAPS_BO7`, 40 mapas) + **Stim Shot** adicionado ao Level 21 da Progressão. Ver secção 9.
- **v2.7.5** — **Bug crítico DELETAR build resolvido** (handler de struggle sem scope sequestrava o clique). Ver secção 8 (aprendizado) — é o padrão de bug mais importante a não repetir.

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
- **Edge Function `analyze-build` v3** (deployada 3/Jun/2026) — recebe `player_profile` + `active_struggles`, dá veredito em 3 eixos (estilo / dificuldades / veredito final), schema fechado com campo `replaces`, validação server-side anti-alucinação, respeita `payload.language` (pt/en). Ver secção 5.A.
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

---

## 5. PRÓXIMAS PENDÊNCIAS (roadmap por prioridade)

> A análise de build com veredito (antiga #1) foi **implementada** na v2.7.0 + Edge Function v3. Pode precisar de refino com uso real (ver 5.A). Roadmap reordenado:

1. **user-assets bucket** — migrar imagens localStorage→Supabase Storage (paths por auth.uid)
   - RLS policies ainda **pendentes**
   - Migração de capturas mobile (QR → auth.uid) pendente
   - O **catálogo de Vantagens & Séries + Mapas** (hoje constantes JS, ver secção 9) migra junto, se fizer sentido virar BD/Storage
   - Faltam os arquivos `bo7-capture` e `level-capture-avatar` para Cráudio trabalhar
2. **cat_struggles BD + admin UI** — hoje as dificuldades vivem no localStorage (`level.struggles`) + `STRUGGLE_CATALOG`. A análise de build (v2.7.0) já consome o que existe no front; uma BD dedicada + admin permitiria curar o catálogo.
3. **UI Codenames** (admin + botão "Sugerir" em build/loadout)
4. **Avatar IA Nano Banana 2** (arquivo `level-capture-avatar.html` já existe no projeto)
5. **PRE-MATCH ADVISOR** (futuro grande) — sugere loadout/arma conforme mapa + modo MP em tempo real. Consome o catálogo de Mapas (secção 9) + a análise com veredito (5.A).
6. **Marketplace** + **i18n EN** (Loadout/Meus Loadouts) — menor prioridade
   - i18n hoje ~95% coberto; pendência: Meus Loadouts (~5KB) e Construtor (~8KB) sem EN

### Pendências menores (não-bloqueantes)
- **8 nomes do Mid-Season S1** — os scorestreaks `streak_s1m_1` … `streak_s1m_8` são placeholders (Activision anunciou "8 legacy do BO6" mas não publicou a lista). Quando Victor mandar print da grid completa de scorestreaks do jogo, substituir os nomes mantendo os IDs.
- **`analyze-capture` v7** — schema com `build_code` (Gemini Vision não extrai hoje).
- **Análise de Loadout completo** separada da análise de arma (hoje só analisa build de arma).
- **Tradução `cat_attachments` PT-BR** (1102 rows, hoje em inglês do codmunity).

---

## 5.A · Análise de build com veredito — IMPLEMENTADA (v2.7.0 + Edge v3)

> Era a tarefa #1. Foi feita. Esta secção fica como referência da arquitetura, não como tarefa pendente.

### O que foi entregue
A análise deixou de ser descrição genérica do jogador médio e passou a dar **veredito acionável** pro rusher CQB do Victor, cruzando build + estilo + dificuldades.

- **Frontend (`index.html`):** o payload do `analyze-build` (construído ~linha 23330, antes do `fetch` em ~23356) passou a incluir:
  - `player_profile` — estilo rusher CQB agressivo, PS5, priority perk Dexterity, ADS 0.85
  - `active_struggles` — array das dificuldades cadastradas (do `level.struggles` + `STRUGGLE_CATALOG`), `{title, possible_cause}`
- **Edge Function `analyze-build` v3 (Supabase):** system prompt reescrito para dar veredito em 3 eixos obrigatórios:
  1. **Estilo** — a build serve ao `player_profile.style`? (não ao jogador médio)
  2. **Dificuldades** — cruza com `active_struggles`; diz quais a build resolve, quais NÃO são de build (ex.: flinch = perk/sensibilidade, não attachment) e o que trocar
  3. **Veredito final** — conclusão clara entre (a) "está no teto pro teu estilo", (b) "troca X por Y por causa de Z", (c) "o problema não é a arma, é [perk/config]"
  - PT-BR/EN total com sigla explicada na 1ª menção; PROIBIDO placeholders literais tipo `[perk/config]`; se há desalinhamento estilo↔build + candidatos, suggestions DEVE ter ≥1 adaptação; schema fechado + validação server-side; campo `replaces` (nome exato do attachment a trocar, validado contra `build.attachments[].name`).
- **Render:** `_renderAIAnalysisHtml(analysis, build, ctx)` (~linha 23158) formata cada suggestion com SLOT destacado + "Atual → Novo · L<level>" + rationale. CSS: `.bc-sug-item`, `.bc-sug-from`, `.bc-sug-arrow`, `.bc-sug-to`.

### Possível refino futuro (se o uso real pedir)
- Confirmar de qual chave/estado o estilo é lido (o badge ESTILO usa `player.playstyle`).
- Quando `cat_struggles` virar BD (roadmap #2), trocar a fonte das `active_struggles` do front para a BD.
- Testar com mais armas além da Peacekeeper MK1 + dificuldade "atiro primeiro mas morro".

---

## 6. ESTADO DE DEPLOY (v2.7.5 — no ar)

- [x] `index.html` (v2.7.5) commitado no repo `level-hub`, branch main — **feito 3/Jun/2026**
- [x] v2.7.5 engloba v2.7.0→v2.7.4 (Victor subiu tudo de uma vez)
- [ ] **Este `LEVEL_ESTADO.md` atualizado** — commitar no repo `level-hub` (ver instruções no fim da entrega)
- [ ] Quando puder: rodar grid de scorestreaks do jogo pra fechar os 8 placeholders do Mid-Season S1

---

## 7. WORKFLOW & PADRÕES TÉCNICOS

- Edições sempre via Python `read → str_replace → write` em `/home/claude/hub.html`, **nunca** edição manual de linhas
- `str_replace` Python com `assert count == 1` antes de cada substituição
- Validação após cada alteração: `node --check` no maior bloco `<script>`
- Para mudanças visuais: renderizar com Playwright (chromium headless) e inspecionar screenshot ANTES de entregar — não confiar só no código
- Output final: `/mnt/user-data/outputs/index.html`; Victor commita no GitHub
- **NUNCA** sugerir Google Drive ou Files do Projeto (Victor parou 31/Mai/2026)
- Mudança de frontend que afete schema → backend Supabase na mesma sessão
- **Diagnóstico de bug de comportamento:** quando o sintoma não bate com o código óbvio, instrumentar via console (monkeypatch das funções suspeitas + listeners) e pedir o output. Foi o que destravou o bug DELETAR (secção 8).

### Fontes de dados do jogo
- **codmunity.gg**: fonte primária de attachments (`browser_batch` navigate→wait 3s→`get_page_text`; requer aprovação de permissão na 1ª navegação)
- **game8.co**: não funciona com `get_page_text` — usar `web_fetch` com URLs archive.org
- **callofduty.com / gamespot.com / dexerto / Fandom Wiki / allthings.how**: usadas pra compilar o catálogo de scorestreaks, specialties, field upgrades e mapas (secção 9). callofduty.com bloqueia `web_fetch` direto (robots) — usar snippets de busca.

### Links diretos (sempre incluir ao orientar, o mais profundo possível)
- GitHub repo: `https://github.com/victor-level-hub/level-hub/blob/main/index.html`
- Supabase Edge Functions: `https://supabase.com/dashboard/project/cqkhqtgmolmrfgzozocr/functions/<nome>/code`
- Netlify: app.netlify.com · Supabase: supabase.com/dashboard · GitHub: github.com · Cloudflare: dash.cloudflare.com

---

## 8. APRENDIZADO — Bug DELETAR build (v2.7.5) · NÃO REPETIR

**Sintoma:** clicar Apagar numa build mostrava o modal, confirmavas, e a build continuava na lista.

**Causa-raiz:** havia **dois handlers `click` globais no `document`**, ambos usando `e.target.closest('[data-action][data-id]')`:
- Handler do Construtor (~linha 23957) — filtrava `closest('.build-card')` ✓ correto
- Handler de Struggles (~linha 29884) — filtrava **apenas** `[data-action][data-id]`, **sem scope** ❌

Como o botão Apagar de uma build tem `[data-action="delete"][data-id]`, **ambos disparavam** no mesmo clique. O handler de struggle abria por cima um 2º `LevelModal.confirm` ("Remover dificuldade"); como `LevelModal.confirm` é **singleton**, o 2º modal sequestrava o resultado. O `true` do usuário ia pro handler de struggle, que chamava `LevelDB.struggles.delete(id)` com um id de **build** — noop silencioso. `LevelDB.builds.delete` **nunca** era chamado.

**Fix (1 linha):** handler de struggle agora exige `sAction.closest('.struggle-card')` além de `[data-action][data-id]`. Comentário inline deixado no código.

**Princípio geral:** todo handler de click delegado no `document` que use seletor genérico (`[data-action]`, `[data-id]`) **tem de amarrar a um container de scope** (`.build-card`, `.struggle-card`, `.loadout-card`, etc.). Caso contrário captura cliques de outras telas. Há ainda um 3º handler de delete (loadout, ~linha 33718 `deleteLoadout`) — conferir que tem scope próprio se mexer.

---

## 9. CATÁLOGOS BO7 (constantes JS no front — sem BD hoje)

> Adicionados nas v2.7.3/v2.7.4. Vivem **só** como constantes no `index.html`. NÃO há tabelas `cat_streaks` / `cat_specialties` / `cat_field_upgrades` / `cat_maps` no Supabase. Migração entra junto com o item 1 do roadmap (user-assets bucket), se fizer sentido.

### Scorestreaks — `STREAK_ITEMS` (~linha 30888) — 32 itens
21 do lançamento + Deadeye Drone (S1) + **8 placeholders** `streak_s1m_1..8` (Mid-Season S1, legacy BO6, nomes a confirmar) + Lockshot (S2) + Ion Core (S3). Cada item: `{id, name, cost, desc}`. `cost` em pts quando confirmado, senão `null`.

### Specialties — `SPECIALTY_ITEMS` (~linha 30968) — 6 itens
3 core (Enforcer/vermelho, Recon/azul, Strategist/verde) + 3 hybrid (Scout/vermelho+azul, Tactician/vermelho+verde, Operative/azul+verde). Cada `desc` lista os perks que a specialty habilita + o efeito.

### Field Upgrades — `EXTRA_EQUIPMENT_ITEMS` (~linha 30987) — 12 itens
10 do lançamento (Assault Pack, Drone Pod, Trophy System, Active Camo, Echo Unit, Squad Link, Scrambler, Fear Trap, Black Hat, Mute Field) + Morphine Injector + Tactical Insertion (S1 Mid). **Stim Grenade saiu** (é tático, não field upgrade).

### Mapas — `DEFAULT_MAPS_BO7` (~linha 30791) — 40 itens (fallback)
Source da aba MAPAS faz UNIÃO: `window.MAPS_CATALOG` (servidor, preferido) + `DEFAULT_MAPS_BO7` (fallback hardcoded). 17 lançamento (15 core + 2 skirmish) + Nuketown 2025 + 5 S1 + 4 S1R + 5 S2 + 5 S3 + 3 S3R. Cada mapa: `{id, name, season, mode, desc}`. `season` ∈ {launch, launch-post, s1, s1r, s2, s3, s3r}; `mode` ∈ {core, skirmish, freerun}.

### Render compartilhado — `renderSettings()` (~linha 31167)
Cards mostram `desc` (cinza, border-top dashed) e badge `cost` (laranja) quando presentes. CSS: `.img-card-desc`, `.img-card-cost` (~linha 2762).

### Level Unlocks — DUAS structs separadas (não confundir)
- **`UNLOCKS_LIST`** (~linha 20552) — agregada por level, categorias múltiplas (killstreak/perk/equipment/weapon). É a usada na tela Progressão. **Stim Shot** foi adicionado aqui no Level 21 (`t_stimshot`, category `equipment`, icon `syringe`).
- **`UNLOCKS_BY_PLAYER_LEVEL`** (~linha 20741) — só perks + wildcards.

---

## 10. MONETIZAÇÃO (decidido 18/Mai/2026)

- **FREE:** regras determinísticas, até 5 loadouts
- **PLUS R$19,90/mês:** IA conversacional, Vision API, coaching, loadouts ilimitados, sync, "Falar com Le Vél"
- **PRO R$49,90/mês:** replay analysis, coach session, meta builds, comunidade
- **Founder vitalício:** 100 primeiros Plus / 50 primeiros Pro — preço travado, badge permanente
- BYOK descartado (fricção mata conversão); backend centralizado para Plus

---

*LEVEL · BO7 Tactical Hub — documento de estado. Regenerar ao fim de cada marco.*
