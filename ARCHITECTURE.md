# LEVEL — Arquitetura

> **Companion tático de CoD: Black Ops 7.** Uma PWA **AI-native, offline-first, moderada e bilíngue** — construída com **zero framework** e **zero build**.
>
> **Status:** este documento descreve a **arquitetura-alvo** (modular) e mapeia o **estado atual** (single-file) no fim. A migração é **incremental, por gatilho** — ver §9 e `BACKLOG.md`.

---

## 0. O pitch em 3 linhas
1. **Front-end sem framework e sem build:** módulos **ESM** que o navegador corre nativamente. Editas um ficheiro, dás `git push`, está no ar na edge da Cloudflare em segundos. Sem webpack, sem `node_modules` em produção, sem lock-in.
2. **Offline-first com reconciliação na nuvem:** escreve local primeiro (LevelDB), sincroniza por **Last-Write-Wins por entidade**, com push imediato nas edições críticas e auto-pull no boot.
3. **IA entrelaçada, a maior parte a custo zero:** **Gemini** na edge (moderação, visão/OCR, análise de build, avatar) e **@imgly** a remover fundos **no próprio navegador** ($0, privacidade — a foto não sai do device).

---

## 1. Princípios
- **Uma direção de dados** (unidirectional): UI dispara *ação* → *ação* muda *state* + chama *service* → *bus* emite → *renderers* redesenham. Nunca o contrário.
- **Local primeiro:** a fonte de verdade do utilizador é local; a nuvem é o backup/merge. Funciona offline.
- **Edge-native:** toda a lógica de servidor são **Edge Functions** (Deno) + Postgres com **RLS**. Sem servidor a manter.
- **Tokenizado:** zero hex cravado — cores/espaçamentos vivem em *design tokens* (`:root`).
- **Bilíngue por construção:** PT-BR/EN via `data-i18n` + dicionário central.
- **Sem framework, de propósito:** vanilla + ESM. Menos dependências, menos superfície de ataque, deploy instantâneo.

---

## 2. As camadas (o diagrama em palavras)

| Camada | Responsabilidade | Módulos |
|---|---|---|
| **Shell** | Entrada, montagem, *auth gate* | `index.html` · `auth-gate` |
| **Core** | Estado, navegação, i18n, eventos | `state` · `router` · `i18n` · `bus` · `config` |
| **UI Kit** | Componentes vanilla reusáveis | `modal` · `toast` · `card` · `picker` · `tabs` · `icon` |
| **Features** | Domínios do produto (1 pasta cada) | `profile` · `arsenal` · `builder` · `loadouts` · `squad` · `moderation` · `progression` · `marketplace` · `avatar` · `capture` |
| **Services** | Ponte com infra/domínio | `supabase` · `sync` (engine) · `ai` (Gemini bridge) · `assets` (imagens) · `auth` · `localDB` |
| **Design** | Aparência | `tokens.css` · `base.css` · `layout.css` · `components.css` |

**Regra de dependência:** Features dependem de Core/UI Kit/Services. Services não dependem de Features. Core não depende de ninguém. (Igual a uma arquitetura em camadas limpa — Features = "aplicação", Services = "infra/domínio".)

---

## 3. Estrutura de pastas (alvo)
```
/index.html                 ← Shell: só o esqueleto + <link>/<script type="module">
/assets/css/
  tokens.css                ← variáveis (cor, fonte, espaçamento) — Glass/Neon
  base.css                  ← reset + tipografia
  layout.css                ← grelhas, secções
  components.css            ← cards, botões, modais
/assets/js/
  app.js                    ← bootstrap: monta Core, regista Features
  core/
    state.js                ← createStore(get/set/subscribe)
    bus.js                  ← event emitter
    router.js               ← navegação por secção
    i18n.js                 ← window.I18N + applyI18N
    config.js               ← URLs, chaves públicas, flags
  ui/
    modal.js · toast.js · card.js · picker.js · tabs.js · icon.js
  services/
    supabase.js             ← cliente + headers/JWT
    sync.js                 ← buildSnapshot / pushAll / pullAll / LWW
    ai.js                   ← chamadas às edge functions de IA
    assets.js               ← getUserImage / setUserImage / bucket
    auth.js                 ← LEVEL_AUTH (login/signup/reset/onAuthed)
    localdb.js              ← player/weapons/loadouts/struggles (localStorage)
  features/
    profile/  builder/  arsenal/  squad/  moderation/
    progression/  marketplace/  avatar/  capture/
      ↳ cada uma: <feature>.state.js · <feature>.actions.js · <feature>.render.js
/supabase/functions/        ← Edge Functions (Deno/TS), versionadas
```

