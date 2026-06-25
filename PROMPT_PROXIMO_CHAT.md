# 🎯 LEVEL Hub — Prompt para o próximo chat

> Copia tudo dentro do bloco abaixo e cola na primeira mensagem do novo chat.
> Última atualização: 25 Jun 2026 — **v2.74.0** (em produção). Sessão enorme: **MARKETPLACE SOCIAL**
> (voto→curtir + metadados ricos na build + avaliação do autor 1-10; **backend de comentários 100%
> pronto, falta a UI**), limpezas de UI (painel Operador, Configurações, Home), **REALTIME** (dados do
> user ao vivo via `sync_state` + `pullAll`), e mais um módulo Core (**i18n** → `core/i18n.js`).

---

```
Continuar a construção do LEVEL (le-vel.games) — companion tático de CoD: Black Ops 7.

LÊ PRIMEIRO (antes de editar):
1. C:\level-hub\CLAUDE.md            (instruções de projeto)
2. C:\level-hub\LEVEL_ESTADO.md      (memória detalhada de marcos/arquitetura)
3. A auto-memória (MEMORY.md) já carrega no contexto — confere os pontos abaixo.
O repo REAL é C:\level-hub (o cwd da sessão costuma estar VAZIO). Confirma a localização.
⚠️ Subagentes Explore: passa SEMPRE o caminho ABSOLUTO C:\level-hub\index.html (senão caem no cwd vazio).

ESTADO ATUAL
- Versão: v2.74.0 (footer "LEVEL · v2.74.0") — em produção.
- App = C:\level-hub\index.html (~33k linhas, ~17 blocos <script> inline). MODULARIZAÇÃO em curso:
  CSS → assets/css/level.css; módulos JS → assets/js/{core/i18n, ui/icon, ui/motion, services/realtime}.js
  (carregados por <link>/<script src> SÍNCRONOS; _headers no-cache p/ css/js). Próximos módulos
  INCREMENTAL — ler **ARCHITECTURE.md** (arquitetura-alvo + diagrama) e **BACKLOG.md** (prioridades).
  ⚠️ O bloco do MODAL (window.LevelModal) NÃO externaliza limpo (2 IIFEs; LevelModal ficou undefined —
  revertido; pular esse). HTML/CSS/JS vanilla + Supabase. Coach IA = "Le Vél". App TODO em PT-BR
  (teu/tua/telemóvel/ecrã/secção = regressão).
- DEPLOY: push na main de github.com/victor-level-hub/level-hub → auto-deploy CLOUDFLARE →
  le-vel.games. (Netlify saiu — sem crédito.) Página de captura QR = capture/index.html no MESMO
  repo, multi-modo ?token=&type=weapon|avatar.
- Backend Supabase: projeto cqkhqtgmolmrfgzozocr (org bo7-tactical-hub). Consigo DEPLOYAR edge
  functions e rodar SQL/migrations via MCP, mas NÃO consigo setar SECRETS (painel trancado em
  conta diferente; Victor recupera depois). Permissão de deploy de edge já está no settings.local.json.

REGRAS DE EDIÇÃO (CRÍTICAS)
- index.html é UM ficheiro enorme: edita por substituição de string com âncoras longas e únicas.
  Para zonas com SVG/base64 gigantes, usa scripts Python/Node com split/join LITERAL.
  ⚠️ ARMADILHA: helper de replace que escapa "$" quebra backreferences $1 → usa split/join literal.
- VALIDAÇÃO após cada alteração: (a) node --check nos blocos <script> inline (~18) E nos módulos
  assets/js/*.js; (b) estrutura 1 <main> + 19 <section> (grep) + tags balanceadas; (c) preview estático
  local + preview_eval (o app tem
  login gate; deslogado mostra o PITCH #level-pitch; mede estilos computados — screenshots às
  vezes dão timeout neste ficheiro). ⚠️ Tag HTML literal em texto de changelog (.vh-desc / i18n)
  QUEBRA o parser — escapa &lt;&gt; sempre.
- Não partir o contrato LEVEL_AUTH (ids lag-*, showScreen, doSignup/doLogin/doReset, onAuthed).
  Ícones {{i:nome}} (Lucide inline, sem emoji em UI nova). i18n PT-BR/EN via data-i18n + window.I18N.
  Tokens no :root (não hard-codear hex). <select> no tema escuro precisa color-scheme:dark.

VERSIONAR A CADA DEPLOY (4 lugares + validação)
- .briefing-changelog-title (vX.Y.Z + data) · footer .ver-tag · nova .vh-entry no Histórico ·
  i18n briefing.changelog.headline/summary (PT **e** EN). SemVer: PATCH=fix/visual, MINOR=feature.
- Commit: título curto + corpo em bullets + "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>".
- Victor disse "PERMITO SEMPRE" → pode fazer git push (= deploy) sem pedir OK a cada passo.
  Forcepoint BLOQUEIA le-vel.games nesta máquina → NÃO confiar em curl ao domínio; o Victor
  confirma o deploy no site. (curl ao Supabase funciona.)

GOTCHAS QUE JÁ MORDERAM (não repetir)
- local_id do utilizador = localStorage['level.sync.local_id'] (NÃO 'level.localId' — esse bug
  deixou o tracker Gemini e os snapshots quebrados).
- Catálogo de ARMAS vive na tabela Supabase cat_default_weapons (via edge bootstrap-defaults),
  não no index.html. Adicionar arma = INSERT no DB. Os ATTACHMENTS (WEAPON_UNLOCKS, ~1102) ainda
  estão embutidos no código.
- Personagens do "Gerar com IA" = array AVATAR_CHARACTERS no index.html (hoje 7: price, farah,
  ghost, menendez, reaper, bope, wind_blade).
- Imagens do utilizador: getUserImage(id)/setUserImage(id,dataUrl) em localStorage (id = id do
  item, ex.: weapon id). As grelhas de imagem em Configurações são dinâmicas do catálogo.
- Remoção de fundo = window.LevelBgRemoval (motor @imgly no navegador, transparência real, sem
  custo de API). Watermark da logo = assets/equip-watermark.svg (tile, tiled via background).

GRANDES SISTEMAS CONSTRUÍDOS NESTA SESSÃO (NÃO refazer — só estender)
- AVATAR IA: seletor de 24 ESTILOS (modificadores de prompt no edge generate-avatar v7) + fundo
  de combate sorteado + dropdown custom com miniaturas (assets/style-samples/*.jpg) + "Pose do
  exemplo". Recraft NÃO integrado (Gemini simula; style_id guardado p/ futuro).
- MODERAÇÃO DE CONTEÚDO (fases 1-3 feitas): 
  · DB: hub_users +role/quote/quote_status/show_quote/red_flags/restricted_until/terms_agreed_at;
    tabelas moderation_queue, user_red_flags (com contestação), role_invites, player_history. RLS edge-only.
  · Edges: moderate-text (Gemini pré-analisa frase, multilíngue + evasão por troca de char),
    moderation (status/ack/contest/list/decide/invite_*), player-history (log/list), get-gemini-usage v2.
  · Front: FRASE de perfil (≤50, citação laranja no card do operador) com moderação→fila;
    CONSENTIMENTO no cadastro (#lag-su-conduct) + rodapé + legal.html#conduct; painel Operador com
    FILA de moderação (.opp-staff-only, aprovar/reprovar, 1º avaliador trava) + PAPÉIS (convite por
    e-mail, .opp-admin-only) + red light "Análise" na home; MODAL de red flag (motivo, X/3, punição,
    contestar) + bloqueio VIEW-ONLY (body.is-readonly) ao atingir 3/3.
- HISTÓRICO DE PROGRESSÃO: movido pro Início + log automático de alterações (LevelHistory →
  player-history): perfil (prestige/level/nome/estilo/plataforma) e builds.
- TRACKER "Uso de IA · Gemini": consertado (mostra consumo GLOBAL do projeto p/ admin).
- IMAGENS DE EQUIPAMENTO: upload em Configurações remove o fundo (LevelBgRemoval) só p/ armas/
  melee/field/tactical/lethal; popup de hover recorta a arma por ALFA robusto (maximizada,
  centralizada) sobre watermark discreto da logo; botão "Recortar fundo das imagens já salvas".

PENDENTE (menu — pergunta ao Victor qual atacar; uma de cada vez)
1. MARKETPLACE · COMENTÁRIOS (UI) — backend 100% PRONTO (tabelas mkt_comments/mkt_comment_likes +
   edge fns mkt-comment[moderação Gemini]/mkt-comment-like + mkt-save). FALTA a UI: modal de detalhe
   com thread aninhada (1 nível), curtir/responder comentário, avatar+data/hora. O card já tem botão
   comentar (teaser). Ver memória [[marketplace-social-state]].
2. TESTE de imagem REV-46 — fundo claro + arma maior (v2.73.4, classe .bc-wpn-lighttest + .cfg-light-test).
   Victor a avaliar; se aprovar, ESTENDER às outras armas (remover a condição /rev-46/ em renderBuildCard).
   Se a arma aparecer com fundo escuro colado, falta passar a imagem pelo Processador (remover fundo).
3. REALTIME — feito (v2.74.0, sync_state + pullAll). FALTA testar cross-device logado em 2 dispositivos.
   Ver [[realtime-sync-state-pattern]].
4. MODULARIZAÇÃO (incremental — ver BACKLOG.md): i18n ✅ (core/i18n.js). Próximo Core: state/bus/router,
   OU leaf de 1 IIFE limpo (verifica CADA passo — o modal não externaliza). + VARREDURA de código-morto
   das limpezas v2.72.2-v2.72.6 (ver BACKLOG #9: adminCrudBuilds inerte, i18n órfãs, etc.).
5. PAINEL ESTATÍSTICO da Home — removemos os readouts furados (v2.73.1); o Victor vai desenhar um próprio.
6. MODERAÇÃO — FOTO (Gemini Vision; moderation_queue tem image_path), nome de arma/loadout. + e-mail dos
   convites de papel (SMTP) + auto-promover papel ao cadastrar com o e-mail convidado.
7. RECRAFT real (precisa RECRAFT_API_KEY) + OPERADOR: decidir destino das seções admin "Catálogo de
   acessórios"/"Fontes de dados". Ambos dependem do painel Supabase (secrets) voltar.

COMUNICAÇÃO (Victor tem TDAH + ansiedade)
- PT-BR, recomendações decisivas (não listas longas), UMA coisa de cada vez, próximo passo concreto.
- Humor/personalidade do "Cráudio" são bem-vindos (tempero, não no meio de debug crítico).
- Termos técnicos de jogo → tradução em PT entre parênteses.

Antes de escrever código: confirma o estado, faz as perguntas que precisares e apresenta um
plano curto. (O Victor é iterativo e dá feedback por screenshots — espera o gosto dele.)
```

