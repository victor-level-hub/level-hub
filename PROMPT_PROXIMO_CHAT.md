# 🎯 LEVEL Hub — Prompt para o próximo chat

> Copia tudo dentro do bloco abaixo e cola na primeira mensagem do novo chat.
> Última atualização: 24 Jun 2026 — v2.64.0 (em produção). Sessão longa: avatar-IA estilos,
> catálogo de armas, **sistema de moderação completo**, histórico de progressão, tracker Gemini,
> imagens de equipamento (recorte de fundo + watermark).

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
- Versão: v2.64.0 (footer "LEVEL · v2.64.0") — em produção.
- App = single-file C:\level-hub\index.html (~50k linhas, 20 blocos <script>), HTML/CSS/JS
  vanilla + Supabase. Coach IA interno = "Le Vél". App TODO em PT-BR (se vires teu/tua/
  telemóvel/ecrã/secção = regressão).
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
- VALIDAÇÃO após cada alteração: (a) node --check em TODOS os 20 blocos <script>; (b) tags
  balanceadas (<script>/<title>/<style>); (c) preview estático local + preview_eval (o app tem
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
1. MODERAÇÃO — e-mail dos convites de papel (precisa secret/SMTP → bloqueado até o Victor
   recuperar o painel Supabase); auto-promover o papel quando a pessoa convidada se cadastrar
   com aquele e-mail (hoje o convite só fica registado em role_invites).
2. MODERAÇÃO — estender a moderação aos OUTROS campos públicos: display_name, FOTO (visão/Gemini),
   nome de arma, nome de loadout. (Hoje só a frase passa pela fila.)
3. OPERADOR — decidir o destino das seções admin "Catálogo de acessórios" + "Fontes de dados":
   manter, esconder, ou migrar os attachments (WEAPON_UNLOCKS) de vez pro DB (aí elas saem).
4. RECRAFT — quando o painel Supabase voltar, setar RECRAFT_API_KEY e ligar o renderizador real
   (hoje o Gemini simula os estilos). Victor tem a chave ($5 de crédito).
5. CBRS-3 — falta subir a IMAGEM dela em Configurações ▸ Armas ▸ SMG (a arma já está no catálogo).
6. AFINAR watermark/densidade se o Victor achar muito cheio; e ele deve clicar UMA vez no botão
   "Recortar fundo das imagens já salvas".

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
