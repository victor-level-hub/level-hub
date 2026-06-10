# LEVEL · ESTADO DO PROJETO
> Memória estendida do BO7 Tactical Hub. Atualizado a cada marco.
> **Última atualização:** 10 Jun 2026 (noite) — v2.25.0 (variantes simultâneas na Montagem Inteligente, Edge generate-build v3 + arte oficial do Double XP em card de evento). Recorte "variantes" do item 2 fechado.

---

## 0. COMO USAR ESTE DOCUMENTO (handoff de chat)

Ao abrir um chat novo, anexar **sempre**:
1. `index.html` (o estado atual do Hub — sem ele, Claude trabalha de base errada)
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
- Ao orientar UIs de terceiros: **sempre link direto** + passos concretos do que fazer no destino, nunca chutar nomes de botões
- DevTools Chrome: avisar que Chrome bloqueia paste — Victor digita `allow pasting` no console antes de colar
- **Plataforma = LEVEL** (palíndromo). Coach IA dentro do Hub = **Le Vél** (personagem, tom direto/técnico)
- **Frases-marca do Le Vél:** "Operador, próximo passo.", "Analisei. Vamos ao plano.", "Sinto evolução aqui.", "Não recomendo. Te explico por quê."

---

## 2. ESTADO ATUAL DO HUB

**Versão:** `v2.25.0` (SemVer desde v2.0.0)
**Arquivo:** single-file `index.html` (~3,22 MB, ~42.900 linhas, 16 blocos `<script>`)
**Stack:** HTML/CSS/JS inline + Supabase backend
**Deploy:** repo `victor-level-hub/level-hub` (privado) → branch main → auto-deploy Netlify `le-vel-hub` → domínio le-vel.games

### Marcos recentes (Jun 2026)

