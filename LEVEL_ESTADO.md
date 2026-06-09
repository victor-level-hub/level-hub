# LEVEL · ESTADO DO PROJETO
> Memória estendida do BO7 Tactical Hub. Atualizado a cada marco.
> **Última atualização:** 9 Jun 2026 — fecho do marco v2.21.0 + planejamento Montagem Inteligente & Capturar via Texto (nomenclatura final dos botões decidida) + gabaritos URAL/VOLGA

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

**Versão:** `v2.21.0` (SemVer desde v2.0.0)
**Arquivo:** single-file `index.html` (~2,87 MB, ~40.800 linhas)
**Stack:** HTML/CSS/JS inline + Supabase backend
**Deploy:** repo `victor-level-hub/level-hub` (privado) → branch main → auto-deploy Netlify `le-vel-hub` → domínio le-vel.games

### Marcos recentes (Jun 2026)

- **v2.21.0 (9 Jun)** — Bloco **EVENTOS · TEMPORADA ATUAL** no Painel Hoje. 3 cards (Nuked, Illicit Cargo, Double XP) + card Battle Pass Season 4 BLACKCELL + card Catalyst Collection. Tudo em SVG inline + gradientes, sem imagens externas. 33 chaves i18n novas (PT + EN). Cores temáticas por evento (verde radioativo, laranja-cobre, laranja LEVEL, dourado BLACKCELL).
- **v2.20.1 (9 Jun)** — Reorganização da seção CONTROLLER alinhada à UI do BO7. Zonas Mortas (Left/Right Min/Max + L2/R2) movidas de AIMING → CONTROLLER, unificadas num único bloco. Grupo "Feedback do Controle" → "Controle" (EN: "Controller"). Contadores: CONTROLLER 11→17, AIMING 15→9.
- **v2.20.0 (8 Jun)** — Contraponto nas sugestões de troca da NOSSA ANÁLISE (mostra o que cada troca custa) + fix de entidades HTML cruas no headline do changelog.
- **v2.19.0 (8 Jun)** — Le Vél mais empático: trata pelo nome, usa weapon_rating do operador, convida pra Evolução. Edge Function `analyze-build` v4.
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
- Hub: `pushAll`/`pullAll`/`_cloudHeaders` mandam token JWT
- 25 armas + perfil migrados para auth.uid
- `cat_attachments` = **1102 rows**, 25 armas, fonte codmunity — **NÃO MEXER**
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
- Arma principal: **Sturmwolf 45** (Weapon Prestige 2, build CICADA 3301-45). Loadout ativo: Voyak KT-3 (AR, Warzone Long Range) + Hawker HX (sniper suporte, build ANTARES)
- Perks Warzone ativos: Surveyor (Slot 1), Quick Fix (Slot 2), Survivor (Slot 3)
- Arsenal: 25 armas cadastradas
- **Performance recente (9 Jun):** 3 partidas top 3 consecutivas com config de stick INVERTIDA (Left Min 70 em vez de 0). Sinal forte de aim/posicionamento/leitura carregando — quando corrigir o movimento, escala mais.

---

## 5. CONFIGURAÇÕES DO STICK — REFERÊNCIA RÁPIDA (pra responder dúvidas do Victor)

**Sensibilidade base:** Horizontal 1.80 / Vertical 1.80
**ADS Multiplier:** Low 0.85 · Mid 2x-3x 0.85 · High Zoom 1.00 · Transition Instant
**Resposta de mira:** Aim Response Curve Dynamic · Look Inversion Standard
**Zonas Mortas:** Left Min 0 / Left Max 70 · Right Min 1 / Right Max 99 · L2 Deadzone 0 / R2 Deadzone 0
**Layout:** Stick Layout Preset Tactical (crouch/prone no L3 — habilita dropshot)

**Erro do Victor descoberto em 9 Jun:** estava com Left Min 70 / Left Max 80 no jogo (config invertida). Recomendação correta = Min 0 / Max 70. Vê seção 9 abaixo.

---

## 6. CONFIGURAÇÕES NÃO-ALINHADAS (CHECKLIST DO VICTOR no jogo)

Levantamento de 9 Jun 2026 a partir dos 17 prints do menu Settings do BO7. Itens que o Victor pode ajustar pra alinhar com as recomendações do Hub / com o estilo rusher CQB.

