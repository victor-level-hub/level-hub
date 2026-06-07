# LEVEL · ESTADO DO PROJETO
> Memória estendida do BO7 Tactical Hub. Atualizado a cada marco.
> **Última atualização:** 7 Jun 2026 — fecho do marco v2.12.0 (avaliação de armas: estrelas + Salvar + histórico). Próximo: tooltips bonitinhos + sync da Linguagem Técnica na nuvem.

---

## 0. COMO USAR ESTE DOCUMENTO (handoff de chat)

Ao abrir um chat novo, anexar **sempre**:
1. `index.html` (o estado atual do Hub — sem ele, Cráudio trabalha de base errada)
2. Este `LEVEL_ESTADO.md`

Sem o `index.html` anexado, **não começar a editar**. Pedir o arquivo primeiro.

**Primeira mensagem sugerida pro próximo chat:**
> "Anexei o index.html (v2.12.0) e o LEVEL_ESTADO.md. Próxima tarefa: tooltips (?) bonitinhos + sync da Linguagem Técnica na nuvem (ver secção 5)."

> ⚠️ **CRÍTICO** — ANTES de propor qualquer plano de backend OU de tocar no `index.html`:
> 1. **Verifica que o arquivo anexado é a versão real do GitHub.** Roda `curl -sL https://raw.githubusercontent.com/victor-level-hub/level-hub/main/index.html | grep "LEVEL · <strong>v"` e compara com o footer do arquivo anexado. Se divergir, o anexo está atrasado — pede o arquivo certo. Aprendido na sessão da v2.8.0 (perdi tempo trabalhando em cima de v2.7.5 quando o real era v2.7.7).
> 2. **Faz auditoria de 5 minutos** (ver secção 8.C). O doc pode estar desatualizado.

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

**Versão:** `v2.12.0` (SemVer desde v2.0.0)
**Arquivo:** single-file `index.html` (~2.81 MB, ~39.690 linhas)
**Stack:** HTML/CSS/JS inline + Supabase backend
**Deploy:** repo `victor-level-hub/level-hub` (privado) → branch main → auto-deploy Netlify `le-vel-hub` → domínio le-vel.games

### Histórico do marco v2.7.x → v2.8.x
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
- **v2.7.7** — **Plataforma editável.** Adicionado select PS5/PC/Xbox no modal Configurações ▸ Operador. Estado `player.platform` já existia e já era exibido no card, mas não tinha input.
- **v2.8.0** — **Admin UI de Dificuldades + sync de admin pelo BD + fix idioma.** Painel admin novo em Configurações ▸ Operador para curar `cat_struggles` (22 entradas reais: 11 dificuldades × PT/EN). Reconhecimento de admin passou a ler `hub_users.is_admin` do banco com fallback de cache (LS). Fix do bug do `languagechange` que deixava o catálogo preso no idioma do boot. Migration `hub_users_is_admin_flag` aplicada. Ver secção 5.B.
- **v2.8.1** — **Sync admin↔user picker em tempo real.** Fecho do ciclo aberto na v2.8.0. Hook `syncUserCatalog()` no bloco `adminCrudStruggles` dispara `loadStrugglesCatalog` + `renderStruggles` depois de cada save/delete bem-sucedido, atualizando o picker do user em Evolução ▸ Dificuldades sem refresh do navegador. PATCH.
- **v2.9.0** — **Codenames admin UI + Sugestor + fix visual.** Três entregas combinadas: (1) painel admin de `cat_codenames` no Operador (125+ codenames em 22 categorias), (2) botão "Sugerir codename" no modal Salvar Loadout com sorteador por categoria + anti-repetição, (3) fix do desalinhamento do modal Editar Status do Operador (label "Level atual" + grid 1fr×3 com `align-items: end`). Ver secção 5.C.
- **v2.10.0** — **Captura lê mais dados + guia de fotos.** (1) Edge Function `analyze-capture` **v7**: schema da Vision ganhou `weapon_prestige`, `weapon_level`, `build_code` (formato BO7 `S07-XXXXX-XXXXX-XXXX`); prompt instruído a procurar os 3 sem adivinhar. (2) Card de aprovação (`buildApprovalCard`) exibe os 3 como chips (build code em laranja `--accent-orange`); renderização condicional (chip só aparece se a Vision leu). (3) Build code passa a preencher o Construtor (lógica do `preencherViaUI` já existia desde v75-95, faltava o dado vir da Edge). (4) Guia visual no modal do QR: 3 cards com fotos-exemplo reais (Loadouts/Gunsmith/Preview) em WebP embutido (~226 KB), zoom no hover, aviso de até 5 fotos. Ver secção 5.D.
- **v2.11.0** — **Tradutor de termos técnicos + 3 fixes.** (1) Tabela `cat_glossary` no Supabase (estrutura multi-idioma chave→idioma→valor; 66 termos PT+EN da localização **oficial** Activision; RLS leitura pública + escrita service_role; 14 rows `needs_review` = 9 termos de mecânica fina × idiomas a confirmar no jogo). (2) Motor `window.LevelGlossary` + switch "Termos" (PT/EN) no header com tooltip; aplica "TERMO (tradução)" só em **zonas seguras** (`data-glossary-zone`: Vantagens, Controle, Dificuldades, Mapas, Progressão, Treino); nomes próprios protegidos. Preferência em `ui_prefs.tech_lang` (localStorage; sync na nuvem pendente). (3) **Fix da quebra de layout** (regressão da v2.10.0): entry v2.9.0 do histórico ficou sem `<div class="vh-entry">` mas com o `</div>` de fecho → órfão fechava `<main>` cedo e expulsava 5 seções. (4) Tooltips do BACKUP reescritos (deixam claro que é automático). (5) Fix do modal "Migrar imagens": chaves i18n faltavam no `CBI18N` (mostrava chave crua). Ver secção 5.E.
- **v2.12.0** — **Avaliação de armas: estrelas + Salvar + histórico.** Reformulação da aba **Avalie** das armas (Meus Loadouts). (1) **Fix das estrelas amarelas**: o SVG `{{i:star}}` não tinha `fill` — CSS `.bc-star svg { fill/stroke: currentColor }` faz a estrela cheia pintar de verdade (vazia cinza, cheia laranja). (2) **Rascunho + botão Salvar**: clicar monta rascunho em memória (re-pinta na hora), só persiste no botão "Salvar avaliação" (que pulsa quando há mudança não salva). (3) **Histórico no Supabase**: nova tabela `hub_build_ratings` (1 row/avaliação salva: 5 dimensões + `rated_at`; RLS dono+service_role). Descoberta: `hub_builds` não tinha coluna de ratings, notas nunca sincronizavam → a tabela nova é a fonte da verdade. (4) **Data+hora completas**: "07/06" virou "07/06/2026 - 02:08", mesma cor, em rodapé próprio. Ver secção 5.F.

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
- `user-assets` bucket **em produção** desde 25/Mai. Hoje (4/Jun) tem **24 objetos** (~1.4 MB) uploaded — 23 ícones de armas (10 SMG + 10 AR + 4 Sniper) + 1 outro, paths no formato `{hub_users.id}/<category>/<subcategory>/<item_id>.<ext>` (ex: `3fa59ebd-b507-.../armamento/smg/wpn_sturmwolf45.webp`). **Path usa `hub_users.id`, NÃO `auth.uid()`** — a Edge `user-asset` v4 faz a resolução via JOIN. RLS **fechado em 4/Jun (8 policies aplicadas)**: 4 em `storage.objects` filtrando por bucket + folder1 = `hub_users.id` do user com `auth_user_id = auth.uid()`, 4 em `public.user_assets` filtrando por mesmo critério. As Edge Functions usam `SERVICE_ROLE_KEY` (bypassa RLS) — policies protegem só contra ataque direto na Storage API por outros JWTs autenticados.
- Tabela `user_assets` (public): `id`, `user_id (FK hub_users)`, `category`, `subcategory`, `item_id`, `storage_path`, `content_type`, `size_bytes`, timestamps. UNIQUE em `(user_id, item_id)` — Edge usa `upsert(..., onConflict: "user_id,item_id")`. RLS on, 4 policies.
- **Buckets relacionados:** `capture-photos` (56 objetos, ~21 MB; capturas mobile do QR — usa `local_id`, RLS via `anon_*` policies), `avatar-selfies` e `avatar-generated` (vazios? não auditei).
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