- **v2.25.0 (10 Jun, noite)** — **VARIANTES SIMULTÂNEAS na Montagem Inteligente + arte oficial do Double XP.** (1) Seletor novo no wizard (1 · 2 · 3) dispara **2-3 gerações em PARALELO** (`Promise.all`), cada uma com um ângulo: **VELOCIDADE** (mobilidade/manuseio máximos) · **EQUILÍBRIO** (melhor trade-off) · **CONTROLE** (precisão sem deixar de ser rush). Latência ≈ 1 geração (35,9s pras 3 no teste real, não 90s); falha de 1 variante não derruba as outras (retry individual por aba). Resultado: **comparativo de stats determinístico** (do catálogo, zero custo de IA, top 8 stats × N colunas coloridas) + uma aba por variante com card completo + Salvar individual; codenames duplicados ganham sufixo (II/III). Refatoração interna: `buildSbPayload()` extraída, `buildResultHtml()` reusada pelo single e pelo multi, `saveGeneratedBuild(build)` parametrizada. Constante `VARIANT_ANGLES` (labels + directives PT/EN). Modal 680→760px. (2) **Edge `generate-build` v3** (retrocompatível, `verify_jwt: true`): campo opcional `variant_angle {id,label,directive}` sanitizado + **regra R13** (o ângulo manda nos desempates de trade-off e no campo semântico do codename; intro diz quando escolher cada leitura; sem o campo = comportamento v2). Teste produção AK-27 P1·L19 CQB: RAIO/ANDES/ORION, dropped 0/0 nas três, 7-10 attachments diferentes entre pares, Dexterity nas 3 (struggle do flinch cruzada). (3) **Double XP com a arte oficial** (pôster enviado pelo operador): saiu do banner largo de Destaques → **card padrão de evento** na grade Eventos · Temporada Atual (formato Nuked/Illicit), arte WebP base64 21 KB com brilho 1.45/contraste 1.12 (pôster muito escuro pro crop pequeno) e `background-position: center 32%` (rosto). Seção Destaques removida do Painel Hoje (CSS `dxp-card` preservado pra futuro destaque); chave `hoje.highlights` órfã inofensiva.
- **v2.24.0 (10 Jun)** — **Painel Hoje em 3 seções + mapa na Montagem Inteligente.** (1) Painel Hoje reestruturado em 3 seções nomeadas: **Destaques** (Double XP em banner largo com arte oficial S04 embutida WebP base64, padrão Catalyst Collection) → **Eventos · Temporada Atual** (Nuked + Illicit) → **Lançamentos** (MW4, grid dinâmico renomeado e movido pro fim). (2) Modal de novidades: botão Entendido movido pra direita com respiro. (3) **4ª pergunta opcional de mapa** no wizard Montagem Inteligente (dropdown dos 6v6 do catálogo + "Qualquer mapa" default, só em MP) → `map:{name,desc}` no payload → **Edge `generate-build` v2** com regra R8 (mapa REFINA o foco, não substitui; cita mapa pelo nome no intro e slots decisivos). Badge do mapa no resultado. Teste server-side: intro cita Nuked, Barrel+Muzzle justificam pelo mapa, dropped 0/0, 31s. Fundação do Pre-Match Advisor.
- **v2.23.0 (10 Jun)** — **Painel Hoje reorganizado + modal de novidades.** Ordem nova: EVENTOS NO AR + EVENTOS · TEMPORADA ATUAL juntos no topo; card "O QUE MUDOU" no final; bloco de status pessoal (4 tips) REMOVIDO por ora (CSS preservado pra eventual volta). Modal `modal-whats-new` (560px) abre 1× após o login a cada versão nova — lê o vX.Y.Z do próprio card de changelog (sem constante nova). Checkboxes: silenciar esta versão (padrão) / silenciar futuras (discreto). Fechar sem marcar = volta no próximo boot. Persistência: localStorage `level.wn.*` + `hub_users.prefs.whatsnew` (coluna `prefs jsonb` já existia; sync-push v6 já aceitava `prefs` — ZERO migração/deploy; snapshot do pushAll ganhou o campo, pullAll aplica de volta).
- **v2.22.2 (10 Jun)** — Fixes na NOSSA ANÁLISE (reportados pelo operador com prints): (1) **X do modal de re-análise confirmava em vez de cancelar** — `LevelModal.confirm` agora resolve `null` no dismiss (X/overlay/Esc), distinto do `false` do Cancelar; demais call sites usam `if(await confirm(...))` → null falsy = zero regressão; fluxo de re-análise aborta no null. (2) **Contraponto "Em troca:" fatiado pelo flexbox** — ícone+strong+texto eram 3 flex items; agora `<span>` único envolve rótulo+frase.
- **v2.22.1 (9 Jun)** — Toolbar de Minhas Armas reorganizada: 5 botões → **3 elementos com hierarquia** (Montagem Inteligente em destaque · **Importar Build ▾** dropdown agrupando Print/Celular/Texto, IDs originais preservados dentro do menu · + Adicionar Arma). Varredura i18n do fluxo de captura: Capturar via Celular e + Adicionar Arma (nunca tinham chave), linha de stats e modal Armas Detectadas (título/intro/empty/Cancelar) agora trocam de idioma. Menu alinhado pela direita (não estoura viewport). **Artes oficiais embutidas** nos cards de Eventos (Nuked + Illicit Cargo + banner BLACKCELL + operador Catalyst, WebP base64 ~190 KB, fonte: blog callofduty.com — Double XP fica com o ícone SVG, não tem arte oficial) + fix de entidades cruas (&quot;Catalyst&quot;, &amp;).
- **v2.22.0 (9 Jun)** — **MONTAGEM INTELIGENTE + CAPTURAR VIA TEXTO** em Minhas Armas. 2 Edge Functions novas (`generate-build` v1, `parse-build-text` v1, ambas `verify_jwt: true`, Gemini 2.5 Flash, schema fechado, instrumentadas em `ana_gemini_usage`), 2 botões novos (ordem final: Importar via Print · Capturar via Celular · Capturar via Texto · Montagem Inteligente · + Adicionar Arma), wizard de 3 perguntas + 3 modos (gerar/refinar/counter), render com justificativa por slot + stats agregados + PUT recommendation + comparação, ponte `window.LevelCaptureBridge` reusando o fluxo de aprovação da captura, ícone novo `gear-star` no catálogo LUCIDE. Gabaritos URAL e VOLGA validados 8/8.
- **v2.21.0 (9 Jun)** — Bloco **EVENTOS · TEMPORADA ATUAL** no Painel Hoje. 3 cards (Nuked, Illicit Cargo, Double XP) + card Battle Pass Season 4 BLACKCELL + card Catalyst Collection. Tudo em SVG inline + gradientes, sem imagens externas. 33 chaves i18n novas (PT + EN).
- **v2.20.1 (9 Jun)** — Reorganização da seção CONTROLLER alinhada à UI do BO7. Zonas Mortas movidas de AIMING → CONTROLLER. Contadores: CONTROLLER 11→17, AIMING 15→9.
- **v2.20.0 (8 Jun)** — Contraponto nas sugestões de troca da NOSSA ANÁLISE + fix de entidades HTML no headline do changelog.
- **v2.19.0 (8 Jun)** — Le Vél mais empático: trata pelo nome, usa weapon_rating, convida pra Evolução. Edge `analyze-build` v4.
- **v2.18.0 (8 Jun)** — Fix do "destrocar" infinito na NOSSA ANÁLISE (guarda de convergência por margem fixa).