### Alta prioridade — impacto direto no rush

| Setting | Valor atual (print) | Recomendação | Por quê |
|---|---|---|---|
| Sprint Assist | Off | **On** | Auto-sprint reduz fadiga, mantém fluxo do rush sem double-tap |
| Mantle Assist | Off | **On** (ou Low Mantle Assist) | Transpor obstáculos sem apertar Jump = meio segundo a mais de pressão no inimigo |
| Slide/Dive Behavior | Tap to Slide | **Hybrid** | Hybrid resolve slide e dive no mesmo botão sem ambiguidade |
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

> Lista para abrir o próximo chat. A identidade visual está **fechada** — partir destes.

1. **★★★ MONTAGEM INTELIGENTE + CAPTURAR VIA TEXTO** — 2 botões novos no header de Minhas Armas (ordem final: Importar via Print · Capturar via Celular · Capturar via Texto · Montagem Inteligente · + Adicionar Arma). Detalhe técnico completo na seção 8.B.
2. **★★ cat_struggles BD + admin UI** — **pré-requisito** pra Montagem Inteligente entregar valor real (a IA precisa cruzar dificuldades cadastradas com a build gerada). Tabela `cat_struggles` no Supabase + admin UI em Configurações·Operador (mesmo padrão do `cat_glossary` que já existe).
3. **★ Análise de build com veredito (final)** — enriquecer `analyze-build` com `active_struggles` no payload para análise personalizada (não genérica). v2.18+v2.19 resolveram parte; falta o cruzamento com dificuldades. Detalhe técnico na seção 8.A.
4. **★ Reorganização completa do Controller (Fase 2: AIMING, depois MOVEMENT, COMBAT, MOTION SENSOR)** — após os 17 prints do menu Settings, faltam ~30 settings no Hub:
   - **AIMING:** ADS Sens por 6 zooms em vez de 3 (Low, 2x-3x, 4x-5x, 6x-7x, 8x-9x, High), 6 sub-multipliers no Sensitivity Multiplier (3rd Person, Ground/Air Vehicles, Tablet, ADS, Focus), Aim Response Curve Slope Scale, Custom Sensitivity Per Zoom toggle, 3rd Person ADS Correction Type
   - **MOVEMENT:** Sprint Assist sub-settings completos, Mantle Assist sub-settings (Sideways, Backwards, Tactical Sprint Only, Mantle Assist Angle), Crouch Assist Tactical Sprint, Slide/Dive Activation Delay, Sprint Restore, Sprint/Tactical Sprint Behavior, Auto Move Forward, Auto Door Peek, Grounded Mantle, Tactical Sprint Activation, Plunging Underwater, Sprinting Door Bash
   - **COMBAT (Advanced):** Focus Behavior, Change Up Directional Button Behavior, Change Zoom Activation, Weapon Mount Exit, Interact/Reload Behavior, Akimbo Behavior, ADS Stick Swap, Depleted Ammo Weapon Switch, Weapon Mount Movement
   - **OVERLAY BEHAVIORS:** Inventory Control, Ping Wheel Delay, Double Tap Danger Ping Delay, Emotes & Sprays Wheel Position
   - **MOTION SENSOR FUNCTION ADVANCED:** ~20 settings (todos defaults pro Victor que não usa motion)
   - Cada um precisa de `why` + `why-detailed` em PT + EN, recomendação pro rusher CQB, integração com glossary. **Trabalho de 3-4 sessões dedicadas, dividido em fases.**
5. **user-assets bucket** — migrar imagens localStorage→Supabase Storage (paths por auth.uid). RLS policies pendentes. Migração de capturas mobile (QR → auth.uid) pendente.
6. **UI Codenames** (admin + botão "Sugerir Codename" em build/loadout). Boa parte do trabalho aproveita o que a Montagem Inteligente vai gerar (codename sugerido na saída da IA).
7. **Avatar IA Nano Banana 2**
8. **PRE-MATCH ADVISOR** (futuro grande) — sugere loadout/arma conforme mapa + modo MP em tempo real. Casa naturalmente com a Montagem Inteligente "pra mapa específico" (V2 da feature).
9. **Marketplace** + **i18n EN** (Loadout/Meus Loadouts) — menor prioridade
10. **Atualização dos dados de Eventos** a cada Season — os números (44 dias, 1700/2200 CP, 15/40 unlocks etc) são hardcoded no HTML/i18n. A cada mid-season ou Reloaded, regenerar o bloco. Possível feature futura: admin UI pra editar Events.

