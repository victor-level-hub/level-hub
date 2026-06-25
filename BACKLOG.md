# BACKLOG — LEVEL Hub
> Lista de pontos a fazer (débito técnico / arquitetura). Atualizado: 25 Jun 2026.
> Pendências de **produto/feature** ficam no `PROMPT_PROXIMO_CHAT.md`. Este ficheiro é o **refactor/arquitetura**.

## ⏱️ Altura certa (recomendação)
**Não fazer big-bang agora.** O Hub está em construção pesada (várias features/dia) + há sessões paralelas → refatorar tudo de uma vez = risco alto de quebra/conflito. Regra é **gatilho, não data**:

1. **Já (barato e seguro):** doc de arquitetura (#4) + extrair o **CSS** pra ficheiros linkados (#1 parcial — mecânico, sem lógica).
2. **Por oportunidade (incremental):** feature **nova** nasce como módulo `assets/js/features/*.js` (ESM nativo, **sem build**); zona mexida a fundo é extraída antes. #2/#6/#7 acontecem aqui naturalmente.
3. **Refactor grande dedicado:** só quando a **velocidade de features baixar** OU o tamanho do ficheiro **começar a custar bugs** (localizar/editar com confiança ficar difícil).
4. **Lint/format (#5):** depois de já existirem módulos.

> "Partir" = extrair CSS/JS pra ficheiros (ESM nativo, sem build), mantendo o **entrypoint único** e **sem framework**. Continua alinhado à decisão do projeto (não reescrever em React).

---

## 🔴 Prioridade alta
1. **Partir o `index.html`** (incremental). Entrypoint única, mas:
   - CSS temático: `assets/css/tokens.css`, `base.css`, `layout.css`, `components.css`.
   - JS em módulos: `assets/js/app.js`, `state.js`, `router.js`, `i18n.js`, `api.js` + `ui/` (modal, toast, cards, filters) + `features/` (loadouts, builder, capture, moderation, profile, …).
2. **Convenção de estado** — camada `state` / `actions` / `renderers`.
3. **Padronizar naming / UI contracts** — `data-*`, chaves i18n, handlers, componentes reusáveis.
4. **Documentar a arquitetura** — mapa dos módulos, fluxo de dados, endpoints das Edge Functions, buckets/tabelas principais, convenção de naming. (Pode começar já, cheap.)

## 🟡 Prioridade média
5. **Lint/format mínimos** — ESLint + Prettier.
6. **Componentes UI "quase-framework"** — fábricas vanilla: `createModal()`, `createCard()`, `createTabs()`, `mountToast()`. (Componentização sem React.)
7. **Separar frontend de domínio** — `features/*`, `services/supabase.js`, `services/gemini.js` (bridge via Edge Functions), `ui/components/*`.

## 🔵 A reavaliar (dívidas pontuais)
8. **"Migrar pra cloud" (Configurações ▸ barra de imagens)** — único sobrevivente da barra de backup local (v2.72.3 removeu Exportar/Importar/Limpar/Sair). Só apanha imagens órfãs de *antes* do cloud-first; upload novo já vai pra cloud via `setUserImage` (upsert em `cat_default_images` + bucket). **Verificar na modularização** (pedido do Victor): confirmar que nada fica só-local e então remover o botão + contador + handler `set-migrate-cloud-btn`. Já varrer junto as órfãs: i18n `set.btn.export/import/clear/logout`, `set.toast.exported/imported/cleared/invalidBackup`, `set.confirm.clear/logout.*`, e a função `clearUserImages`.
9. **Varredura de código-morto da limpeza de UI (v2.72.2–v2.72.6)** — durante a faxina de dev/meta deixei JS/HTML/i18n inertes de propósito (mais seguro em prod do que cortar de blocos partilhados). A varrer numa passagem dedicada:
   - **Builds curadas (v2.72.6):** IIFE `adminCrudBuilds` (~265 ln, fully-guarded, nunca renderiza), o modal `modal-admin-build`, o plumbing `DEFAULT_BUILDS` + cache `level.cache.defaultBuilds`, a flag `level.seeded.builds.v1`, i18n `opp.tour.*`, e a tabela Supabase `cat_default_builds` (decidir se dropa). O reset de arsenal (linha ~7177) ainda menciona `cat_default_builds` no texto.
   - **Catálogo de Attachments (v2.72.5):** i18n `con.catalog.*` e o método inerte `LevelDB.unlocks.catalogStatus`.
   - **Barra de backup local (v2.72.3):** ver as órfãs listadas no #8.
   - Handler morto `opp-btn-change-avatar` (v2.72.2, avatar removido do Operador).

---
*Origem: lista do Victor (24 Jun 2026). Recomendação de timing = Cráudio.*