### Identidade visual (FECHADA no marco v2.6.x)

- **Logo LEVEL própria** em SVG embutido (viewBox 0 0 706 178): palavra em estilo angular, corpo **laranja `#FF9800`**, detalhes internos em **azul-claro `#AEC7E0`**, triângulo laranja no topo entre o E e o V, e **recorte triangular vazado** no 2º E (cunha — deixa ver o fundo)
- **Posições das marcas:** sidebar = LEVEL · header = CoD BO7 · login = LEVEL
- **Paleta de fundo:** `--bg-darkest: #141a2b`, `--bg-dark: #1a2238`, `--bg-panel: #1f283f`, `--bg-row: #25304f`, `--bg-row-hover: #303d5f`
- **Sem efeito scanline**

### Subtabs do Controller (pós v2.20.1)

- **CONTROLLER (17 settings):** Input Device (2), Inputs (7), Controle (2: Vibration + Trigger Effect), Zonas Mortas (6: Left/Right Stick Min/Max + L2/R2)
- **AIMING (9):** Sensitivity Multipliers (4), Look (1), Aiming Advanced (1: Aim Response Curve), Aim Assist (2), Motion Sensor (1)
- **MOVEMENT (14):** Intelligent Movement + Movement Behaviors
- **COMBAT (9):** Combat Behaviors
- **VÍDEO & REDE (15):** PS5 + BO7 in-game + TV + Rede

---

## 3. AUTH & BACKEND (Path B — fechado 1/Jun/2026)

- Auth email+senha ativo, Confirm email OFF, 18+ universal
- Victor: `auth.uid = 1438a611`, `hub_users.id = 3fa59ebd`
- Edge Functions migradas p/ `auth.uid` + `verify_jwt: true`: `sync-push v6`, `user-asset v4`, `sync-pull v6`
- **Edge Functions de IA (todas Gemini 2.5 Flash + `ana_gemini_usage`):** `analyze-build` v4 (deploy v6, `verify_jwt: false` — front manda anon key), `analyze-capture` v7, **`generate-build` v3 (10 Jun: v2 = mapa R8, v3 = variant_angle R13; `verify_jwt: true`)**, **`parse-build-text` v1 (NOVO 9 Jun, `verify_jwt: true`)**, `admin-cat-struggles` v3, `admin-cat-glossary`
- Hub: `pushAll`/`pullAll`/`_cloudHeaders` mandam token JWT
- 25 armas + perfil migrados para auth.uid
- `cat_attachments` = **1102 rows**, 25 armas (23 weapon_ids distintos; **AK-27 = `weapon_id: 'ak'`**), fonte codmunity — **NÃO MEXER**. Tem `unlock_level`, `is_prestige`, `prestige_level` e `meta.stats` por attachment.
- `cat_struggles` = **22 rows** (11 dificuldades × PT+EN), admin UI no ar desde v2.8.x
- `user-assets` bucket existe, RLS policies pendentes
- Supabase: conta GitHub `victor-abap-pt`, projeto `bo7-tactical-hub` (ref `cqkhqtgmolmrfgzozocr`, sa-east-1)
- Captura mobile: tabela `capture_sessions`, bucket `capture-photos`, Edge Functions Deno
- Gemini 2.5 Flash (Vision API); Avatar: Nano Banana 2

---

## 4. PERFIL DO JOGADOR (gameplay sempre ativo)