---

## 8.A · TAREFA DETALHADA: Análise de build com veredito

> Levantada em 3 Jun 2026 após Victor questionar o que a análise "NOSSA ANÁLISE" entrega.

### Diagnóstico (o que está errado hoje)

A análise de build é **tecnicamente bem feita** — arquitetura híbrida correta: motor determinístico do Hub calcula stats agregados + identifica fraquezas + pré-filtra candidatos do catálogo; a Edge Function `analyze-build` (Gemini 2.5 Flash) só redige; server-side valida e descarta sugestão cujo `name` não esteja na lista enviada (zero alucinação). **O problema é o que ela responde, não a engenharia.**

Três falhas de produto:
1. **Não conhece o estilo do jogador.** O `style_hint` é *inferido da própria build*. Nunca compara com o fato de que o Victor é **rusher CQB agressivo** — esse dado existe no Hub mas **não é enviado** no payload. **PARCIALMENTE RESOLVIDO na v2.18.0** — `_styleObjectiveWeights(sp)` agora deriva pesos do perfil, e v2.19.0 passa `name` ao Le Vél.
2. **Ignora as dificuldades cadastradas.** As `cat_struggles` vivem em aba separada e **nunca chegam** ao `analyze-build`. Logo, a análise jamais cruza "build otimizada pra 26m" com "teu problema é close a 5m". **PENDENTE.**
3. **Output era descrição, não veredito.** **RESOLVIDO na v2.19.0** — system prompt reescrito pra dar veredito acionável, com `weapon_rating` da aba AVALIE.

### Status atual

- v2.18.0 + v2.19.0 resolveram 1 e 3.
- Pendente: **enviar `active_struggles` no payload + reescrever prompt pra cruzar com as dificuldades**.

### Localização no código

- Bloco da arquitetura híbrida: comentário `ANÁLISE DE BUILD · ARQUITETURA HÍBRIDA` no `index.html`
- Endpoint: `const ANALYZE_BUILD_ENDPOINT = '...supabase.co/functions/v1/analyze-build'`
- Construção do payload: procurar por `player_profile` (já adicionado em v2.19.0); adicionar `active_struggles` no mesmo objeto

---

## 8.B · TAREFA DETALHADA: Montagem Inteligente (Le Vél)

> Levantada em 9 Jun 2026. **Próxima feature a ser implementada.**

### Conceito

Botão novo no header de **Minhas Armas** (ao lado de IMPORTAR VIA PRINT / CAPTURAR VIA CELULAR / + ADICIONAR ARMA). Abre wizard de 3 perguntas e gera uma build inteligente com IA, cruzando perfil + dificuldades + arsenal + nível da arma + Permanent Unlocks usados.

### Princípio de design

**Não pedir o que o Hub já sabe.** O Hub conhece Prestige/Nível do jogador, nível e prestige da arma escolhida, attachments disponíveis pra esse nível, PUTs usados, perfil do operador, dificuldades cadastradas, builds prévias da mesma arma. A IA puxa tudo isso automaticamente. **Só pergunta o que muda por contexto.**

### Form de entrada (3 perguntas)

1. **Qual arma?** Dropdown das 25 armas cadastradas em `hub_user_assets`. Default: a arma da última build aberta.
2. **Distância foco:** CQB · Mid · Long · Versátil. Default: CQB (perfil do Victor).
3. **Modo de jogo:** Multiplayer · Warzone. *(Opcional, futura V2: submodo específico — Hardpoint, S&D, Resurgence, etc.)*

### Modos do wizard (MVP)

- **Gerar do zero** (default) — IA monta do nada baseada nos 3 inputs.
- **Resgate de build** — se a arma já tem build do Victor, opção de "refinar" em vez de regenerar. IA mantém o que está bom, troca o que está sub-ótimo, justifica cada mudança.
- **Counter-build** — campo extra opcional: "tô apanhando de X em Y". A IA otimiza pra contrariar a situação específica.
- **★ CAPTURAR VIA TEXTO** (adicionado 9 Jun, pedido do Victor) — botão PRÓPRIO no header (não é modo interno do wizard): caixa de texto livre onde o Victor cola QUALQUER texto descrevendo uma build (output do chat com Claude, build de site, mensagem de Discord, anotação informal) e a IA parseia e monta a build no Hub automaticamente. Detalhe abaixo.

