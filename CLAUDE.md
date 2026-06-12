# CLAUDE.md — LEVEL · BO7 Tactical Hub

> Instruções de projeto para o Claude Code. Lido automaticamente ao abrir o repo.
> Memória estendida detalhada vive em `LEVEL_ESTADO.md` (ler no início de cada sessão).

## O QUE É
Companion tático pessoal para Call of Duty: Black Ops 7. Single-file `index.html`
(~3,2 MB, ~43k linhas, 16 blocos `<script>`). HTML/CSS/JS puro + Supabase backend +
auto-deploy Netlify. Coach IA interno = **Le Vél**. Site: le-vel.games.

## REGRAS DE COMUNICAÇÃO (sempre ativas)
- Respostas em **pt-BR**. Termos técnicos de jogo (hipfire, ADS, TTK, slide-cancel...)
  → tradução em português entre parênteses, proativamente. Siglas → por extenso também.
- **Recomendações decisivas** — nunca listas de opções (exceto se o Victor pedir).
- **Uma coisa por vez** — Victor tem TDAH + ansiedade. Próximo passo concreto, sem
  despejos de texto, sem "também posso X, Y, Z" no fim. Executar, não ficar a questionar.
- **Sem emojis em UI nova** — apenas SVG inline / Lucide.
- **Nunca** mencionar limites de uso/sessão/tokens.
- Le Vél: tom direto/técnico/empático, trata o operador pelo nome.

## ARQUITETURA DE EDIÇÃO (CRÍTICO — não desviar)
- O Hub é UM ficheiro: `index.html`. Editar sempre por substituição de string com
  **âncoras longas e únicas** (o ficheiro é enorme; strings curtas dão falso-match).
- **Validação obrigatória após CADA alteração:**
  1. `node --check` em **todos** os 16 blocos `<script>` (extrair via regex
     `<script[^>]*>(.*?)</script>`, gravar cada um em ficheiro `.js` e checar — NÃO
     usar /dev/stdin, dá falso-positivo).
  2. Estrutura HTML: deve manter **1 `<main>` + 13 `<section>`** (validar com html5lib
     ou parser equivalente). Inserções de bloco podem orfanar `</div>` e expulsar sections.
  3. Mudanças visuais: **renderizar e inspecionar** antes de dar por feito (o Hub tem
     login gate → extrair o componente + CSS + ícones para página de teste isolada).
- Versionamento SemVer: PATCH=bugfix/visual, MINOR=feature, MAJOR=quebra.

## CHECKLIST DE RELEASE (aplicar todos e listar no fim)
1. SemVer bump
2. Footer `LEVEL · vX.Y.Z` + ver-tag (texto curto do que mudou)
3. Bloco "O QUE MUDOU NESTA VERSÃO" no Painel Hoje — chaves i18n `briefing.changelog.*`
   (date/pill/headline/summary), **PT e EN**. Data tem 2 espaços após `:`; EN usa `Jun 11, 2026`.
4. `vh-entry` no topo do Histórico de Versões
5. Commit título < 50 chars + corpo em bullets
6. Regenerar `LEVEL_ESTADO.md` ao fim de cada marco

## i18n (dois sistemas coexistem)
- `window.I18N` (dict pt/en, 1406+ chaves) + `window.applyI18N(lang)` — principal.
  Aplica `data-i18n` (textContent), `data-i18n-html` (innerHTML),
  `data-i18n-attr` ("attr:chave"), `data-i18n-placeholder`. Idioma em
  `localStorage['bo7hub_lang_v1']`. Aplicado no boot (antes do login).
- `TXT` + `t()` + `getLang()` — secundário.
- Traduzir UI = dar `data-i18n` ao elemento + chave PT/EN no `window.I18N`. NÃO traduzir
  texto direto no HTML.
- Apóstrofo em string JS de aspas simples: usar `&rsquo;`, nunca `''` (quebra o JS).

## TIPOGRAFIA (em transição — v2.28.1 aplicou o 3-tier do Claude Design nos build-cards)
- **Nos `.build-card` (novo 3-tier):** Chakra Petch (display: nomes/abas/botões/badges) ·
  IBM Plex Sans (prosa do Le Vél, 15px/1.62) · JetBrains Mono (dados: stats/níveis/slots).
  Regra: valor → mono; frase → Plex Sans; nome/comando → Chakra Petch.
- **Resto do Hub (sistema antigo):** Black Ops One → títulos de secção · Rajdhani → corpo
  base · JetBrains Mono → dominante · Inter → ~8 pontos soltos (fora dos cards)

## PALETA (CSS vars no topo do index.html)
- `--bg-darkest:#141a2b` · `--bg-dark:#1a2238` · `--bg-panel:#1f283f` · `--bg-row:#25304f`
- `--accent:#FF9800` (laranja ação) · azul-claro `#AEC7E0`
- sucesso `#4ade80` · alerta `#e74c3c`
- Classe de arma: SMG `#ff8155` · AR `#93b8d4` · Sniper `#c084fc`

## CARD DE ARSENAL (`.build-card`, função `renderBuildCard`)
- head (`.bc-name` + `.bc-class cls-SMG/AR/Sniper`) · base (arma + level/prestige/master)
- 3 abas (`.bc-tab`): Loadout / Nossa Análise / Avalie → 3 painéis
- loadout: imagem (`getUserImage` ou silhueta SVG) + 9 slots fixos (`SLOT_LABELS`)
- `.bc-updated` + `.bc-actions` (Editar/Duplicar/Deletar)

## BACKEND (Supabase — projeto bo7-tactical-hub, ref cqkhqtgmolmrfgzozocr, sa-east-1)
- Edge Functions principais: `generate-build` v5, `analyze-build` v6 (decisão server-side),
  `analyze-capture` v13, `gen-history` v1, `analysis-history` v1, `sync-push/pull` v6.
- `cat_attachments` (1102 rows, fonte codmunity) — **NÃO MEXER**. AK-27 weapon_id='ak'.
- Mudança de frontend que afete schema → backend Supabase na mesma sessão.
- RLS sem policy bloqueia tudo em silêncio (status 200, data null) → criar policy na mesma migration.

## DEPLOY
- Commit no repo `victor-level-hub/level-hub` branch main → auto-deploy Netlify → le-vel.games
- Confirmar footer mostra a versão certa no site publicado após deploy.

## NÃO FAZER
- Não sugerir Google Drive nem Project Files (Victor parou 31/Mai/2026).
- Não reescrever o Hub em React (decisão: manter HTML/CSS/JS single-file).
- Não condensar o SYSTEM_PROMPT das Edge Functions em deploys (degrada o coaching).