- PS5, estilo **rusher agressivo CQB**. Marksman rifles vetadas.
- Controller: MP normal (não CDL), +aim assist, +agressividade; **ADS Multiplier 0.85**
- **Dexterity perk = prioridade máxima** (combate flinch)
- Áudio: mix **Headphones**
- Prestige atual: Level 54 (BLACKCELL Season 4, 60% complete, 44 dias restantes)
- Arma principal: **Sturmwolf 45** (Weapon Prestige 2, build CICADA 3301-45). Loadout ativo: Voyak KT-3 (AR, Warzone Long Range) + Hawker HX (sniper suporte, build ANTARES). **AK-27 em P1·L19** (builds URAL + VOLGA desenhadas 9 Jun)
- Perks Warzone ativos: Surveyor (Slot 1), Quick Fix (Slot 2), Survivor (Slot 3)
- Arsenal: 25 armas cadastradas
- **Performance recente (9 Jun):** 3 partidas top 3 consecutivas com config de stick INVERTIDA (Left Min 70 em vez de 0). Sinal forte de aim/posicionamento/leitura carregando — quando corrigir o movimento, escala mais.
- **Slide/Dive Behavior (9 Jun, noite):** Victor mudou pra Hybrid pelo checklist mas o segurar-pra-mergulhar disparava sem querer no R3 — orientado a voltar pra **Tap to Slide**. Re-treinar Hybrid de propósito mais tarde, em bots.

---

## 5. CONFIGURAÇÕES DO STICK — REFERÊNCIA RÁPIDA (pra responder dúvidas do Victor)

**Sensibilidade base:** Horizontal 1.80 / Vertical 1.80
**ADS Multiplier:** Low 0.85 · Mid 2x-3x 0.85 · High Zoom 1.00 · Transition Instant
**Resposta de mira:** Aim Response Curve Dynamic · Look Inversion Standard
**Zonas Mortas:** Left Min 0 / Left Max 70 · Right Min 1 / Right Max 99 · L2 Deadzone 0 / R2 Deadzone 0
**Layout:** Stick Layout Preset Tactical (crouch/prone no L3 — habilita dropshot)

**Erro do Victor descoberto em 9 Jun:** estava com Left Min 70 / Left Max 80 no jogo (config invertida). Recomendação correta = Min 0 / Max 70.

---

## 6. CONFIGURAÇÕES NÃO-ALINHADAS (CHECKLIST DO VICTOR no jogo)

Levantamento de 9 Jun 2026 a partir dos 17 prints do menu Settings do BO7.

### Alta prioridade — impacto direto no rush

| Setting | Valor atual (print) | Recomendação | Por quê |
|---|---|---|---|
| Sprint Assist | Off | **On** | Auto-sprint reduz fadiga, mantém fluxo do rush sem double-tap |
| Mantle Assist | Off | **On** (ou Low Mantle Assist) | Transpor obstáculos sem apertar Jump = meio segundo a mais de pressão no inimigo |
| Slide/Dive Behavior | Hybrid (revertendo) | **Tap to Slide** (decisão 9 Jun à noite) | Hybrid disparava mergulho acidental no R3; voltar ao Tap to Slide. Re-treinar Hybrid em bots quando quiser o dive de emergência |
| Left Stick Min | 70 ⚠️ | **0** | Sem deadzone, resposta imediata do primeiro milímetro de input |
| Left Stick Max | 80 ⚠️ | **70** | Atinge velocidade máxima antes do fim do curso, aproveita rotational aim assist |

### Média prioridade — otimização fina

| Setting | Valor atual (print) | Recomendação | Por quê |
|---|---|---|---|
| ADS Sens Multiplier (High Zoom) | 0.85 | **1.00** | Em zoom alto o próprio zoom já reduz movimento; 0.85 fica lento em mid-long range |

### Não-crítico (estilo / preferência)

- Sprint/Tactical Sprint Behavior: Toggle (atual) vs Hold — testar qual prefere
- Motion Sensor Function: tudo Off — irrelevante pq Victor não usa motion aiming

---

## 7. PRÓXIMAS PENDÊNCIAS (roadmap por prioridade)

> Lista para abrir o próximo chat. Montagem Inteligente + Capturar via Texto **ENTREGUES na v2.22.0** — saíram do topo.