### CAPTURAR VIA TEXTO — detalhe

**Fluxo:** botão abre modal com textarea grande → Victor cola texto livre → Edge Function `parse-build-text` (Gemini, schema fechado) extrai: arma base, codename (se houver), attachments por slot — e descarta justificativas/stats/papo → validação server-side contra `cat_attachments` (se o nome não existe pra essa arma, marca "não reconhecido" em vez de inventar) → preview na tela com check verde no reconhecido e alerta amarelo no ambíguo (correção manual via dropdown) → Salvar como nova build.

**Parser sem formato exigido:** tabela markdown, bullets, frase corrida ("usa a Tishina no muzzle") — tudo entra, a IA normaliza.

**Caso de uso primário:** o Victor gera builds conversando com o Claude (caso real de 9 Jun: builds URAL e VOLGA da AK-27 geradas no chat) e cola o output direto no Hub sem digitar slot por slot.

**V2 deste modo:** detectar e decodificar Loadout Codes nativos do BO7 (padrão `A02-2G9PV-4C1XB-11` publicado pelo codmunity) no mesmo campo.

### Output da IA

- Build completa nos 8 slots (Optic, Muzzle, Barrel, Underbarrel, Magazine, Stock, Laser, Rear Grip) ou subset conforme a categoria da arma
- Justificativa curta por slot (1 linha cada, no estilo direto do Le Vél)
- Stats agregados estimados (handling, range, recoil control, TTK por distância)
- Comparação com builds existentes do Victor pra essa arma (se houver): "tua CICADA 3301-45 atual ganha em CQB, essa nova ganha em Mid"
- Recomendação de Permanent Unlock se algum attachment ideal exige level mais alto: *"Pra build perfeita, gasta teu próximo PUT no Lightweight Stock — destrava no Level 41, ainda longe."*
- Sugestão de codename temático (alimenta a feature de Codenames do roadmap)
- Botões: **Salvar como nova build** · **Regenerar (variante)** · **Descartar**

### Arquitetura técnica

- **Edge Function nova:** `generate-build` (Supabase, Gemini 2.5 Flash). Irmã da `analyze-build`. `verify_jwt: true`.
- **Schema fechado de saída** (anti-alucinação) com array de 8 slots, cada um com `slot_name`, `attachment_id`, `attachment_name`, `justification`. Mais campos agregados: `aggregate_stats`, `permanent_unlock_recommendation`, `codename_suggestion`, `comparison_with_existing` (opcional).
- **Server-side valida** cada `attachment_id` retornado contra `cat_attachments` e o nível requerido. Se a IA inventar ou pedir um attachment não desbloqueado pelo Weapon Prestige atual + PUTs usados, server descarta e pede regeneração.
- **Reusa o motor determinístico** já existente (`_computeBuildContext`, `_styleObjectiveWeights`, candidatos por fraqueza, perks pool).
- **System prompt do Le Vél:** mesma identidade tonal da `analyze-build` (direto, técnico, frases-marca).

### Dependências (ordem de implementação obrigatória)

1. **`cat_struggles` no BD + admin UI** *(item 2 do roadmap)* — sem isso, a IA não cruza dificuldades com a build gerada, e cai no mesmo erro genérico da NOSSA ANÁLISE antiga.
2. **`cat_attachments` precisa ter o requisito de level/prestige por attachment** — verificar se já tem essa coluna. Se não tem, popular antes (provavelmente já tem via codmunity.gg).
3. **`hub_user_permanent_unlocks`** — tabela ou campo em `hub_users` listando quais PUTs o Victor já usou (em qual attachment foi gasto). Sem isso a IA não sabe quais attachments de level alto já estão disponíveis fora do level natural.

### V2 (depois do MVP funcionar)

