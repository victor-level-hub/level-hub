# 🎯 LEVEL Hub — Prompt para o próximo chat

> Copia tudo abaixo e cola na primeira mensagem do novo chat (anexa `index.html` v2.9.0 + `LEVEL_ESTADO.md` antes de mandar).

---

Operador no posto. Anexei o `index.html` (v2.9.0) e o `LEVEL_ESTADO.md`. Antes de qualquer plano de edição, **confere se a versão que anexei bate com o GitHub** (regra 8.D):

```bash
curl -sL https://raw.githubusercontent.com/victor-level-hub/main/index.html | grep "LEVEL · <strong>v"
```

Se divergir, baixa direto do GitHub (repo público) e trabalha em cima daquele. Se bater, segue do anexo.

---

## 📋 Pendências em ordem de prioridade

### 🟦 **PRIORIDADE 1** — QA estruturado pré-v3.0.0 (FAZER PRIMEIRO)

Antes de empilhar mais features (gráfico de progressão), Victor quer um **mapa do que está bom e do que está a faltar** no Hub atual. Auditoria estruturada.

#### Formato decidido na sessão anterior

- **Word docs (.docx)** — Victor vai imprimir/colar prints como evidência abaixo de cada teste
- **1 doc por aba** — em vez de 1 doc gigante, separar por secção (Painel Hoje, Construtor, Meus Loadouts, etc). Mais fácil de testar em sessões separadas.

#### Lista de docs a gerar

Um arquivo `.docx` por aba/secção, salvos em `/mnt/user-data/outputs/`:

1. `LEVEL_QA_01_Painel_Hoje.docx`
2. `LEVEL_QA_02_Construtor.docx`
3. `LEVEL_QA_03_Meus_Loadouts.docx`
4. `LEVEL_QA_04_Marketplace.docx`
5. `LEVEL_QA_05_Meus_Armas.docx`
6. `LEVEL_QA_06_Evolucao.docx` (Dificuldades + Progressão)
7. `LEVEL_QA_07_Mapas.docx`
8. `LEVEL_QA_08_Vantagens_Series.docx` (perks, scorestreaks, specialties, field upgrades)
9. `LEVEL_QA_09_Treino_Mira.docx`
10. `LEVEL_QA_10_Configuracoes.docx` (Operador, Imagens, Controle, Áudio, Vídeo, Idioma, Conta)
11. `LEVEL_QA_11_Admin.docx` (todos os painéis admin)

#### Estrutura de cada .docx

**Capa:**
- Título: "LEVEL · QA · [Nome da Aba]"
- Subtítulo: "Hub v2.9.0 · gerado em [data]"
- Resumo: "X features catalogadas"

**Para cada feature, uma secção com:**
- **Heading 2** com nome da feature
- Caminho na UI (ex: "Configurações ▸ Operador ▸ Editar Status")
- **Como testar** — lista numerada de passos (1, 2, 3...)
- **Comportamento esperado** — descrição em prosa curta
- **Bugs conhecidos** (se houver — anotar regressões recentes do `LEVEL_ESTADO.md`)
- **Status** — caixas de checkbox: ☐ OK ☐ Falha ☐ Parcial ☐ Não testado
- **Evidência (prints)** — espaço em branco grande (4-5 parágrafos vazios) pra Victor colar imagem
- **Observações** — linha em branco com underscore pra notas manuscritas

**Resumo final do doc:**
- Tabela: # de features, status agregado, lista de bugs prioritários, gaps identificados

#### Como Cráudio deve trabalhar

1. **Lê o `index.html` v2.9.0 inteiro** procurando por:
   - Headings de secção (`<h1>`, `<h2>`, `<h3>` com texto da UI)
   - Botões e ações (`onclick`, `data-action`, IDs de botão)
   - Modais (id começando com `modal-`)
   - Eventos `addEventListener` que sugerem interações do user
2. **Agrupa por aba** — a aba ativa é determinada por `data-section` no nav
3. **Gera 1 doc por aba** usando `docx-js` (skill `/mnt/skills/public/docx/`)
4. **Não testa nada** — só cataloga
5. **Sugere a ordem de teste** ao Victor no fim do último doc (qual aba testar primeiro)

#### Estimativa

- Catalogação completa: 1 sessão inteira de Cráudio (talvez 2 se for muito grande)
- Pode entregar em rounds: "vou começar pelas 3 abas mais importantes (Painel Hoje, Construtor, Meus Loadouts), tu vê e diz se está no formato certo, depois faço o resto"
- Não bumpa versão do Hub — é só documentação

---

### 🟩 **PRIORIDADE 2** — Gráfico de progressão Prestige/Level (v3.0.0)

**Só depois do QA estar pelo menos catalogado.** Victor pediu um gráfico **x/y**:
- **Eixo Y:** progressão de Prestige/Level
- **Eixo X:** data/hora
- Permite ver a curva de evolução do Operador ao longo dos dias/semanas

**Desenho técnico sugerido (CONFIRMAR COM VICTOR antes de codar):**

1. **Tabela nova no Supabase** `progression_snapshots`:
   ```sql
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   auth_user_id uuid NOT NULL REFERENCES auth.users(id),
   prestige int NOT NULL,
   level int NOT NULL,
   absolute_level int GENERATED ALWAYS AS (prestige * 55 + level) STORED,
   recorded_at timestamptz NOT NULL DEFAULT now(),
   created_at timestamptz NOT NULL DEFAULT now()
   ```
   - **RLS POLICIES IMEDIATAMENTE** (regra 8.E — RLS sem policies = bloqueio silencioso):
     - `select_own` (authenticated lê próprios snapshots)
     - `insert_own` (authenticated insere com `auth_user_id = auth.uid()`)
     - `all_service` (service_role poder total)
   - Index em `(auth_user_id, recorded_at desc)` pra queries rápidas