---

## Histórico recente (contexto rápido — v2.57.31 → v2.64.0, sessão de 24 Jun 2026)
- **v2.58.x** — Avatar IA: seletor de Estilo (24, modificador de prompt Gemini) · fundo de combate variado · cor do dropdown · dropdown custom com miniaturas geradas (cara do fundador) · tamanhos da miniatura.
- **v2.58.6** — arma nova CBRS-3 (SMG) adicionada ao catálogo (cat_default_weapons).
- **v2.58.7 / v2.59.2 / v2.62.1** — limpezas: removida linha "Catálogo de attachments"; Helen Park, Golden Bandit e Pink Meka removidos do catálogo de personagens (sobram 7).
- **v2.59.0** — Início redesenhado (marketing só no pitch) + foto da arma ativa à esquerda + mais stats + foto da arma no modal de build.
- **v2.59.1 / .5** — emblema do operador desliza pro centro no hover; miniatura do estilo +%.
- **v2.60.0** — MODERAÇÃO fase 1 (frase de perfil + moderação + consentimento) + remove bloco "Continuar/Dica" do Início.
- **v2.61.0** — MODERAÇÃO fases 2-3 (fila no painel Operador + papéis + red flags com contestação + view-only).
- **v2.61.1** — fix tracker "Uso de IA · Gemini" (global) + snapshots de progressão voltaram a salvar (chave local_id errada).
- **v2.62.0** — Histórico de progressão movido pro Início + log automático de alterações; removidos botões redundantes (baixar/importar avatar, backup manual).
- **v2.62.2** — revisão geral + limpeza de código órfão + persistência de show_quote.
- **v2.63.x → v2.64.0** — imagens de equipamento: remoção de fundo no upload (IA no navegador) + watermark discreto da logo + popup de hover maximizado (recorte por alfa robusto) + watermark denso cobrindo o fundo + botão "recortar fundo das imagens já salvas". Hardening por workflow de revisão adversarial (guarda de tamanho, quota, crossOrigin, yield de thread).

