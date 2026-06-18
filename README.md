# LEVEL · Companion Tático para Call of Duty: Black Ops 7

> **Pare de querer adivinhar. Comece a evoluir.**
> Coach pessoal de performance para FPS. Site: **le-vel.games** · Coach de IA interno: **Le Vél**

LEVEL é uma plataforma *companion* que ajuda jogadores de Black Ops 7 a tomar **decisões melhores** — da arma certa ao squad certo — combinando IA, visão computacional e dados da comunidade. App single-file (`index.html`) + backend Supabase.

---

## ⭐ Features — ranqueadas para o PITCH (mais engajamento → menos)

> Ordem sugerida pelo **Cráudio** para a página inicial (pitch, pré-login). O **Claude Design** decide quantas entram, quais e como dispor. O *gancho* é a frase de venda; a *prova* é o que entrega.

### 🥇 Tier 1 — O GANCHO (faz a pessoa querer entrar)

1. **Le Vél — teu coach de IA pessoal**
   *Gancho:* "Um coach que aprende como **você** joga."
   *Prova:* analisa cada build, dá um veredito honesto e sugere as trocas certas — respeitando o teu estilo (rusher, slayer, anchor…). Não é dica genérica de internet; é coaching adaptado.

2. **Montagem Inteligente**
   *Gancho:* "O loadout perfeito em **segundos**, não em horas de tentativa-e-erro."
   *Prova:* a IA gera o loadout otimizado pro teu estilo + mapa + modo, em **variantes paralelas** (velocidade / equilíbrio / controle).

3. **Captura por foto / partilha (Vision)**
   *Gancho:* "**Fotografa a tela. A gente lê o resto.**"
   *Prova:* tira print no jogo → o LEVEL lê arma, acessórios e stats sozinho. E agora compartilha **direto do PS App** → cai na tua conta. Zero digitação. *(o "momento mágico" da demo)*

### 🥈 Tier 2 — O QUE PRENDE (retenção / efeito de rede)

4. **Encontrar Squad** *(novo)*
   *Gancho:* "Nunca mais jogue sozinho no nível errado."
   *Prova:* acha jogadores compatíveis pra formar equipa — **privacidade-first**, você só aparece se autorizar.

5. **Plano de Progressão**
   *Gancho:* "Saiba **exatamente** o que grindar."
   *Prova:* mostra quais acessórios desbloquear e em que nível pra chegar na tua build ideal.

6. **Marketplace da comunidade**
   *Gancho:* "Roube as melhores builds da comunidade."
   *Prova:* builds compartilhadas + votação + leaderboard; importa a melhor com um clique.

### 🥉 Tier 3 — O QUE APROFUNDA (poder pra quem fica)

7. **Evolução / coaching de progresso** — acompanha tuas dificuldades (notas 0–10) ao longo do tempo + curva de melhoria + histórico de análises.
8. **Configuração de Controle** — settings de PS5 afinados ao teu estilo.
9. **Inteligência de Mapas** *(em construção)* — a arma e o loadout certos por mapa, com dicas da comunidade.

### Base (table stakes — não vende sozinho, mas tem que ter)

10. Painel Hoje (eventos da temporada + battle pass), sync multi-dispositivo, login, multi-idioma (PT/EN).

---

## Stack
- **Front:** single-file `index.html` (HTML/CSS/JS puro) · auto-deploy Netlify → le-vel.games
- **Back:** Supabase (Auth · Postgres · Storage · Edge Functions) · Gemini Vision/texto · Avatar Nano Banana 2
- **Captura mobile:** repo `bo7-capture` + Atalho do iOS / share-ingest

## Estado
Plataforma em produção e evolução ativa. Versão e histórico em [`LEVEL_ESTADO.md`](LEVEL_ESTADO.md) e [`HISTORICO_DEPLOYS.md`](HISTORICO_DEPLOYS.md).
A **página inicial / pitch** (pré-login) está em direção pelo Claude Design — ver §5.E no `LEVEL_ESTADO.md`.