> O perfil acima é o estado de Victor hoje. O **Hub** lê de `LevelDB.player` (chaves `playstyle`, `platform`, `prestige`, `level`, `name`, `photo`). O select de Configurações ▸ Operador oferece 6 estilos: `RUSHER`, `SLAYER`, `ANCHOR`, `OBJECTIVE`, `SNIPER SUPPORT`, `FLEX` — e 3 plataformas: `PS5`, `PC`, `Xbox` (input adicionado na v2.7.7; BO7 é cross-play entre as três, Switch não suporta).

---

## 5. PRÓXIMAS PENDÊNCIAS (roadmap por prioridade)

> Estado descoberto em 4/Jun/2026: vários itens do roadmap antigo **já estavam parcial ou totalmente implementados** no back. O `LEVEL_ESTADO.md` anterior estava muito desatualizado nessa parte. Roadmap reescrito baseado no que **realmente** falta:

### 🟦 PRIORIDADE MÁXIMA (próxima sessão — DECIDIDO 7/Jun/2026)

**0. Tooltips bonitinhos (?) + Sync da Linguagem Técnica na nuvem** — combinação escolhida pelo Victor. Dois itens que tocam a mesma área (config de UI no header):
   - **Tooltips bonitinhos:** trocar os `title=""` nativos do navegador (balão branco feio, ver print 7/Jun) por um modal/popover estilizado no visual do Hub. Aplicar nos `?` de ajuda — começou no switch "Termos" (`.techlang-help`) mas vale para todos os tooltips de ajuda do Hub. Sem emoji, SVG inline, paleta do Hub.
   - **Sync da Linguagem Técnica:** hoje `ui_prefs.tech_lang` salva só em localStorage. Construir o canal de sync de `hub_settings`/`ui_prefs` (que **não existe ainda** no Hub — nem push, nem pull, nem nas Edge `sync-push`/`sync-pull`). ⚠️ **É a feature de MAIOR RISCO** — mexe no mesmo canal que guarda arsenal/perfil/builds; um merge mal resolvido pode sobrescrever dado real entre dispositivos. Por isso foi isolada numa sessão dedicada. A coluna `ui_prefs` (jsonb) já existe em `hub_settings` (0 rows, nunca usada pelo front). Quando ligar, a preferência de Termos já gravada localmente sobe sem retrabalho.

**1. QA estruturado pré-v3.0.0** — auditoria completa (11 docs .docx, um por aba). Detalhes no `PROMPT_PROXIMO_CHAT.md`. Não bumpa versão. Era a prioridade #1 antes da sequência captura/tradução.