---

## Histórico recente — SESSÃO 24 Jun (tarde): v2.65.0 → v2.72.1
- **v2.65.0** — MODERAÇÃO do **NOME** do operador (display_name): Gemini pré-analisa; limpo auto-aprova, suspeito segura na fila; reprovar = red flag. Backend: coluna `name_status`; `moderate-text` v3, `moderation` v2, **`sync-push` v2.3 parou de escrever display_name** (era a porta de vazamento). Memória `name-moderation-syncpush`.
- **v2.66.0 / .1** — **GRÁFICO DE PROGRESSÃO** (linhas; X=tempo, Y=prestígio/nível; viradas de prestígio com emblema redondo + hover; views dia/semana/mês/ano). Fix: edição do perfil agora vira ponto no gráfico (dedup por valor; o throttle de 60s do auto-snapshot comia as edições rápidas).
- **v2.67.0 / v2.68.0 / .1** — **PROCESSADOR DE IMAGEM**: Centralizar + Expandir item (recorte por alfa) + preview sobre o fundo de combate + aviso ~80MB removido; **salvar a imagem tratada direto no item pela TAG do nome do arquivo** (`cloudUploadAsset` + `cat_default_images` global, propaga p/ todos); fix do ícone `scissors` (faltava no mapa LUCIDE).
- **v2.69.0 / v2.70.0 / v2.71.0** — **DISPLAY DE EQUIPAMENTO sem corte**: melee (era `cover` em retrato → `contain` horizontal + fundo de combate; override scoped a `#opt-melee`, wildcards intactos); secundária virou **CARDS com imagem** (`renderSecondaryWeaponCards`, seleção via handler genérico `.option-card[data-field="secondaryWeaponId"]`) + **`color-scheme:dark` em TODOS os `<select>`**; build/info/saved cards **ADAPTATIVO** (detecta alfa → tratada fica limpa sem zoom + fundo de combate, opaca mantém `scale(1.18)`; `window.LevelImgTreat` + listener global de `load`).
- **v2.71.1** — **FIX persistência do perfil**: `saveStatusFromModal` dispara `CloudSync.pushAll({force:true})` NA HORA (o auto-backup era a cada 5min e o auto-pull do boot trazia o valor antigo → nível revertia). Memória `sync-profile-immediate-push`.
- **v2.72.0 / .1** — **MODULARIZAÇÃO arrancou**: CSS → `assets/css/level.css` (-13k linhas); ícones/motion → `assets/js/ui/{icon,motion}.js`. + **`ARCHITECTURE.md`** (arquitetura-alvo + diagrama) + **`BACKLOG.md`** (refactor priorizado, por gatilho). O bloco do modal NÃO externalizou limpo (revertido).