- **Pra mapa específico** — wizard ganha 4ª pergunta opcional de mapa. Casa com PRE-MATCH ADVISOR.
- **Variantes simultâneas** — gera 2-3 builds da mesma arma pra cenários diferentes (CQB + Mid + Suporte) com codenames distintos.
- **Plano de progressão até a build ideal** — caminho de levels da arma + estimativa de partidas/double-XP pra chegar lá.
- **Loadout completo (Primary + Secondary com sinergia)** — em vez de uma arma, gera o par. A Secondary cobre o que a Primary não cobre.
- **Histórico de gerações + feedback** — cada build gerada vai pra histórico, com nota do Victor (gostou/não gostou/testou). Vira sinal de fine-tuning futuro.

### Posição dos botões

Header de Minhas Armas. Ordem final (decidida 9 Jun): **Importar via Print · Capturar via Celular · Capturar via Texto · Montagem Inteligente** — e o "+ ADICIONAR ARMA" continua no fim. São 5 botões no total; em mobile viram menu sanduíche pra não estourar a linha. Montagem Inteligente: cor laranja LEVEL com ícone SVG de **engrenagem-com-estrela**, pra destacar dos demais. Capturar via Texto: mesmo visual dos outros 2 botões de captura (consistência da família "captura").

### Nome (DECIDIDO pelo Victor em 9 Jun 2026)

**MONTAGEM INTELIGENTE.** Os 4 botões do header de Minhas Armas ficam: **Importar via Print · Capturar via Celular · Capturar via Texto · Montagem Inteligente**.

### Gabarito de qualidade (gerado manualmente em 9 Jun 2026)

Preview manual da feature feito no chat — serve de referência do nível de output que a `generate-build` deve produzir. Duas builds geradas pra AK-27 (P1-L19 do Victor, 8 slots Gunfighter):

**URAL** (balanceada CQB-mid, build principal): LTI Reflex ou FANG HoverPoint ELO (Optic) · SWF Tishina-11 (Muzzle) · 17" Bystro Speed Barrel (Barrel) · Lateral Precision Grip (Underbarrel) · Epitaph Extended Mag (Magazine) · Caliban Light Stock (Stock) · Lithe Thin Grip (Rear Grip) · Buffer Spring (Fire Mods). Recoil horizontal acumulado −62%. Perks: Lightweight + Dexterity + Tac Sprinter.

**VOLGA** (variante CQB pura, mapas pequenos): LTI Reflex · EMT3 Compensator · 14" Prism Light Barrel · Respire Handstop · Epitaph Extended Mag · Caliban Light Stock · Lithe Thin Grip · **Enhanced Cycle System** (Rapid Fire de Prestige — o EMT3 neutraliza o +24% vertical do ECS).

Decisões de coaching registradas: Battle-Scar Conversion vetado (nerf pesado em Jan/26); ECS vetado na URAL (−12,5% range contradiz o propósito balanceado); FANG HoverPoint aceita na URAL se o Victor preferir (confiança na mira > stat), LTI obrigatória na VOLGA (CQB puro, cada ms de ADS conta).

---

## 9. CHECKLIST PÓS-DEPLOY (v2.21.0)

> Confirmar ANTES de considerar o marco 100% no ar.

- [ ] **Commit no GitHub** já feito (confirmado pelo Victor em 9 Jun 2026). v2.20.1 não foi subida em commit separado — foi consolidada no mesmo commit da v2.21.0. **Não é problema** — o Hub no ar tem ambas as mudanças funcionando. A única "esquisitice" cosmética é o histórico mostrar 2 entries com a mesma data.
- [ ] Confirmar no **Netlify** (app.netlify.com) que o build `le-vel-hub` passou e publicou
- [ ] Abrir **le-vel.games** e verificar:
  - [ ] Footer mostra **LEVEL v2.21.0**
  - [ ] Painel Hoje mostra o bloco **EVENTOS · TEMPORADA ATUAL** abaixo do changelog
  - [ ] 3 cards de eventos com cores temáticas (Nuked verde, Illicit Cargo laranja-cobre, Double XP laranja LEVEL)
  - [ ] Card Battle Pass S4 BLACKCELL com 4 stats
  - [ ] Card Catalyst Collection com tema dourado/preto
  - [ ] Aba Controller → CONTROLLER mostra Zonas Mortas no final (com Left + Right + L2/R2)
  - [ ] Aba Controller → AIMING não tem mais Zonas Mortas (tem só Aim Response Curve em "Mira Avançada")