---

## 4. Convenção de estado — `state / actions / renderers` (o coração)

Uma "Flux/Elm-lite" sem biblioteca. Para um dev ABAP: pensa em **state** = a tabela interna que é a verdade; **actions** = os únicos PERFORM/METHOD que podem mexer nela; **renderers** = rotinas que pintam a tela a partir do state, disparadas por um evento.

```js
// core/state.js — store mínimo
export function createStore(initial) {
  let s = initial, subs = new Set();
  return {
    get: () => s,
    set: (patch) => { s = { ...s, ...patch }; subs.forEach(f => f(s)); },
    subscribe: (f) => { subs.add(f); return () => subs.delete(f); },
  };
}

// features/profile/profile.actions.js — ÚNICO lugar que muda o perfil
import { player } from '../../services/localdb.js';
import { sync }   from '../../services/sync.js';
export async function saveProfile(patch) {
  await player.update(patch);          // 1. local primeiro
  sync.pushNow({ force: true });        // 2. nuvem na hora (não espera os 5min)
  bus.emit('player:changed');           // 3. avisa quem renderiza
}

// features/profile/profile.render.js — state → DOM (puro)
bus.on('player:changed', () => renderSidebar(player.get()));
```

**Por que isto importa:** hoje o `state` do construtor, o `LevelDB.player` e dezenas de `render*()` convivem como globais implícitos no mesmo ficheiro. Formalizar **state/actions/renderers** torna cada feature **testável, isolada e previsível** — e mata bugs como o do "nível que revertia" (a *action* passa a garantir o push imediato num único sítio).

---

## 5. Fluxo de dados (exemplo real: "subir o nível 52 → 53")
```
[UI] modal salva  →  actions.saveProfile({level:53})
                        │
                        ├─ services.localDB.player.update()      (verdade local)
                        ├─ services.sync.pushNow({force})         (hub_users na nuvem, na hora)
                        └─ services.progression.snapshot()        (record-player-snapshot → gráfico)
                        │
                     bus.emit('player:changed')
                        │
        ┌───────────────┼────────────────┐
   render(sidebar)  render(briefing)  render(chart)
```
Uma direção, sempre. No reload, `auth → sync.pullAll()` traz a nuvem (já atualizada) e re-emite os eventos. Sem corrida, sem reverter.

---

## 6. Backend — Supabase (edge-native)
- **Auth:** sessões JWT; o front é *login-gated* (deslogado mostra o Pitch).
- **Postgres + RLS:** 15+ tabelas. Domínio do utilizador (`hub_users`, `hub_weapons`, `hub_builds`, `hub_loadouts`, `hub_struggles`, `hub_unlocks`, `hub_settings`), moderação (`moderation_queue`, `user_red_flags`, `role_invites`, `player_history`) e catálogos (`cat_default_weapons`, `cat_default_images`, `cat_ideal_builds`, `cat_maps`, `cat_codenames`). **RLS edge-only:** as tabelas sensíveis só são acessíveis via Edge Functions com *service-role*.
- **Edge Functions (Deno/TS), ~14:** `sync-push` / `sync-pull` (backup/restore LWW), `moderate-text` / `moderation` (fila + red flags), `record-player-snapshot` + `player-history` (progressão), `generate-avatar`, `analyze-capture` / `analyze-build` (visão), `share-ingest` (captura por QR), `user-asset` (bucket de imagens), `get-gemini-usage`, `bootstrap-defaults`. RPCs: `find_squad` / `set_squad_profile`.
- **Storage:** buckets `user-assets` (imagens de equipamento, URLs assinadas) e `capture-photos` (apagadas após a IA ler).
- **Deploy:** `git push` na main → Cloudflare Pages → `le-vel.games`. Edge Functions deployadas via MCP/CLI.

---