1. ~~★★★ Análise de build com veredito~~ — **FECHADO 10 Jun 2026.** Teste server-side com payload real (perfil Victor + URAL + struggle "atiro primeiro mas morro"): o veredito v4 cruza nome + estilo + weapon_rating + struggle, separa corretamente problema de arma vs perk/config (Dexterity + ADS 0.85), sugestões válidas com dropped 0/0. Nenhuma mudança necessária. Detalhe na seção 8.A.
2. **★★ V2 da Montagem Inteligente:** recortes MAPA (v2.24, Edge v2 R8) e **VARIANTES SIMULTÂNEAS (v2.25, Edge v3 R13) FEITOS**. Restantes: plano de progressão até a build ideal, loadout completo Primary+Secondary, histórico de gerações com feedback. **Loadout Codes: decodificação INVIÁVEL** (encoding fechado da Activision, 14 chars, sem decoder público) — plano B: parser RECONHECE o código no texto e salva como metadado (caderno de códigos).
3. **★★ E-mail de eventos (NOVO — mini-projeto de backend):** enviar e-mail ao usuário 2h ANTES de um evento começar e 12h ANTES de acabar. Pré-requisitos que ainda não existem: (a) e-mails dos usuários (hub_users não guarda email; auth guarda, mas não há tabela de datas de eventos no banco — datas hoje hardcoded no HTML); (b) serviço de envio (Resend ou SendGrid — conta + chave + custo); (c) agendador 24/7 (cron job Supabase) que checa horários e dispara. Fazer em sessão dedicada, depois de decidir o provedor de e-mail.
3. **★ Reorganização completa do Controller (Fase 2: AIMING, depois MOVEMENT, COMBAT, MOTION SENSOR)** — ~30 settings faltantes dos 17 prints. Trabalho de 3-4 sessões dedicadas. (Detalhe completo na versão anterior deste doc / nos prints.)
4. **user-assets bucket** — migrar imagens localStorage→Supabase Storage (paths por auth.uid). RLS policies pendentes. Migração de capturas mobile (QR → auth.uid) pendente.
5. **UI Codenames** (admin + botão "Sugerir Codename" em build/loadout). A `generate-build` já devolve `codename_suggestion` — aproveitar.
6. **Avatar IA Nano Banana 2**
7. **PRE-MATCH ADVISOR** (futuro grande) — casa com a V2 "pra mapa específico".
8. **Marketplace** + **i18n EN** (Loadout/Meus Loadouts) — menor prioridade
9. **Atualização dos dados de Eventos** a cada Season — números hardcoded; regenerar a cada mid-season/Reloaded.

---

## 8.A · Análise de build com veredito — CONFIRMADA (10 Jun 2026)

- v2.18.0 + v2.19.0 resolveram estilo fixo + veredito acionável; front envia `active_struggles` + `weapon_rating` + `player_profile`.
- **Teste de produção 10 Jun (server-side, payload Victor + URAL + struggle "atiro primeiro mas morro"):** summary abriu pelo nome, validou a build, confrontou com rusher CQB, citou a nota 3 de mobilidade, citou a struggle textualmente e concluiu que flinch/ADS não se resolvem com attachment (Dexterity + ADS Multiplier) — veredito modo (b) com 2 trocas válidas (Prism Light Barrel ← Bystro, Respire Handstop ← Lateral Precision), `dropped 0/0`, 14,7s.
- **Status: nenhuma mudança de código ou prompt necessária.** Único pré-requisito prático: o cruzamento só aparece se houver struggles cadastradas na Evolução — sem elas, o Le Vél convida a registrar (R-EVOLUÇÃO).

---

## 8.B · MONTAGEM INTELIGENTE + CAPTURAR VIA TEXTO — ENTREGUE (v2.22.0)

### O que está no ar

**Botões (ordem final):** Importar via Print · Capturar via Celular · Capturar via Texto · Montagem Inteligente · + Adicionar Arma. Montagem Inteligente em laranja LEVEL com ícone `gear-star` (novo no catálogo LUCIDE inline). Mobile: flex-wrap (menu sanduíche ficou pra V2).

**Capturar via Texto:** modal textarea → Edge `parse-build-text` v1 → resultado convertido pro formato `vision_result` → **mesmo fluxo de aprovação da captura via celular** via ponte nova `window.LevelCaptureBridge = { openApproval, importData }` (exposta no module script da captura). Card de revisão com matching, dropdown de arma, importação pro Construtor. Zero UI duplicada.

**Montagem Inteligente:** wizard 3 perguntas (arma com memória `level.sb.lastWeapon` · foco default CQB · MP/Warzone) + modos gerar/refinar/counter → Edge `generate-build` v1 → render: codename, intro Le Vél, slots com justificativa + nível, stats agregados (somados no front de `meta.stats` do catálogo), perks chips, PUT recommendation, comparação. Ações: Salvar (Construtor pré-preenchido via bridge), Regenerar variante (manda codename anterior em `existing_builds`), Descartar.

### Edge Functions (arquitetura)

