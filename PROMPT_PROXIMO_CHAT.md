# 🎯 LEVEL Hub — Prompt para o próximo chat

> Copia tudo dentro do bloco abaixo e cola na primeira mensagem do novo chat.
> Última atualização: 17 Jun 2026 — v2.47.0 (DEPLOYED em produção / le-vel.games).

---

```
Continuar a construção do LEVEL (le-vel.games) — companion tático de CoD: Black Ops 7.

LÊ PRIMEIRO (antes de editar):
1. C:\level-hub\CLAUDE.md  (instruções de projeto)
2. C:\level-hub\LEVEL_ESTADO.md  (memória detalhada — marcos, arquitetura, decisões)
O repo REAL é C:\level-hub (o cwd da sessão pode estar vazio). Confirma a localização.

ESTADO ATUAL
- Versão: v2.47.0 (footer "LEVEL · v2.47.0"), já em produção (le-vel.games).
- App = single-file C:\level-hub\index.html (~44k linhas, 16 blocos <script>), HTML/CSS/JS
  vanilla + Supabase + auto-deploy Netlify. Coach IA interno = Le Vél. APP TODO EM PT-BR
  (a conversão PT-PT→PT-BR foi feita na v2.47.0 — se vires "teu/tua/telemóvel/ecrã/secção",
  é regressão).
- Já no padrão do design system: masthead, sidebar/Operator Profile, Auth Gate, scroll-reveal
  em TODAS as telas (v2.44.0→.2). Interior Glass/Neon.
- v2.47.0 (handoff Design System-v7): LOGO+FAVICON oficiais do Figma — logo facetado com chevron
  embutido como <symbol id="level-logo"> (FONTE ÚNICA; o app NÃO lê assets/level-logo.svg em
  runtime — editar só o .svg não muda nada), referenciado por <use> no auth/sidebar/hero;
  favicon chevron (transparente + tiles escuros apple-touch/manifest). MINHAS ARMAS (Command
  Center) = 4 seções empilhadas (Loadout/Análise/Avalie/Progressão), Progressão derivada de
  WEAPON_UNLOCKS (buildUnlockPlanHtml). LOADOUT (#section-loadouts) redesenhado: Estilo cartas
  grandes + segmented Mosaico/Vitrine (renderStyleStep); pickers custom (renderBuildPickers,
  delegam em onPrimaryBuildSelected/onSecondaryBuildSelected); Wildcard retrato
  (renderWildcardCards); 12 Field Upgrades (DATA.fieldup + renderFieldUpgrades); tooltips→modais
  (loOpenModal). Selação reusa o contrato .option-card[data-field][data-value]. CSS .lo-* ≈ L4006.

REGRAS DE EDIÇÃO (CRÍTICAS — não desviar)
- index.html é UM ficheiro enorme: edita por substituição de string com âncoras longas e
  únicas. Para zonas com SVGs grandes, usa scripts Node com replace.
- ⚠️ ARMADILHA já cometida 2x: helper de replace que escapa "$" (repl.replace(/\$/g,'$$$$'))
  É INCOMPATÍVEL com backreferences $1 — parte o CSS/JS. Quando o replacement não precisa de
  grupos, usa substituição LITERAL: s.split(find).join(repl). No fim, grep -nE '\$[0-9]' ao
  index.html para apanhar $N vazados (ignora texto/preço e regexes legítimas).
- VALIDAÇÃO obrigatória após cada alteração: (a) node --check em TODOS os 16 blocos <script>
  (extrair via regex, gravar .js/.mjs, checar); (b) estrutura = 1 <main> + 14 <section>;
  (c) render isolado e inspeção antes de dar por feito (o app tem login gate — serve o
  index.html num servidor estático local + preview; o gate aparece deslogado; para ver a
  Home, esconde o gate via eval. Usa preview_eval para medir estilos computados — mais fiável
  que screenshots neste ficheiro de CSS grande).
- NÃO partir o contrato LEVEL_AUTH (Supabase real): ids lag-*, showScreen, doSignup/doLogin/
  doReset, onAuthed. Confirm-email está OFF (signup entra direto; verify é p/ reset).
- Sem backdrop-filter no masthead/gate (desfoca texto em gradiente). Ícones {{i:nome}}
  (Lucide inline, sem emoji). i18n PT-BR/EN via data-i18n + window.I18N + applyI18N; tokens
  no :root (não hard-codear hex). Logo oficial = inline com id de máscara ÚNICO por instância.

RELEASE + DEPLOY
- Checklist: SemVer bump (PATCH=fix/visual, MINOR=feature) + footer "LEVEL · vX.Y.Z" + ver-tag;
  changelog "O QUE MUDOU" no Painel Hoje (chaves briefing.changelog.date/pill/headline/summary,
  PT e EN); vh-entry no topo do Histórico de Versões; regenerar LEVEL_ESTADO.md.
- Commit: título < 50 chars + corpo em bullets + "Co-Authored-By: Claude Opus 4.8
  <noreply@anthropic.com>". Branch main do repo victor-level-hub/level-hub.
- PUSH = DEPLOY a produção (Netlify → le-vel.games). NÃO fazer git push sem o OK explícito do
  Victor. Depois do deploy, confirmar o footer no site publicado.

COMUNICAÇÃO (Victor tem TDAH + ansiedade)
- pt-BR, recomendações decisivas (não listas), UMA coisa de cada vez, próximo passo concreto.
- Termos técnicos de jogo → tradução em PT entre parênteses. Sem emojis em UI nova.

PRÓXIMOS PASSOS (menu — pede ao Victor qual atacar; uma de cada vez)
1. FOLLOW-UPS do v2.47.0 (loadout redesign):
   a. EN i18n das strings NOVAS do Loadout — hoje fixas em PT no JS: segmented "A · Mosaico/
      B · Vitrine" e "Layout" (renderStyleStep); detalhe do field upgrade "Tipo"/"Recarga" e
      "Escolha um equipamento…" (renderFieldUpgrades); eyebrows/corpos dos modais
      (loStyleModalHtml, LO_HELP); placeholders dos pickers. Mover para CBI18N/I18N + cbt().
   b. Recargas dos 12 Field Upgrades em DATA.fieldup são plausíveis (handoff) — confirmar no jogo.
   c. Imagens reais (estilos/wildcards/field upgrades) — subir em Configurações ▸ Imagens
      (nome do ficheiro = id, ex. rusher.png/overkill.png/assault_pack.png). Mostram placeholder até lá.
   d. Confirmar se converter a SECUNDÁRIA NATURAL (#opt-secondary-weapon, Pistola/Launcher/Special)
      p/ dropdown e o MELEE (#opt-melee) p/ arte grande, como no handoff (hoje continuam option-card).
2. Layouts estruturais pendentes dos protótipos (mais profundos, tocam mecânica — confirmar
   antes): Controle com strip de presets + card "difere do jogo"; Evolução com gráfico de 7
   dias; Marketplace com cards de comunidade.
3. Verificações: logout → testar o Auth Gate (4 telas + verify + erros); logado → confirmar
   o semáforo de backup (verde/âmbar/vermelho) em uso real. Confirmar tudo em PT-BR.
4. Novos handoffs do Claude Design, se houver (pastas design_handoff_* em Downloads): segue
   sempre PASSO 0 (analisa codebase) → PASSO 1 (lê README) → PASSO 2 (plano + perguntas, espera OK).
CONCLUÍDO (não refazer): scroll-reveal em todas as telas (v2.44.0→.2) + count-up Home (v2.44.3);
uploader em massa de imagens (v2.46.0); logo+favicon Figma, Command Center em seções, Loadout
redesign, PT-BR app-wide (v2.47.0).

Antes de escrever código: confirma o estado, faz as perguntas que precisares e apresenta um
plano curto. Espera o OK do Victor.
```

