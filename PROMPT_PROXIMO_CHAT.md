# 🎯 LEVEL Hub — Prompt para o próximo chat

> Copia tudo dentro do bloco abaixo e cola na primeira mensagem do novo chat.
> Última atualização: 14 Jun 2026 — v2.44.2 (pronto no index.html; deploy pendente do OK do Victor).

---

```
Continuar a construção do LEVEL (le-vel.games) — companion tático de CoD: Black Ops 7.

LÊ PRIMEIRO (antes de editar):
1. C:\level-hub\CLAUDE.md  (instruções de projeto)
2. C:\level-hub\LEVEL_ESTADO.md  (memória detalhada — marcos, arquitetura, decisões)
O repo REAL é C:\level-hub (o cwd da sessão pode estar vazio). Confirma a localização.

ESTADO ATUAL
- Versão: v2.44.2 (footer mostra "LEVEL · v2.44.2"). Se ainda não deu push, confirma com o Victor.
- App = single-file C:\level-hub\index.html (~44k linhas, 16 blocos <script>), HTML/CSS/JS
  vanilla + Supabase + auto-deploy Netlify. Coach IA interno = Le Vél.
- Já no padrão do design system: masthead (CoD + tagline + backup semáforo + popover de
  idioma), sidebar/Operator Profile (avatar portrait, emblema, caixa 25/75 com pips, logo
  oficial metálico), Auth Gate (vidro, verify, erros por-campo, entrada/saída), e um
  sistema de scroll-reveal aplicado a TODAS as 14 telas (v2.44.0→.2 — fila concluída), com
  rearm por secção (cada tela re-anima a entrada ao ser aberta). Interior já tinha Glass/Neon.

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
1. ✅ Espalhar o scroll-reveal — CONCLUÍDO (v2.44.0→.2). TODAS as 14 telas têm entrada animada.
   LevelReveal.rearm(secção) corre na navegação → cada secção re-anima ao ser aberta. Regra
   seguida: só blocos sempre-visíveis; subpanels de subtab e display:none toggled fora (stranding).
   Nada a fazer aqui — frente fechada.
2. Layouts estruturais pendentes dos protótipos ③–⑨ (mais profundos, tocam mecânica —
   confirmar antes): Loadout com coach Le Vél "ao vivo" ao lado dos slots; Controle com strip
   de presets + card "difere do jogo"; Evolução com gráfico de 7 dias; Marketplace com cards
   de comunidade.
3. count-up nos readouts da Home ligado aos valores reais (hoje o sistema suporta count-up
   mas não está ligado aos números dinâmicos por causa de corrida com o render async).
4. Verificações: logout → testar o Auth Gate redesenhado (4 ecrãs + verify + erros);
   logado → confirmar o semáforo de backup (verde/âmbar/vermelho) em uso real.
5. Novos handoffs do Claude Design, se houver (pastas design_handoff_* em Downloads): segue
   sempre PASSO 0 (analisa codebase) → PASSO 1 (lê README) → PASSO 2 (plano + perguntas, espera OK).

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