- **`generate-build` v1** (`verify_jwt: true`): payload = player_profile + weapon{id,level,prestige} + focus + game_mode + mode + counter_situation + existing_build(s) + active_struggles + used_puts + max_slots(8) + perks_pool + language. **Server busca `cat_attachments` como fonte de verdade**, divide em available/locked por `unlock_level` vs level + `is_prestige` vs Weapon Prestige + PUTs. Valida pós-IA por allow-list: slot inventado descartado, slot duplicado descartado, PUT recommendation só de locked, perks só do pool. Devolve slots com `attachment_id` + `stats` do catálogo.
- **`parse-build-text` v1** (`verify_jwt: true`): payload = text (máx 20k chars) + weapons[] (arsenal) + language. Gemini extrai (temp 0.1) → server matcheia cada attachment contra `cat_attachments` do weapon_id: exato→ok (nome canônico+slot corrigido), parcial único→ok, 2+→ambiguous+candidates, 0→unrecognized. Attachment vetado/rejeitado no texto fica de fora (regra de prompt). "X ou Y" no mesmo slot entra 2×.
- Ambas com retry (429/5xx), `friendlyError`, custo estimado e latência em `ana_gemini_usage`.

### Validação (9 Jun)

- **URAL** (tabela com armadilhas): 8/8 ok, Battle-Scar vetado excluído, FANG HoverPoint (inexistente no catálogo) marcada unrecognized, perks extraídos, confidence high.
- **VOLGA** (frase corrida informal, "cano 14 Prism Light", "ak-27" minúsculo): 8/8 ok, EMT3 Compensator desambiguado do Ported-70, ECS reconhecido como Prestige, confidence high, ~6s.
- **generate-build** (AK-27 P1·L19, CQB, 8 slots): build "BLITZ", dropped=0, 22 available/28 locked, PUT recommendation válida (Prodigal Skeleton Stock L26), comparação com URAL, ~22s.

### Gabaritos de referência (qualidade-alvo)

**URAL** (balanceada CQB-mid): LTI Reflex ou FANG HoverPoint ELO (Optic) · SWF Tishina-11 (Muzzle) · 17" Bystro Speed Barrel · Lateral Precision Grip · Epitaph Extended Mag · Caliban Light Stock · Lithe Thin Grip · Buffer Spring (Fire Mods). Perks: Lightweight + Dexterity + Tac Sprinter.
**VOLGA** (CQB pura): LTI Reflex · EMT3 Compensator · 14" Prism Light Barrel · Respire Handstop · Epitaph Extended Mag · Caliban Light Stock · Lithe Thin Grip · Enhanced Cycle System (Prestige; o EMT3 neutraliza o +24% vertical do ECS).
Decisões de coaching: Battle-Scar Conversion vetado (nerf Jan/26); ECS vetado na URAL; LTI obrigatória na VOLGA.

---

## 9. CHECKLIST PÓS-DEPLOY (v2.25.0)

> Confirmar ANTES de considerar o marco 100% no ar.

- [x] Edge `generate-build` v3 deployada via MCP (variant_angle R13, retrocompatível) e testada server-side em produção (3 ângulos em paralelo, 35,9s, dropped 0/0)
- [x] Validações do arquivo: node --check 16/16 blocos · html5lib 1 `<main>` + 13 sections · screenshots Playwright (grade de eventos desktop/mobile + modal de variantes com troca de aba, zero erros de console)
- [ ] Itens do checklist v2.24.0 ainda pendentes (commit v2.24 foi feito? conferir o footer de le-vel.games antes — se ainda mostra v2.23, o commit desta v2.25.0 cobre tudo de uma vez)
- [ ] **Commitar** o `index.html` (v2.25.0) no repo `level-hub`, branch main (textos do commit no fim da sessão)
- [ ] Confirmar no **Netlify** (app.netlify.com) que o build `le-vel-hub` passou e publicou
- [ ] Abrir **le-vel.games** e verificar:
  - [ ] Footer mostra **LEVEL v2.25.0**
  - [ ] **Painel Hoje**: a seção Destaques sumiu; a grade Eventos · Temporada Atual tem 3 cards — Nuked · Illicit Cargo · **Double XP com a arte oficial** (rosto do operador visível no topo do card)
  - [ ] **Montagem Inteligente**: pergunta nova "Variantes" (1 · 2 · 3) acima do botão Gerar; escolher 2 ou 3 mostra o hint com os ângulos
  - [ ] Gerar **3 variantes** da AK-27 (CQB, MP) → status mostra progresso (1/3, 2/3...), resultado abre com comparativo de stats + 3 abas (ângulo + codename), trocar de aba funciona
  - [ ] **Salvar esta build** numa aba → Construtor abre pré-preenchido com o codename daquela variante
  - [ ] **Variantes: 1** → fluxo antigo intacto (card único com Salvar/Regenerar/Descartar)
  - [ ] Em EN: pergunta "Variants", ângulos SPEED/BALANCED/CONTROL, comparativo "Stats comparison"