---

## Histórico recente (contexto rápido)
- **v2.41.0** — masthead (CoD + tagline + backup semáforo + popover idioma) + Operator Profile
- **v2.42.0** — Operator Profile v3 + logo oficial metálico + rail 226px
- **v2.43.0** — Auth Gate no padrão + sistema de scroll-reveal
- **v2.43.1** — marca LEVEL em destaque (logo no hero + sidebar maior)
- **v2.43.2** — fix do dot do backup (invisível desde v2.41.0 por bug de `$1` em script)
- **v2.43.3** — slogan PT "Pare de querer adivinhar. Comece a evoluir."
- **v2.43.4** — Home compactada (readouts sem rolar) + subtítulo PT "Saiba…"
- **v2.44.0** — scroll-reveal espalhado ao Painel Hoje + LevelReveal.rearm (cada secção re-anima ao abrir)
- **v2.44.1** — scroll-reveal em Minhas Armas, Loadout, Controle e Evolução (cards/blocos em cascata)
- **v2.44.2** — scroll-reveal nas 6 telas restantes (Marketplace, Meus Loadouts, Mapas, Perks, Aim Training, Progression) — fila concluída
- **v2.44.3** — count-up ligado aos números reais da Home (LevelReveal.countTo) — sistema de movimento 100%
- **v2.45.0** — Plano de Desbloqueio: aba "Progressão" no card da build (o que falta desbloquear por nível/prestígio, com ícone + stats fiéis)
- **v2.45.1** — aba Progressão refinada: caixa fixa com scroll + filtro (Próximos/Bloqueados/Desbloqueados), arma toda com os da build marcados "NA BUILD"
- **v2.45.2** — Nossa Análise: texto do Le Vél em caixa de ~4 linhas com scroll + sugestões em acordeão (abrir uma fecha a outra)
- **v2.46.0** — upload em massa de imagens (arrasta várias; nome do ficheiro = id técnico → coloca no sítio)
- **v2.46.1** — logo LEVEL atualizado para a versão facetada (sidebar, hero da Home, login)
- **v2.46.2** — fix do logo: removida a cunha branca entre o 2º E e o 2º L
- **v2.47.0** — handoff Design System-v7 (DEPLOYED): logo+favicon oficiais do Figma; Minhas Armas (Command Center) em 4 seções (Loadout/Análise/Avalie/Progressão); Loadout redesenhado (estilo em cartas+segmented, pickers custom, wildcard retrato, 12 field upgrades, tooltips→modais); app inteiro convertido de PT-PT para PT-BR (~400 substituições)