2. **Captura de snapshots:**
   - **Gancho principal:** no `saveStatusFromModal` (modal Editar Status do Operador) — toda vez que muda prestige/level, registra
   - **Snapshot diário automático:** ao carregar Hub, verifica último snapshot; se >24h, insere novo (best-effort, sem bloquear UI)
   - **Anti-spam:** ignora snapshots se prestige+level idênticos ao último (não polui o gráfico com pontos repetidos)

3. **Decisão pendente:** mostrar curva como **número monotônico** (`absolute_level = prestige*55+level` — mais limpo, vira só uma linha ascendente) **ou** prestige+level separados?
   - **Sugestão Cráudio:** linha monotônica como principal + marcadores especiais nos pontos onde prestige sobe (com badge "P5→P6"). Melhor dos dois mundos.

4. **Gráfico no front:**
   - **Onde renderizar:** investigar aba **Evolução** (cabe junto com Dificuldades?) ou **Painel Hoje** (mais visível)? Confirmar com Victor antes de codar.
   - **Biblioteca:** **procurar primeiro se o Hub já tem algo** (`grep -i "chart\|recharts\|apex\|d3\|plotly" hub.html`). Se não, usar **ApexCharts** (leve, bonito, tema escuro nativo, free).
   - Tooltip: "Prestige X · Level Y · DD MMM YYYY HH:MM"
   - Filtros de período: **7d / 30d / 90d / Tudo** (tabs)
   - Cores LEVEL: laranja `#FF9800` na linha, fundo escuro, badge laranja em mudanças de prestige

5. **Edge Functions:** ler via REST direto (com `auth.uid()` filtrado por RLS) e escrever via Edge `progression-snapshot` (verify_jwt: true) pra fazer anti-spam server-side. **OU** tudo via REST (mais simples).

6. **Análises futuras (NÃO fazer agora — anotar pra depois):**
   - "Tu subiste X levels esta semana"
   - Detectar plateau (sem progresso há N dias) — Le Vél provoca
   - Predizer quando hits next prestige

**Versão alvo:** v3.0.0 (MAJOR — feature grande, tabela nova, mudança no fluxo do Editar Status).

---

### 🟨 **PRIORIDADE 3** — Teste pendente da v2.8.1

Adicionar uma dificuldade nova via painel ADMIN sem F5, abrir Evolução ▸ Dificuldades, confirmar que aparece no picker em tempo real. Se não aparecer, debugar `syncUserCatalog()` e o ciclo `loadStrugglesCatalog → STRUGGLE_CATALOG → renderPicker`. 5 minutos.

*Pode ser absorvido como uma feature do QA estruturado (item 1) — vai estar no doc de Evolução.*

---

### 🟫 **PRIORIDADE 4** — PRE-MATCH ADVISOR (futuro maior, não esta sessão)

Recomenda loadout/arma conforme mapa + modo MP em tempo real. Levantamento detalhado quando chegar a hora.

---

## 📜 Regras de comunicação (do sempre)

- **pt-BR** sempre
- Termos técnicos de jogo entre parênteses logo após (ex: ADS = aim-down-sights — mirar pela arma)
- **Recomendações decisivas**, não listas de opções
- **Sem emojis em UI** — SVG inline
- **Nunca** mencionar limites de sessão/tokens
- TDAH + ansiedade → uma coisa por vez, próximo passo concreto
- Links sempre mais profundos possíveis
- DevTools Chrome: avisar "digita `allow pasting` antes de colar"
- **NUNCA** sugerir Google Drive ou Files do Projeto

## 🛠 Workflow técnico

- Editar via Python `read → str_replace → write` em `/home/claude/hub.html`
- `assert count == 1` antes de cada substituição
- Validar com `node --check` no maior bloco `<script>` (e em todos >1000 chars)
- Output: `/mnt/user-data/outputs/index.html` + `LEVEL_ESTADO.md`
- Versionamento SemVer (PATCH/MINOR/MAJOR)

## ✅ Checklist de entrega (releases de código, NÃO se aplica ao QA doc)

1. SemVer bump
2. Footer + ver-tag
3. Bloco "O QUE MUDOU" PT + EN
4. Entry no topo do Histórico
5. **Título commit max 50 chars**
6. Descrição commit em bullets
7. Link direto pro upload no GitHub

## 🔍 Auditoria obrigatória antes de agir (lições 8.C, 8.D, 8.E)

- Confere versão GitHub vs anexo (regra 8.D)
- Estado real do banco/Supabase vs o doc (regra 8.C) — banco pode estar à frente
- Se vai criar tabela com RLS, **criar policy SELECT no mesmo passo** (regra 8.E)

---

## 🚀 Como começar o próximo chat

**Cráudio começa pelo QA estruturado** (prioridade 1):

1. Lê `index.html` v2.9.0 e cataloga TODAS as features por aba
2. **Gera 11 docs .docx** (um por aba/secção) no formato especificado acima — capa, features com passo-a-passo, espaço pra prints, checkboxes de status, resumo final
3. Pode entregar em rounds (3-4 docs primeiro pra Victor validar formato, depois o resto)
4. **Só depois** do QA, abrir conversa sobre v3.0.0 (gráfico de progressão)

**Não codar nada no Hub.** O QA é puramente documental.