## 7. Transversais
- **i18n:** dicionário central (PT-BR/EN) + `data-i18n`/`data-i18n-html` + helper `tHub()`. Toda string user-facing tem par PT/EN.
- **Design tokens:** `:root` com a paleta Glass/Neon (laranja `#FF9800` + navy). Ícones Lucide inline via `{{i:nome}}`.
- **Sync offline-first:** `buildSnapshot` (local) → `pushAll` (LWW; `force` só perfil/settings) ; `pullAll` no boot. Imagens *cloud-first* (URL assinada → cache local podada quando a nuvem confirma).
- **IA:** Gemini (`gemini-2.5-flash`) na edge para texto/visão; `@imgly` no navegador para remoção de fundo (sem custo de API, sem sair do device). *Cost guard* via `get-gemini-usage`.
- **Moderação:** Gemini pré-analisa → **limpo auto-aprova / suspeito segura na fila** → painel do Operador (aprovar/reprovar) → **red flags (3 strikes → somente-leitura)**. Multi-campo (nome feito; foto/loadout a seguir).

---

## 8. Por que **sem framework / sem build** (a história do pitch)
> "Construímos uma PWA AI-native — offline-first, sincronizada, moderada e bilíngue — com **zero framework** e **zero build**. Módulos **ESM** que o navegador corre direto. Editas um ficheiro, dás `git push`, e em segundos está vivo na edge da Cloudflare, no mundo todo. Sem webpack, sem `node_modules` em produção, sem lock-in de framework. A IA está entrelaçada — e a remoção de fundo corre **no teu navegador**, de graça."

Isto é o ângulo: **anti-complexidade**. Onde o resto traz React + Next + bundler + CI, o LEVEL entrega o mesmo (e mais — IA, offline, moderação) com a plataforma web crua. É mais barato, mais rápido de iterar, e impossível de "ficar preso" numa stack.

---

## 9. Estratégia de migração (incremental, **sem big-bang**)
Partir o monólito **não** é uma reescrita de uma vez (risco alto em produção + sessões paralelas + verificação difícil pelo *login-gate*). É por **gatilho**:
1. **Doc + mapa** (este ficheiro). ✅
2. **Extrair o CSS** (26% / ~13k linhas) → `assets/css/*.css` linkados. Mecânico; cuidar dos `url()` dos assets; verificar render.
3. **Core primeiro:** `state` / `bus` / `i18n` / `router` como módulos — a fundação.
4. **Feature nova nasce módulo** (ESM, sem build). O monólito **para de crescer**.
5. **Extrair por zona:** cada feature que eu mexer a fundo, extraio antes de mexer.
6. **Lint/format** (ESLint/Prettier) quando já houver módulos.

Cada passo é **verificável** (harness isolado ou tu no site logado) antes do próximo. Nunca cego em produção.

---

## 10. Mapa atual → alvo (grounding honesto)
| Hoje (single-file `index.html`, ~51k linhas) | Vira |
|---|---|
| 4 blocos `<style>` (13k linhas) | `assets/css/{tokens,base,layout,components}.css` |
| 20 blocos `<script>` (29k linhas) | `assets/js/{core,ui,services,features}/*.js` |
| `state` global do construtor + `render*()` soltos | `features/builder/{state,actions,render}.js` |
| `window.CloudSync` (pushAll/pullAll/buildSnapshot) | `services/sync.js` |
| `getUserImage`/`setUserImage`/`cloudUploadAsset` | `services/assets.js` |
| `LEVEL_AUTH` (login/signup/onAuthed) | `services/auth.js` |
| `window.I18N` + `tHub()` | `core/i18n.js` |
| mapa `LUCIDE` + `lvlIcon` | `ui/icon.js` |
| `LevelModal` / `showToast` | `ui/modal.js` / `ui/toast.js` |

> *O contrato `LEVEL_AUTH` (ids `lag-*`, `showScreen`, `onAuthed`), os tokens no `:root`, os ícones `{{i:}}` e o i18n `data-i18n` são preservados em qualquer extração — são a "API" interna que não se parte.*

---
*Arquitetura por Cráudio · 24 Jun 2026. Acompanha `BACKLOG.md` (prioridades/timing) e `LEVEL_ESTADO.md` (marcos).*
