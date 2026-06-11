# SPEC · Plano de Progressão até a Build Ideal
> Desenho técnico pronto para execução. LEVEL · BO7 Tactical Hub.
> Escrito em 11 Jun 2026 (durante v2.26.1). Roadmap item 1.
> **Bloqueador:** `cat_ideal_builds` está VAZIA (0 linhas). Esta feature precisa de builds ideais cadastradas antes de virar útil. A engenharia abaixo está 100% desenhada; falta a curadoria de dados (decisão de gameplay do Victor).

---

## 1. O QUE É

Dado o arsenal do operador e a **build ideal** de cada arma (curada, por estilo), o Hub mostra:
- **O gap:** quais attachments da build ideal o operador ainda NÃO tem desbloqueados
- **A ordem:** em que sequência de level/prestige desbloquear, do mais barato/impactante ao mais distante
- **O próximo passo concreto:** "Pra chegar na CICADA ideal, teu próximo unlock é o cano X no Level 23 — faltam 4 levels"

Encaixa como **nova sub-tab na aba Progression** (`section-progression`), ao lado de MPC / Perks / Weapons / XP. Reusa o padrão visual de sub-tabs que já existe lá.

---

## 2. PRÉ-REQUISITO DE DADOS (o bloqueador)

`cat_ideal_builds` precisa de pelo menos 1 linha por arma×estilo relevante. Estrutura da tabela (já existe, vazia):

| coluna | tipo | conteúdo |
|---|---|---|
| weapon_id | text | FK lógica → cat_weapons.id (ex: 'ak') |
| style | text | 'rusher_cqb' (o estilo do Victor; pode haver outros no futuro) |
| attachments | jsonb | `[{slot, name}]` — a build ideal |
| perks | jsonb | perks ideais |
| wildcard | text | curinga ideal |
| secondary | text | secundária ideal |
| equipment | jsonb | tática/letal/field upgrade |
| rationale | text | porquê da build (alimenta o coaching) |
| weapon_class | text | snapshot |
| slot_count | integer | nº de slots (5, 8/8 etc.) |

**Como popular (sessão futura com o Victor):** para cada arma prioritária (Sturmwolf, Voyak, AK-27…), o Victor define a build ideal pro rush CQB. Fonte: o próprio conhecimento dele + codmunity.gg. Cada attachment cadastrado DEVE existir em `cat_attachments` (1102 rows) com o mesmo `name` — senão o cruzamento de unlock_level falha. Validar com:
```sql
-- conferir que todo attachment da build ideal existe no catálogo
SELECT ib.weapon_id, a->>'name' AS att_name
FROM cat_ideal_builds ib, jsonb_array_elements(ib.attachments) a
LEFT JOIN cat_attachments ca
  ON ca.weapon_id = ib.weapon_id AND ca.name = a->>'name'
WHERE ca.name IS NULL;  -- deve voltar 0 linhas
```

---

## 3. ARQUITETURA (segue o padrão híbrido já consolidado)

**Engine determinística no front (sem IA pra isto):**
1. Lê a build ideal da arma (de `cat_ideal_builds`, via Edge ou sync)
2. Lê o arsenal do operador (level/prestige por arma — já no estado do Hub)
3. Para cada attachment da build ideal, cruza com `cat_attachments` pra obter `unlock_level` / `is_prestige`
4. Marca cada um como: ✓ já desbloqueado (level atual ≥ unlock) · ⏳ falta (mostra quantos levels) · 🔒 exige prestige
5. Ordena os que faltam por `unlock_level` ascendente
6. Calcula o "próximo passo" = o attachment faltante de menor unlock_level

**IA (opcional, fase 2):** só pra redigir o rationale/coaching ("vale priorizar X porque ataca teu problema de close-range"). A decisão de O QUE falta é 100% determinística. Mesmo princípio do roadmap item 3 (engine decide, IA explica).

---

## 4. BACKEND NECESSÁRIO

**Opção A (recomendada): Edge Function `ideal-build`** — GET por weapon_id+style, devolve a build ideal + já faz o JOIN com cat_attachments pra trazer unlock_level de cada item. Um round-trip, front só renderiza.
- action `get`: `{weapon_id, style}` → `{ok, ideal: {attachments:[{slot,name,unlock_level,is_prestige}], perks, ...}, rationale}`
- Reusa o padrão de `gen-history` (service_role, CORS, friendly errors).

**Opção B: sync embutido** — incluir `cat_ideal_builds` no `sync-pull` (cacheia local). Bom se as builds ideais mudam pouco. Menos round-trips, mas infla o payload de sync.

Recomendação: **A** — builds ideais são consultadas pontualmente (quando o operador abre o plano de uma arma), não a cada boot.

---

## 5. FRONT — onde e como

**Localização:** `section-progression`, nova sub-tab. As sub-tabs existentes usam IDs `prog-mpc`, `prog-perks`, `prog-weapons`, `prog-xp` e chaves i18n `prog.subtab.*` + `prog.panel.*.title/desc`. Adicionar:
- Sub-tab `prog-idealbuild` + chave `prog.subtab.idealbuild`
- Painel com seletor de arma (dropdown do arsenal) + render do plano

**Componentes do painel (reusar classes do Hub):**
- Seletor de arma (mesmo padrão do `sb-weapon` da Montagem)
- Card "Build ideal pra rush CQB" com os slots, cada um com badge de status (✓/⏳/🔒)
- Barra de progresso: "7/8 attachments desbloqueados"
- Bloco "PRÓXIMO PASSO" destacado (laranja): o unlock de menor level faltante
- Rationale (texto da build ideal) no rodapé

**Estética:** zero emojis — usar ícones SVG/Lucide (check, lock, clock). Os badges de status seguem o padrão dos chips do histórico (`.gh-chip`) ou dos pills da Montagem (`.sb-pill`).

**i18n:** PT + EN desde o início (chaves `prog.ideal.*`).

---

## 6. CRUZAMENTO COM O QUE JÁ EXISTE (o diferencial)

Esta feature ganha força ao cruzar com:
- **Histórico de Builds (gen_history, v2.26):** "tua última build adotada da AK foi a RAIO (VELOCIDADE) — falta 1 attachment pra ela virar a ideal"
- **Permanent Unlocks (já na aba):** "esse cano faltante exige Prestige — vale gastar 1 token nele?" → liga direto à gestão de tokens existente
- **Struggles (cat_struggles):** "a build ideal ataca teu 'morro mesmo atirando primeiro' porque inclui handling rápido"

---

## 7. PASSOS DE EXECUÇÃO (quando desbloquear)

1. **[Victor + Claude]** Popular `cat_ideal_builds` pras armas prioritárias (Sturmwolf, Voyak, AK-27) — validar attachments contra cat_attachments (query da seção 2)
2. **[Claude]** Edge Function `ideal-build` v1 (action `get` com JOIN unlock_level) + teste curl
3. **[Claude]** Sub-tab `prog-idealbuild` na section-progression + painel + render determinístico
4. **[Claude]** i18n PT/EN
5. **[Claude]** Validação node+html5lib+Playwright
6. **[Claude]** Bump MINOR (feature nova) + checklist de release
7. **[Victor]** Commit + teste manual

Esforço estimado: 1 sessão, a maior parte em popular os dados (passo 1) e o render (passo 3). A engine é simples (cruzamento determinístico).

---

*Spec pronta. O único bloqueador é a curadoria das builds ideais — decisão de gameplay. Quando o Victor trouxer as builds, executar do passo 2 em diante.*