---

## Histórico — SESSÃO 25 Jun 2026: v2.72.2 → v2.74.0
- **v2.72.2** — Painel Operador: corrigidos 6 ícones que apareciam como TEXTO CRU nas seções admin (users/plus/key/tag/play/book-open faltavam no `icon.js` → memória [[icon-missing-falls-back-to-text]]); barra de armazenamento de imagens contextual; card de avatar duplicado removido (foto edita-se no avatar da sidebar).
- **v2.72.3** — Configurações: removida a barra de backup local legada (Exportar/Importar/Limpar/Sair — logout vive no header); sobrou só "Migrar pra cloud" (em avaliação — BACKLOG #8).
- **v2.72.4** — **i18n vira o 1º módulo Core**: `window.I18N` + applyI18N/setLanguage extraídos p/ `assets/js/core/i18n.js` (-282 KB no index). Verbatim, posição preservada.
- **v2.72.5** — Construtor: removida a barra "Catálogo de Attachments" (cobertura X/Y + botão "Atualizar" que só abria instruções de scraping manual). Painel de attachments por-arma do Passo 3 mantido.
- **v2.72.6** — removido o atalho "Refazer tour" (redundante c/ o "?" do header) + o **seed de builds-exemplo** a novos utilizadores (build depende de nível/estilo). CRUD admin de builds fica inerte (BACKLOG #9).
- **v2.73.0** — **MARKETPLACE SOCIAL (fase 1+2)**: voto ▲/▼ → **CURTIR** (coração; dislike removido); card mostra avaliação do autor (★ N/10, **obrigatória** ao publicar), estilo, prestígio+nível da arma, data/hora, contagem de saves; importar deixa nota fixa "Importada de @X em…". Backend: +colunas em `mkt_builds`, tabelas `mkt_likes`/`mkt_comments`/`mkt_comment_likes`, edge fns `mkt-publish-build` v6 + `mkt-like`/`mkt-comment`/`mkt-comment-like`/`mkt-save`. Memória [[marketplace-social-state]].
- **v2.73.1 / .2** — Home: removidos os readouts furados ("arma ativa" trocada) + **gráfico de evolução readded**; CTAs do topo removidos; logs em accordions fechados (ALTERAÇÕES DE NÍVEL / GERAIS); tooltip ⓘ no Snapshot.
- **v2.73.3 / .4 / .5** — fixes: abas do build-card quebram linha na grade (flex-wrap); **teste de fundo claro só na REV-46** (`.bc-wpn-lighttest`/`.cfg-light-test`); tooltip do Snapshot deixou de sair do ecrã (help-pop-right).
- **v2.74.0** — **REALTIME** (dados do user ao vivo): trigger Postgres bompa `sync_state` (notificação leve, anon) → `services/realtime.js` assina + dispara `CloudSync.pullAll()` + re-render; re-pull no foco. Agnóstico ao layout. Memória [[realtime-sync-state-pattern]].