**2. Gráfico de progressão Prestige/Level (v3.0.0 MAJOR)** — Eixo Y = progressão, Eixo X = data/hora. Tabela `progression_snapshots` nova no Supabase (com `absolute_level` gerado como `prestige*55+level`), captura no `saveStatusFromModal` + snapshot diário automático, gráfico em ApexCharts. RLS policies no mesmo passo (lição 8.E). Filtros 7d/30d/90d/Tudo. **Só depois do QA.**

### 🟨 Pendências do tradutor (v2.11.0 — abrir conforme necessidade)

- **Confirmar 9 termos de mecânica fina** no `cat_glossary` (marcados `needs_review`): Flinch Resistance, ADS Speed, Sprint to Fire, Weapon Swap Speed, Recoil Gun Kick, Dexterity, Cold-Blooded, Assassin, Gung Ho. Victor vê no jogo PT-BR e passa o termo exato → UPDATE no banco.
- **Expandir zonas seguras do tradutor** para Construtor e Meus Armas — precisam de proteção fina de nomes próprios do catálogo (`cat_weapons`/`cat_attachments`) antes de marcar `data-glossary-zone`, senão o varredor erra dentro de nomes de arma/attachment.
- **Admin UI para `cat_glossary`** — hoje só dá pra editar via SQL. Seguir o padrão dos outros CRUDs admin (Mapas/Struggles/Codenames). Quando for fazer o autopreenchimento por IA (Edge Function com web search), é aqui que pluga o botão.

### 🟩 Pendências do roadmap original

1. ~~**user-assets bucket**~~ — **EM PRODUÇÃO E SEGURO desde 4/Jun/2026.** Bucket criado 25/Mai, Edge `user-asset` v4 (verify_jwt: true) ACTIVE, tabela `user_assets` com 24 rows reais (10 SMG + 10 AR + 4 Sniper uploads de 3/Jun), front integrado em `getUserImage`/`setUserImage`/`cloudUploadAsset`. **8 RLS policies aplicadas em 4/Jun (4 storage.objects + 4 public.user_assets)** fecham o buraco de acesso direto à Storage API por outros JWTs. Item fechado.

