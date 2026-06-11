# SPEC · Front do Histórico de Análises
> Desenho técnico. LEVEL · BO7 Tactical Hub. Escrito em 11 Jun 2026.
> **Backend JÁ PRONTO E TESTADO** (tabela `analysis_history` + gravação no `analyze-build` v5/deploy8). Falta só a UI.

---

## 1. ESTADO ATUAL (o que já funciona)

A cada análise de build bem-sucedida, o `analyze-build` grava 1 row em `analysis_history` (fire-and-forget, não atrasa a resposta). Cada row tem:
- weapon_id / weapon_name / weapon_class / build_name
- summary (o veredito do Le Vél)
- suggestions (jsonb — as trocas sugeridas)
- style_hint (estilo no momento)
- active_struggle (dificuldade ativa na época, snapshot textual)
- weakest_dim (dimensão de menor weapon_rating — a "dor" declarada)
- stats_summary (stats agregados no momento)
- created_at

**Testado em produção:** análise da AK-27 "RAIO" gravou corretamente, com weakest_dim='recoil' calculado certo. Tabela limpa (0 linhas) — histórico real começa do zero.

**O que falta:** a UI pra o operador VER esse histórico. Hoje grava no banco mas não há tela que mostre.

---

## 2. O VALOR (por que vale a UI)

O histórico de análises é a espinha do **coaching de evolução**. Com várias análises da mesma arma ao longo do tempo, dá pra mostrar:
- "A tua AK-27 já foi analisada 4×. O veredito evoluiu de 'desalinhada pro teu estilo' (28/Mai) para 'otimizada, no teto' (11/Jun)."
- "A dimensão que mais te incomodava (recoil) deixou de aparecer como weakest_dim nas últimas 2 análises — sinal de que a build melhorou."
- Cruzamento com gen_history: "geraste a RAIO, analisaste 2×, e a 2ª análise já não pede troca nenhuma."

É a diferença entre uma análise pontual e um acompanhamento de progresso.

---

## 3. DECISÃO DE UX PENDENTE (a única coisa que falta decidir)

Onde o histórico de análises aparece? Três opções:

**A) Dentro do Construtor**, perto do resultado da análise — um botão "Ver histórico desta arma" que mostra as análises anteriores da mesma build. Contextual, mas limitado à arma atual.

**B) Modal próprio acionado da aba Evolução** — "Histórico de Análises", filtrável por arma, espelhando exatamente o Histórico de Builds (gen_history) da toolbar de Minhas Armas. Consistente com o padrão que já existe.

**C) Visão unificada de evolução** — uma tela só que junta gen_history (builds adotadas) + analysis_history (análises) + struggle ratings, mostrando a jornada completa por arma. Mais ambicioso, mais valor, mais esforço.

Recomendação: **B agora** (rápido, reusa todo o padrão do histórico de builds que já está pronto — CSS .gh-*, funções de modal, i18n), e **C como evolução futura** quando houver dados suficientes pra valer a tela unificada.

---

## 4. EXECUÇÃO (quando a decisão for tomada — estimativa: B é meia sessão)

Reusa quase tudo do Histórico de Builds (v2.26):
1. Edge Function de leitura: criar `analysis-history` (list/delete) OU estender `gen-history` pra aceitar `table` param. Recomendo função própria `analysis-history` v1 (mesmo molde de gen-history: record já está no analyze-build, falta list/delete).
2. Botão na aba Evolução (ou toolbar) + modal `modal-analysis-history` (clonar `modal-gen-history`).
3. Cards: arma + build_name + trecho do summary + chips (style, struggle, weakest_dim) + data. Expandir card mostra summary completo + suggestions.
4. Filtro por arma (reusa buildGhFilter).
5. i18n PT/EN (chaves `ah.*`).
6. Validação node+html5lib+Playwright.
7. Bump MINOR + checklist.

Lições já aprendidas a aplicar (do histórico de builds):
- Usar `window.renderIconsHtml` (NÃO renderIconsText) pra conteúdo com tags.
- Ícone de stroke precisa do CSS `.lvl-icon svg`.

---

## 5. CRUZAMENTO FUTURO (o diferencial de coaching)

Quando as duas tabelas (gen_history + analysis_history) tiverem dados, o Le Vél pode:
- Mostrar a "linha do tempo" de uma arma: gerada → adotada → analisada Nx → veredito final
- Detectar progresso: weakest_dim sumindo, suggestions diminuindo, struggle rating subindo
- Alimentar o Pre-Match Advisor (roadmap item 10) com o que de facto funcionou pro operador

---

*Backend pronto e testado. Falta a decisão de onde colocar a UI (A/B/C) e ~meia sessão de execução pra opção B.*