- [ ] Testar no **mobile** — grid de 3 cards de evento colapsa pra 1 coluna, BP stats colapsa pra 2 colunas
- [ ] **No jogo (PS5),** abrir Settings → Controller e ajustar conforme seção 6 acima

---

## 10. WORKFLOW & PADRÕES TÉCNICOS

- Edições sempre via Python `read → str_replace → write` em `/home/claude/hub.html`, **nunca** edição manual de linhas
- `str_replace` Python com `assert count == 1` antes de cada substituição
- Validação após cada alteração: `node --check` no maior bloco `<script>` + html5lib parse + balanço de tags
- Para mudanças visuais grandes: renderizar com Playwright (chromium headless) e inspecionar screenshot ANTES de entregar
- Output final: `/mnt/user-data/outputs/index.html`; Victor commita no GitHub
- **NUNCA** sugerir Google Drive ou Files do Projeto (Victor parou 31 Mai 2026)
- Versionamento SemVer: PATCH=bugfix/visual, MINOR=feature, MAJOR=quebra
- A cada entrega: bumpar versão + footer (`LEVEL vX.Y.Z`) + bloco "O QUE MUDOU NESTA VERSÃO" (topo do Painel Hoje) + entrada no Histórico de Versões (`vh-entry` no topo da `vh-list`)
- Mudança de frontend que afete schema → backend Supabase na mesma sessão

### Bugs estruturais documentados

- **Inserção de `vh-entry` via `str_replace`** tem risco de consumir o `<div class="vh-entry">` da próxima entry, deixando `</div>` órfão que fecha `<main>` prematuramente e expulsa seções inteiras do fluxo do documento. **Sempre** validar com html5lib após cada inserção.
- **Assertions prematuras** podem falhar se o teste for feito antes da renomeação dos i18n keys (caso v2.20.1). Ordenar: 1) remover/mover HTML, 2) renomear i18n, 3) só depois assertar ausências.
- **Memória vs realidade do Hub:** a memória do Claude pode estar desatualizada (caso 9 Jun: memória dizia v2.14.0, Hub estava em v2.20.0). **Sempre conferir o footer/changelog do arquivo anexado** antes de planejar bump de versão.

### Fontes de dados do jogo

- **codmunity.gg**: fonte primária de attachments (`browser_batch` navigate→wait 3s→`get_page_text`; requer aprovação de permissão na 1ª navegação)
- **game8.co**: não funciona com `get_page_text` — usar `web_fetch` com URLs archive.org
- **callofduty.com/blog/blackops7**: fonte oficial pra info de Seasons, Events, BP
- **gamespot.com / dotesports.com / boostmatch.gg**: fontes confiáveis pra detalhes de eventos e recompensas

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

### Sessão 9 Jun 2026

- **Identidade visual do jogo vs Hub:** quando o Victor pede "alinhar com o jogo", os prints valem mais que palavras. Pedir prints antes de propor reorganização grande.
- **Memória vs realidade:** se a versão na memória diverge do footer do arquivo anexado, o **arquivo anexado é a verdade**. Não confiar em memória pra estado do Hub.
- **Erro do Victor com Min/Max do stick:** ele confundiu os campos no jogo (Min 70 / Max 80 em vez de Min 0 / Max 70). Lição: ao recomendar config no jogo, **sempre dar Min E Max explicitamente** na mesma frase, pra ele não inverter.
- **Eventos da Season são dados perecíveis** — vão ficar desatualizados em 3-4 semanas (Reloaded vem aí). A cada Season nova, regenerar o bloco manualmente é o fluxo. No futuro, pode virar feature (admin UI).
- **SVG inline > imagens externas** pra cards de eventos do Hub. Activision muda URLs com frequência, e o Hub é single-file que tem que funcionar offline.
- **3 top 3 em 3 partidas com config invertida = sinal de skill** que estava sendo limitada pelo movimento. Quando o Victor corrigir Sprint Assist + Mantle Assist + Slide/Dive Hybrid + Left Stick 0/70, vai escalar mais.

---

*LEVEL · BO7 Tactical Hub — documento de estado. Regenerar ao fim de cada marco.*