2. **Migrar imagens legacy localStorage→cloud** (era escopo do antigo #1, separado agora). Imagens setadas **antes** de v75-94 ficaram só em localStorage. Foto de perfil do Operador, banners de mapas, emblemas de prestige, ícones de perks — precisam de rotina "Sincronizar imagens legacy" que percorre `loadUserImages()`, resolve `category/subcategory` por id, chama `cloudUploadAsset` em loop com progresso. Provavelmente uma página nova em Configurações ▸ Sync (ou um botão grande lá). **Estimativa:** 1 sessão.

3. ~~**cat_struggles — admin UI**~~ — **FECHADO COMPLETO na v2.8.0 + v2.8.1.** Painel admin em Configurações ▸ Operador com CRUD bilíngue, modal de criar/editar com 8 campos, apagar individual por língua. Chama Edge `admin-cat-struggles` v3. Catálogo BD com 22 entradas (11 dificuldades × PT/EN). **v2.8.1** fechou o ciclo: hook `syncUserCatalog()` plugado em save/delete dispara `loadStrugglesCatalog()` + `renderStruggles()`, fazendo o picker do user em Evolução ▸ Dificuldades atualizar em tempo real sem F5. Item totalmente fechado.

4. ~~**Codenames**~~ — **FECHADO na v2.9.0.** Admin UI plugado (CRUD com filtro por categoria, modal de 10 campos), botão "Sugerir codename" no modal Salvar Loadout que sorteia do banco filtrando por categoria, com anti-repetição. 125+ codenames em 22 categorias já curados no banco. Edge `admin-cat-codenames` v2 já estava ACTIVE, agora consumida. Item fechado.

5. **Avatar IA Nano Banana 2** — Edge `generate-avatar` v5 + `avatar-session-create` v6 + `avatar-session-approve` v4 + `upload-avatar-selfie` v4 todas ACTIVE. Arquivo `level-capture-avatar.html` existe no projeto. Pendente confirmar o fluxo end-to-end.

6. **PRE-MATCH ADVISOR** (futuro grande) — sugere loadout/arma conforme mapa + modo MP em tempo real. Consome catálogo de Mapas (secção 9) + análise com veredito (5.A).

7. **Marketplace** — Edge `mkt-publish-build` + `mkt-vote` v4 já ACTIVE. Frontend ainda não tem aba.

8. **i18n EN** (Loadout/Meus Loadouts) — ~95% coberto, faltam ~13KB em duas telas.

### Pendências menores (não-bloqueantes)
- **Remover `local_id` da pipeline user-assets cloud** — `_getLocalIdSafe()` ainda é chamado em 5 lugares do bloco USER ASSETS CLOUD do front. A Edge já trabalha com `auth.uid` direto via JWT; `local_id` no body é só fallback de bootstrap legado. Limpeza sem urgência.
- **8 nomes do Mid-Season S1** — scorestreaks `streak_s1m_1` … `streak_s1m_8` são placeholders. Substituir quando Victor mandar print da grid completa.
- ~~**`analyze-capture` v7**~~ — **FECHADO na v2.10.0.** Schema agora extrai `weapon_prestige`, `weapon_level`, `build_code`. Deploy feito.
- **Análise de Loadout completo** separada da análise de arma (hoje só analisa build de arma).
- **Tradução `cat_attachments` PT-BR** (1102 rows) — parcialmente endereçado pela v2.11.0: o tradutor cobre os **descritores de categoria/slot** (Muzzle→Bocal, etc.) via `cat_glossary`, mas os **nomes próprios** dos 1102 attachments (REDWELL SHADE-X) continuam só em EN — e devem continuar (são nomes de fábrica, não se traduzem).
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

## 5.B · Admin UI de Dificuldades — v2.8.0

> Painel admin para curar o catálogo de `cat_struggles` (tabela do Supabase). Tarefa do antigo item #3 do roadmap, fechado em 4/Jun/2026.

### Estado prévio (descoberto na auditoria de 4/Jun)
- Tabela `cat_struggles` no Supabase **com 22 entradas reais** (11 dificuldades × PT/EN), schema sólido (10 colunas: `id`, `language`, `is_active`, `sort_order`, `title`, `icon`, `root_cause`, `tips[]`, `created_at`, `updated_at`)
- RLS habilitada com policies de leitura pública (anon lê só ativos, authenticated lê tudo, service_role faz tudo)
- Edge Function `admin-cat-struggles` v3 ACTIVE com auth via `x-level-admin-secret` (mesmo padrão de `admin-cat-maps`/`admin-cat-default-weapons`/`admin-cat-default-builds`)
- Front **já consumia** o catálogo via `loadStrugglesCatalog()` (rest/v1/cat_struggles direto), mas era leitura apenas

### O que faltava (entregue na v2.8.0)
**1. Painel admin no front.** Adicionado em Configurações ▸ Operador (linha ~15140, depois de CRUD Builds), wrap em `.opp-admin-only` para só aparecer quando `body.is-admin`. UI inteira segue o padrão exato dos CRUDs vizinhos:
- Lista com filtro de língua (PT/EN/Todas)
- Modal de criar/editar com os 8 campos da tabela:
  - `id` (text, snake_case, disabled ao editar)
  - `language` (select PT/EN, disabled ao editar)
  - `title` (text, obrigatório)
  - `icon` (select com 14 opções: lightbulb, target, wind, map, swords, plane, flag, trending-down, crosshair, footprints, radar, zap, shield, alert-triangle)
  - `sort_order` (number, default 10)
  - `is_active` (checkbox, default true)
  - `root_cause` (textarea, opcional)
  - `tips[]` (textarea de 1 dica por linha, HTML inline permitido)
- Apagar individual por língua (não por id global — apaga `(id, language)`, a outra língua continua)

JS: bloco `adminCrudStruggles` (~linha 37287), 320 linhas, idêntico em estrutura aos blocos `adminCrudMaps`/`adminCrudWeapons`/`adminCrudBuilds`. Lazy load — só dispara `loadStruggles()` quando user é admin E a aba ativa é `avatar` (painel Operador).

**2. Sync de admin via BD (Caminho C).** O bloco `initAdminMode` ganhou `refreshAdminFlag()` async que consulta `hub_users.is_admin` via Supabase Auth e sincroniza com `localStorage[level.role]` (cache que `isAdmin()` síncrona já lê). Lógica:
- BD diz `is_admin=true` + cache não tem → escreve no LS + aplica `body.is-admin`
- BD diz `is_admin=false` + cache tem → BD vence, limpa LS
- Query falhou (sem auth, rede em queda) → mantém cache
- `?admin=1` na URL ainda funciona como override de debug

Migration `hub_users_is_admin_flag` aplicada em paralelo (`ALTER TABLE hub_users ADD COLUMN is_admin BOOLEAN DEFAULT false` + `UPDATE ... WHERE id = '3fa59ebd-...'`).

**3. Fix do bug do `languagechange`.** A função `loadStrugglesCatalog` rodava só no boot — trocar PT↔EN no Hub não recarregava o catálogo. Agora dispara junto com o evento `languagechange`.

### Próximo passo (preparação para integração total)
Hoje o admin pode curar `cat_struggles` no banco, mas a aba **Evolução · Dificuldades** do user (onde ele marca quais sente como problema atual) ainda usa o catálogo carregado via `loadStrugglesCatalog`. **Falta confirmar** que dificuldades novas adicionadas pelo admin aparecem corretamente no picker do user (`renderStruggles` deveria pegar o catálogo dinâmico já — testar e validar). Quando isso estiver ok, fecha o ciclo: admin cura → banco → user vê → user marca → struggle ativa vai pro `analyze-build`.

**Status:** auditoria de 4/Jun confirmou que a integração no código já está completa (`loadStrugglesCatalog` substitui `STRUGGLE_CATALOG` em memória, `renderPicker` consome essa constante). Falta apenas teste prático: adicionar uma struggle via admin, abrir o picker sem F5, confirmar que aparece.

---

## 5.C · Codenames admin + Sugestor — v2.9.0

> Plugagem do catálogo `cat_codenames` (já no banco, já com Edge ACTIVE) no Hub. Tarefa do item #4 do roadmap, fechado em 4/Jun/2026.

### Estado prévio (auditoria de 4/Jun, pré-implementação)
- Tabela `cat_codenames` no Supabase com **125+ entradas curadas** em **22 categorias** distintas (mitologia grega/nórdica/egípcia/mesoamericana/hindu/japonesa/suméria, cinema vilões/heróis, horror, anime, games, literatura sombria, violência em inglês/espanhol/italiano, astronomia, ops militares, forças da natureza, cyberpunk, precisão, callsigns militares). Schema rico: `id`, `name`, `category`, `vibe` (texto livre, ~120 valores únicos no banco), `language` (pt/en/es/it/lat/ja/grego), `description`, `source`, `tags[]`, `image_url`, `is_active`, `sort_order`.
- Edge Function `admin-cat-codenames` v2 ACTIVE com auth via `x-level-admin-secret` (padrão de todos os outros admin CRUDs).
- Front: zero referências à tabela. Codename era apenas extraído do nome do loadout via `extractCodename(loadoutName)` (pega tudo antes da "/"). Sem sugestão, sem integração com o banco.

### O que foi entregue
**1. Painel ADMIN · Codenames** em Configurações ▸ Operador (depois de ADMIN · Dificuldades). Wrap em `.opp-admin-only`. UI segue padrão dos outros CRUDs admin com diferenças:
- Filtro **por categoria** (não por idioma — codenames são bilíngues por natureza, vivendo em qualquer das 7 línguas que o schema aceita)
- Modal de criar/editar com 10 campos: id, nome, categoria (22 opções fixas no select), idioma (7 opções), vibe (texto livre — schema não restringe), sort order, ativo, descrição (livre), source, tags (CSV)
- **Apagar global por id** (PK simples, sem versão por idioma como `cat_struggles`)
- Hook `syncUserCatalog()` chama `window.LevelCodenames.reload()` depois de cada save/delete, atualizando o pool do sugestor em tempo real

**2. Botão "Sugerir codename"** no modal **Salvar Loadout** (ao lado do campo "Nome do loadout"). Comportamento:
- Click abre modal `modal-suggest-codename` (separado)
- Modal tem select de categoria (com labels amigáveis tipo "Mitologia · Grega"), começando em "Aleatório (todas)"
- Botão **Sortear codename** sorteia da pool ativa filtrada por categoria, **com anti-repetição** (se sortear de novo na mesma categoria, evita repetir o último)
- Resultado renderiza em cartão com: nome em destaque (Black Ops One font, cor accent), vibe em itálico ("ataque cirúrgico", "fúria divina", etc), meta (categoria + idioma se não-PT)
- Botão **Usar este** aplica o nome ao campo `save-name`, **preservando inteligentemente o que vier depois da "/"** — se o user já tiver " / Rusher Hardpoint", vira "CICADA 3301 / Rusher Hardpoint"

**3. Bloco `levelCodenameSuggester` no JS.** Função `reload()` exposta via `window.LevelCodenames`. Carrega pool via REST/anon (só `is_active = true`), constrói lista de categorias únicas, popula o select. Chamada no boot (com delay de 600ms pra não bloquear) e depois de cada save/delete admin.

### Padrões reutilizados
- Estrutura do bloco JS idêntica a `adminCrudStruggles`: helpers (`getSecret`, `escapeHtmlAdm`, `setStatus`, `callAdmin`), `renderXList`, `loadX`, `openModal`, `closeModal`, `saveX`, `deleteX`, `initX`. Diferenças marcadas com comentários.
- Modal estrutura idêntica: header com ícone, body com grid 2-col + textareas, error inline em vermelho, actions com Cancelar + Salvar.
- HTML do painel admin idêntico: `.opp-action-item` com ícone + título + descrição + botões à direita.

### Próximo passo
Hoje o codename só é sugerido **ao salvar loadout**. Outros pontos onde caberia integração futura:
- Sugerir nome ao **criar build no Construtor** (antes mesmo de salvar)
- **Substituir** o `extractCodename(loadoutName)` por uma associação direta com o codename usado (campo novo no loadout: `codename_id` referenciando `cat_codenames.id`)
- Mostrar **imagem** do codename (campo `image_url` no schema, hoje todo vazio) no card do loadout/marketplace
- Filtro de codenames usados vs não usados (cada user vê quais já tem)

---

## 5.D · Captura: dados extra + guia de fotos — v2.10.0

**Edge `analyze-capture` v7** (`/mnt/project/analyze-capture-v6.ts` é a base; a v7 entregue tem 3 campos novos no `WEAPON_SCHEMA`):
- `weapon_prestige` (string "P1"/"P2"), `weapon_level` (int), `build_code` (string `S07-XXXXX-XXXXX-XXXX`)
- SYSTEM_PROMPT instrui a procurar os 3 sem adivinhar (só se claramente legível)
- Resto (retry, `ana_gemini_usage`, post-process de slots) intacto. Deploy feito.

**Front (`buildApprovalCard`):**
- Linha de chips abaixo do header: `.ca-extracted` > `.ca-xtag` (PRESTIGE/LEVEL neutros, BUILD CODE laranja `.ca-xtag-code`)
- Normalização de prestígio tolerante ("2"/"p2"/"P2" → "P2"); renderização condicional (sem chip = sem buraco)
- `preencherViaUI` já lia `data.visionWeapon.build_code` desde v75-95 — agora dispara porque a Edge manda o campo

**Guia de fotos (modal do QR, estado `mc-state-waiting`):**
- `.mc-guide` com 3 cards (`crosshair`/`wrench`/`eye`): Loadouts, Gunsmith, Weapon Preview
- Miniaturas WebP base64 embutidas (~226 KB total); `.mc-guide-zoom` amplia no hover (borda laranja)
- Cabeçalho avisa "até 5 fotos, quanto mais melhor"

---

## 5.E · Tradutor de termos técnicos — v2.11.0

**Tabela `cat_glossary` (Supabase, criada nesta sessão):**
- Estrutura multi-idioma: `term_key | lang | value | category | is_proper_noun | needs_review | note | sort_order | active`
- UNIQUE(term_key, lang). Adicionar idioma (es/it) = **inserir linhas**, não colunas.
- 132 rows = 66 termos × PT+EN. Categorias: class, slot, stat, perk, wildcard, concept, specialty.
- Chaves de perk **ancoradas nos IDs reais de `cat_perks`** (`perk.p_dexterity`); slots batem com `cat_attachments`.
- Fonte: localização **oficial** Activision (callofduty.com/br/pt). RLS: `glossary_read_all` (SELECT público), `glossary_service_all` (service_role).
- **14 rows `needs_review`** (9 conceitos × idiomas): os termos de mecânica fina sem fonte oficial PT-BR. Victor confirma no jogo → UPDATE.

**Motor (`window.LevelGlossary`, perto do `LevelCodenames` no front):**
- Carrega via REST/anon (só `active=true`). Monta índice do par origem(hubLang)→alvo(techLang).
- `setTechLang`/`getTechLang`/`effectiveTechLang`/`isActive`/`reload`/`apply`. Persiste em `localStorage['bo7hub_ui_prefs_v1'].tech_lang` ('auto'|'pt'|'en'; 'auto' = igual ao Hub).
- **Varredor com zonas seguras:** só age dentro de `[data-glossary-zone]`. Protege nomes próprios via `data-glossary-skip` e por estarem fora das zonas. Termos compostos casam antes dos curtos (regex ordenada por comprimento desc). MutationObserver traduz zonas async. Re-traduz no evento `languagechange`.
- **6 zonas marcadas:** section-perks, section-controller, section-struggles, section-maps, section-progression, section-aimtraining. (Construtor/Meus Armas faltam — precisam proteção fina de nomes próprios.)
- Boot: `DOMContentLoaded` + rede de segurança no `load` (zonas estáticas tardias).

**Switch no header:** `.techlang-wrap` após o `.lang-toggle`; reusa classe `.lang-toggle` (bandeiras), rótulo "Termos", `.techlang-help` com `?` (ícone `help-circle` adicionado ao registry LUCIDE). `setTechLang()` global + `syncTechLangToggle()` marcam o botão ativo pelo idioma EFETIVO.

**Pendente:** sync de `ui_prefs.tech_lang` na nuvem (próxima sessão, junto com tooltips bonitinhos) + tooltips estilizados no lugar dos `title` nativos.

---

## 5.F · Avaliação de armas: estrelas + Salvar + histórico — v2.12.0

> Levantado em 7/Jun/2026 após Victor reportar 3 problemas no card AVALIE.

**Tabela `hub_build_ratings` (Supabase, criada nesta sessão):**
- `id | user_id | build_id | rate_of_fire | mobility | recoil | accuracy | range_rating | rated_at | created_at | server_updated_at`
- 1 row = 1 avaliação salva (snapshot das 5 dimensões + quando). Permite curva de evolução futura.
- Índice `(user_id, build_id, rated_at DESC)`. RLS: `hbr_select/insert/update/delete_own` (auth.uid=user_id) + `hbr_service_all`.
- **Descoberta:** `hub_builds` NÃO tinha coluna de ratings — as notas só viviam em localStorage (`build.userRatings`), nunca chegavam ao banco. A nova tabela é a fonte da verdade.

**Front (bloco de rating no módulo de loadouts):**
- `RATING_KEYS` = rateOfFire/mobility/recoil/accuracy/rangeRating (labels Velocidade/Mobilidade/Recuo/Mira/Alcance).
- **Fix estrelas:** CSS `.bc-star svg { fill: currentColor; stroke: currentColor }` — o `{{i:star}}` não tinha fill, então a cheia só ganhava contorno.
- **Rascunho:** `_ratingDraft[buildId]` em memória; `setDraftStar` re-pinta a linha sem gravar; `getDraft` inicializa do `userRatings` salvo.
- **Salvar:** `saveRating` grava `userRatings` local (via `LevelDB.builds.update`) + chama `cloudSaveRating` (best-effort) que faz POST em `/rest/v1/hub_build_ratings` com token via `window.LEVEL_AUTH.getClient().auth.getSession()`. Sem login: só local.
- **Data:** `formatRatingDate` agora "DD/MM/YYYY - HH:MM"; rodapé `.bc-rating-footer` mostra a última salva + botão `.bc-rating-save-btn` (pulsa com `.dirty`).
- Chave i18n `rating.toast.saved` no CBI18N (PT+EN).

**Pendente:** UI pra VER o histórico (hoje grava mas não exibe a curva) — encaixa no gráfico de progressão (item 2 da secção 5).

---

## 6. ESTADO DE DEPLOY (7/Jun/2026 — v2.12.0 entregue)

- [x] v2.10.0 (`index.html` + Edge `analyze-capture` v7) commitado e deployado — feito 6/Jun
- [x] v2.11.0 (`index.html`) commitado — feito 7/Jun; tabela `cat_glossary` criada direto no Supabase
- [x] v2.12.0 (`index.html`) — tabela `hub_build_ratings` criada no Supabase; commit do index pendente (Victor sobe)
- [x] **8 RLS policies aplicadas** no Supabase (`storage.objects` + `public.user_assets`) — 4/Jun/2026, migration `user_assets_rls_policies`
- [x] **Migration `hub_users_is_admin_flag`** aplicada no Supabase — adiciona `is_admin BOOLEAN DEFAULT false`, marca Victor como admin
- [x] `index.html` (v2.8.0) commitado em 4/Jun/2026
- [x] `index.html` (v2.8.1) commitado em 4/Jun/2026
- [x] **Migration `hub_users_rls_policies`** aplicada em 4/Jun/2026 — destravou `refreshAdminFlag()` (ver secção 8.E)
  - `hub_users_select_own` (authenticated lê próprio row WHERE auth_user_id = auth.uid())
  - `hub_users_update_own` (authenticated atualiza próprio row — reservado pra futuro)
  - `hub_users_all_service` (service_role poder total — documentação)
- [ ] **`index.html` (v2.9.0) commitar** no repo `level-hub`
- [ ] **Este `LEVEL_ESTADO.md` atualizado** — commitar junto

### Sobre esta release (v2.9.0)
**MINOR — três entregas combinadas:**

1. **Codenames admin UI** plugada (item #4 do roadmap totalmente fechado). Edge `admin-cat-codenames` v2 estava ACTIVE há semanas mas sem UI — agora há painel CRUD em Configurações ▸ Operador.
2. **Botão "Sugerir codename"** no modal Salvar Loadout — sorteador por categoria + anti-repetição, preserva sufixo " / xxx" se já existir.
3. **Fix do desalinhamento** do modal Editar Status do Operador (label "Level atual" + `align-items: end`).

Zero mudanças em Edge Functions. Zero migrations adicionais.

### Título do commit
```
feat: codenames admin + sugestor + fix modal Operador (v2.9.0)
```

### Descrição do commit
```
Três entregas combinadas em release MINOR:

1. Painel ADMIN · Codenames em Configurações · Operador
   - Wrap em .opp-admin-only
   - CRUD com filtro por categoria (22 opções no banco)
   - Modal de criar/editar com 10 campos: id, nome, categoria,
     idioma (7 línguas: pt/en/es/it/lat/ja/grego), vibe (texto
     livre), sort_order, is_active, descrição, source, tags (CSV)
   - Apagar global por id (PK simples, sem versão por idioma como
     cat_struggles)
   - Chama Edge admin-cat-codenames v2 (já ACTIVE desde 22/Mai)
   - Catálogo BD tem 125+ codenames em 22 categorias

2. Botão "Sugerir codename" no modal Salvar Loadout
   - Abre modal modal-suggest-codename separado
   - Select de categoria com labels amigáveis + opção "Aleatório"
   - Sorteia da pool ativa (REST/anon, só is_active=true)
   - Anti-repetição: evita repetir o último resultado
   - Resultado renderiza com nome, vibe e meta (categoria + idioma)
   - "Usar este" aplica o nome ao campo save-name preservando o
     sufixo " / xxx" se já estiver digitado

3. Fix do modal Editar Status do Operador
   - Label "Level (no prestige atual)" quebrava em 2 linhas
   - Encurtado para "Level atual (1-55)"
   - Grid 1fr 1fr 1.2fr → 1fr 1fr 1fr (3 colunas iguais)
   - Adicionado align-items: end pra robustez

Hooks no admin de codenames disparam window.LevelCodenames.reload()
após save/delete pra atualizar o pool do sugestor em tempo real
(mesmo padrão do syncUserCatalog da v2.8.1).

LEVEL_ESTADO.md atualizado pra v2.9.0 (secção 5.C nova).
```

### Link direto pra commitar
- `https://github.com/victor-level-hub/level-hub/upload/main`
  - Arrasta `index.html` E `LEVEL_ESTADO.md` da /outputs
  - Cola título + descrição acima
  - Clica **Commit changes**
- Netlify auto-deploya em ~1min. Conferir em `le-vel.games` que o footer mostra v2.9.0.

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

### 8.C · Auditar estado antes de agir (4/Jun/2026)

**Sintoma:** ao começar a tarefa #1 do roadmap (user-assets bucket), o doc dizia "bucket criado 25/Mai, **zero objetos, zero RLS policies** ainda". Plano original era criar bucket, montar Edge, integrar front, criar policies — escopo de várias sessões.

**Causa-raiz:** o doc estava completamente desatualizado. O sistema **já estava em produção há semanas** — bucket com 24 objetos uploaded, Edge `user-asset` v4 ACTIVE, tabela `user_assets` populada, front integrado em `getUserImage`/`setUserImage`/`cloudUploadAsset`. Só faltavam as policies. Outras descobertas paralelas: `admin-cat-struggles` v3 (item #2 do roadmap antigo) e `admin-cat-codenames` v4 (item #4) também ACTIVE. O roadmap inteiro estava reportando trabalho como "a fazer" quando estava 70-90% feito.

**O que aconteceu:** outras sessões de Cráudio (entre as datas do doc anterior e hoje) trabalharam no backend mas não atualizaram o doc. O Victor não viu — confiou na lista de pendências.

**Princípio geral:** ANTES de qualquer tarefa de backend, fazer **levantamento de 5 minutos** com SQL e tool_search:
- `SELECT id, name FROM storage.buckets` — quais existem
- `SELECT bucket_id, count(*) FROM storage.objects GROUP BY bucket_id` — quais têm dados
- `SELECT polname FROM pg_policy WHERE ...` — quais policies existem
- `list_edge_functions(project_id)` — quais Edge estão deployadas e em qual versão
- `list_tables(schemas=[public])` — quais tabelas existem
- `SELECT column_name FROM information_schema.columns WHERE table_name=X` — schema real das tabelas relevantes

**Custo:** ~30s de tempo de execução, 5 queries.
**Benefício:** evita escopo de 5 sessões reduzido a 1 sessão real, evita propor coisas que já existem, evita reescrever Edge Functions que já funcionam, evita criar tabelas que já têm dados. O doc é referência rápida — **não fonte de verdade pra tomada de decisão**. A fonte de verdade é o Supabase + o `index.html` reais.

**Corolário:** se em algum momento o doc disser "X está pendente" e tu desconfiares que X já foi feito, vale 30s de verificação antes de assumir.

### 8.D · Anexo do Hub pode estar atrasado (4/Jun/2026 — v2.8.0)

**Sintoma:** Victor anexou o `index.html` no início da sessão. Trabalhei nele por **várias horas** (refresh admin, painel admin de struggles, modal, JS). No momento de bumpar versão, descobri que o footer dizia **v2.7.5** quando o GitHub estava em **v2.7.7**. O arquivo anexado era uma cópia local antiga do Victor, não a versão real publicada.

**Custo:** todos os patches tiveram de ser refeitos. Validei que não havia conflito (as mudanças da v2.7.6/v2.7.7 não tocavam nos mesmos pontos), baixei o arquivo correto via `curl` agora que o repo virou público, e re-apliquei tudo em cima da base certa.

**Princípio geral:** **NUNCA assumir que o arquivo anexado é a versão real publicada.** A primeira coisa antes de qualquer edição é verificar:

```bash
# Conferir versão real do GitHub (1 segundo)
curl -sL https://raw.githubusercontent.com/victor-level-hub/level-hub/main/index.html | grep "LEVEL · <strong>v"

# Conferir versão do anexo
grep "LEVEL · <strong>v" /mnt/user-data/uploads/index.html
```

Se divergirem, **parar** e pedir o arquivo certo (ou baixar via curl se o repo for público). Trabalhar em cima de versão desatualizada gera retrabalho silencioso — o resultado parece OK no momento mas conflita com a árvore git real.

**Sinais que disparam essa verificação:**
- O `LEVEL_ESTADO.md` aponta versão diferente do footer do `index.html` anexado
- Tu mencionas que "commitou v2.7.X" e o footer do anexo está em v2.7.(X-1) ou anterior
- O arquivo anexado é "antigo" no sentido de timestamp (Drive/sync deu problema)
- Qualquer mismatch entre o que o doc diz e o que o arquivo mostra

**Corolário (auto-aplicado):** este aprendizado é uma instância da própria regra 8.C — auditar a fonte de verdade real (GitHub/Supabase), não confiar em fontes-cache (doc/anexo).

### 8.E · RLS ativada sem policies = bloqueio silencioso (4/Jun/2026 — v2.8.0)

**Sintoma:** Victor commitou v2.8.0 com `refreshAdminFlag()` que deveria ler `hub_users.is_admin` no boot. Console mostrava `cache_role: null`, `isAdmin: false`, `body_classe: ''` — admin nunca era ativado. O `refreshFromDB()` rodava sem erros visíveis e retornava `{role: null, isAdmin: false}`.

**Diagnóstico passo a passo (4 comandos no console):**
1. Comando 1: `LEVEL_AUTH`/client/session/auth.uid — tudo OK
2. Comando 2: query `from('hub_users').select('is_admin').eq('auth_user_id', authUid).maybeSingle()` — retornou `{status: 200, error: null, data: null}` — sem row pra esse auth_user_id
3. SQL via MCP confirmou o row EXISTE no banco: `is_admin = true` para `auth_user_id = '1438a611...'`
4. SQL para policies em `hub_users`: `[]` — **zero policies, mas RLS ativa**

**Causa-raiz:** `hub_users` tinha RLS habilitada desde a configuração inicial mas **nenhuma policy CREATE'd**. PostgreSQL com RLS ativa + zero policies = nega tudo silenciosamente para roles não-bypass (como `authenticated`). Status 200 + `data: null` é o padrão — não é erro, é "linhas filtradas pelo RLS". Edge Functions com `SERVICE_ROLE_KEY` continuavam funcionando porque service_role bypassa RLS — por isso sync-pull/sync-push/user-asset trabalhavam normalmente, escondendo o problema.

**Fix:** migration `hub_users_rls_policies` aplicada — 3 policies (select_own, update_own, all_service). Após aplicar, o `refreshAdminFlag()` no front passou a popular o cache, e o body ganhou a classe `is-admin`, expondo todos os painéis `.opp-admin-only`. Banner "MODO ADMIN ATIVO" apareceu.

**Princípio geral:** ao criar tabela com RLS ativada, **criar pelo menos UMA policy SELECT imediatamente** — mesmo que seja `TO service_role USING (true)` (poder total documentado). Tabela com RLS+zero-policies é uma armadilha porque:
- Não dá erro
- O Hub funciona em geral (porque Edge Functions usam service_role)
- O bug só aparece quando algo do front tenta query direta
- E o sintoma é `data: null` — fácil confundir com "row não existe"

**Checklist pré-CREATE TABLE com RLS:**
1. `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`
2. Imediatamente: `CREATE POLICY ... FOR SELECT TO authenticated USING (...);`
3. Imediatamente: `CREATE POLICY ... FOR ALL TO service_role USING (true);`

**Sinal que dispara essa verificação:** qualquer query do front que retorna `{status: 200, data: null}` quando o row deveria existir. Antes de assumir "row não existe", checar `SELECT polname FROM pg_policy WHERE c.relname=X` direto via service_role.

---

## 9. CATÁLOGOS BO7 (constantes JS no front — sem BD hoje)

> Adicionados nas v2.7.3/v2.7.4. Vivem **só** como constantes no `index.html`. NÃO há tabelas `cat_streaks` / `cat_specialties` / `cat_field_upgrades` / `cat_maps` no Supabase. Migração eventual entra junto com cat_struggles/codenames (roadmap #3/#4), se fizer sentido virar BD.

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