- [ ] Testar no **mobile** — comparativo de stats com scroll horizontal, abas empilham sem estourar

---

## 10. WORKFLOW & PADRÕES TÉCNICOS

- Edições sempre via Python `read → str_replace → write` em `/home/claude/hub.html`, **nunca** edição manual de linhas
- `str_replace` Python com `assert count == 1` antes de cada substituição
- Validação após cada alteração: `node --check` em **todos** os blocos `<script>` (extração via regex) + html5lib parse + conferir seções dentro de `<main>`
- Para mudanças visuais grandes: renderizar com Playwright (chromium headless; instalar com `--with-deps`) e inspecionar screenshot ANTES de entregar. O Hub tem gate de login — pra inspecionar componentes novos, extrair CSS + trechos pra página de teste isolada.
- Output final: `/mnt/user-data/outputs/index.html`; Victor commita no GitHub
- **NUNCA** sugerir Google Drive ou Files do Projeto (Victor parou 31 Mai 2026)
- Versionamento SemVer: PATCH=bugfix/visual, MINOR=feature, MAJOR=quebra
- A cada entrega: bumpar versão + footer (`LEVEL vX.Y.Z`) + bloco "O QUE MUDOU NESTA VERSÃO" (topo do Painel Hoje) + entrada no Histórico de Versões (`vh-entry` no topo da `vh-list`)
- Mudança de frontend que afete schema → backend Supabase na mesma sessão
- **Deploy de Edge Functions via Supabase MCP** (`deploy_edge_function`) funciona direto com `files: [{name: 'index.ts', content}]` — sem precisar de deno.json pra imports via URL esm.sh

### Bugs estruturais documentados

- **Inserção de `vh-entry` via `str_replace`** tem risco de consumir o `<div class="vh-entry">` da próxima entry → sempre validar com html5lib + seções dentro de `<main>` após cada inserção. (v2.22.0: inserção limpa, zero problemas.)
- **Escapes em strings JS injetadas via Python:** o LUCIDE map usa `\"` (barra+aspa) dentro das strings — em Python string normal isso é `'\\"'`. Errar a contagem de barras quebra o parse do script inteiro. **Nunca** corrigir com replace global de sequências de escape (corrompe strings legítimas como `"14.5\\\" VAS"`); refazer a injeção do zero com o escape certo.
- **Assertions prematuras** podem falhar se o teste for feito antes da renomeação dos i18n keys. Ordenar: 1) remover/mover HTML, 2) renomear i18n, 3) só depois assertar ausências.
- **Memória vs realidade do Hub:** sempre conferir o footer/changelog do arquivo anexado + comparar com le-vel.games publicado antes de planejar bump.

### Fontes de dados do jogo

- **codmunity.gg**: fonte primária de attachments
- **game8.co**: não funciona com `get_page_text` — usar `web_fetch` com URLs archive.org
- **callofduty.com/blog/blackops7**: fonte oficial pra Seasons, Events, BP
- **gamespot.com / dotesports.com / boostmatch.gg**: fontes confiáveis pra eventos e recompensas

### Links diretos (sempre incluir ao orientar)

- Netlify: app.netlify.com · Supabase: supabase.com/dashboard · GitHub: github.com/victor-level-hub/level-hub · Cloudflare: dash.cloudflare.com

---

## 11. MONETIZAÇÃO (decidido 18 Mai 2026)

- **FREE:** regras determinísticas, até 5 loadouts
- **PLUS R$19,90/mês:** IA conversacional, Vision API, coaching, loadouts ilimitados, sync, "Falar com Le Vél"
- **PRO R$49,90/mês:** replay analysis, coach session, meta builds, comunidade
- **Founder vitalício:** 100 primeiros Plus / 50 primeiros Pro — preço travado, badge permanente
- BYOK descartado (fricção mata conversão); backend centralizado para Plus

---

## 12. APRENDIZADOS RECENTES

### Sessão 10 Jun 2026 (noite — v2.25.0, variantes simultâneas)

- **Paralelas com ângulos > 1 chamada gigante:** pra N variantes, N chamadas paralelas com `variant_angle` pré-definido ganham em latência (≈1 geração), resiliência (falha isolada + retry individual) e diversidade POR DESIGN (o ângulo manda nos desempates — não depende da sorte do modelo). Comparação textual entre variantes não é necessária: o comparativo de stats é determinístico no front e cada intro já diz quando escolher aquela leitura.
- **Retrocompatibilidade em Edge compartilhada:** campo novo OPCIONAL + regra de prompt condicional ("sem X, ignora esta regra") = zero janela de quebra entre o deploy da Edge e o deploy do front no Netlify.
- **Conferir a versão REAL da Edge antes de planejar:** `get_edge_function` via MCP mostra `version` e o código no ar — a memória da sessão pode divergir do servidor; o servidor é a verdade.
- **Key art escura em crop pequeno:** pôster vertical escuro não funciona em card de 130px sem tratamento — brilho 1.45 + contraste 1.12 no pre-processing resolve sem trair o tom; `background-position` ajustado pelo screenshot, não pelo chute (1ª tentativa 18% pegou teto escuro; 32% achou o rosto).
- **Campos semânticos distintos por ângulo** (relâmpagos/rios/pedras) evitam colisão de codename entre chamadas paralelas que não se conhecem; sufixo II/III no front cobre o caso raro.

### Sessão 10 Jun 2026 (manhã — v2.22.2 + fechamento item 1)

- **Dismiss ≠ Cancel em modais de 2 ações:** quando o caminho "cancel" de um confirm É uma ação (ex: "Re-analisar assim mesmo"), o X/overlay/Esc precisam de um 3º estado (`null` = abortar). Padrão adotado: `confirm` resolve `true`/`false`/`null`; call sites booleanos tratam null como falsy sem regressão.
- **Flex fatia filhos soltos:** num container `display:flex`, ícone + `<strong>` + text node viram 3 colunas independentes. Conteúdo textual misto sempre dentro de um `<span>` único.
- **Validar Edge Function por teste server-side** (curl com payload realista) fecha itens de roadmap sem depender de teste manual no Hub — o item 1 fechou assim.

### Sessão 9 Jun 2026 (noite — marco v2.22.0)

- **Reuso > UI nova:** o Capturar via Texto NÃO ganhou tela própria de revisão — converteu o output do parser pro formato `vision_result` e reusa o card de aprovação da captura via celular inteiro (matching, dropdown, importação pro Construtor). Uma ponte de 4 linhas (`window.LevelCaptureBridge`) destravou tudo.
- **Server como fonte de verdade do catálogo:** a `generate-build` busca `cat_attachments` no banco em vez de confiar no payload — anti-alucinação fica no servidor e o front não consegue ser enganado por catálogo desatualizado.
- **Parser tolerante compensa:** matching em 3 camadas (exato fuzzy → parcial → palavras-chave) pegou "cano 14 Prism Light" → `14" Prism Light Barrel`. Status `ambiguous` com candidates[] entrega o dropdown de correção sem inventar nada.
- **Gabarito como teste de regressão:** URAL/VOLGA viram a suíte permanente — qualquer mudança futura no parser deve continuar passando os dois 8/8.
- **R3 mergulhando = Slide/Dive Hybrid**, não Button Layout. Com Stick Layout Tactical, o clique do analógico vira agachar/deslizar/mergulhar; no Hybrid, segurar = mergulho. Toque seco resolve, mas se atrapalha o instinto, Tap to Slide sem culpa.
- **Strafe shooting / jiggle strafe:** o vai-e-vem atirando dos oponentes = stock leve + omnimovement + ritmo irregular no analógico. Victor já tem a base (Caliban Light Stock, Lightweight, Left Stick Max 70).

### Sessão 9 Jun 2026 (tarde — v2.20/v2.21)

- **Identidade visual do jogo vs Hub:** prints valem mais que palavras. Pedir prints antes de propor reorganização grande.
- **Memória vs realidade:** o arquivo anexado é a verdade. Conferir footer sempre.
- **Min/Max do stick:** ao recomendar config, sempre dar Min E Max explicitamente na mesma frase.
- **Eventos da Season são dados perecíveis** — regenerar a cada Reloaded/Season.
- **SVG inline > imagens externas** pra cards de eventos — exceção da casa: arte oficial pode entrar EMBUTIDA em WebP base64 (nunca link de CDN). Fonte das key arts: a própria página da season em callofduty.com/blog/blackops7/season-04 (grep nos paths `/content/dam/.../events/*.webp` do HTML).

---

*LEVEL · BO7 Tactical Hub — documento de estado. Regenerar ao fim de cada marco.*
