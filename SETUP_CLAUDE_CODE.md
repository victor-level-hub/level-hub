# Setup do Claude Code — LEVEL Hub

## 1. Instalar (uma vez)
Requisito: Node.js 18+ (já tens v22). No terminal:
```
npm install -g @anthropic-ai/claude-code
```

## 2. Clonar o repo localmente (se ainda não tens)
```
git clone https://github.com/victor-level-hub/level-hub.git
cd level-hub
```

## 3. Pôr os ficheiros de contexto na raiz do repo
Copiar para a pasta do repo (ao lado do index.html):
- `CLAUDE.md`  ← o Claude Code lê isto automaticamente ao abrir
- `LEVEL_ESTADO.md`  ← memória detalhada do projeto

## 4. Arrancar
Dentro da pasta do repo:
```
claude
```
Na primeira vez ele pede login (a tua conta Anthropic).

## 5. Primeiro comando sugerido
> "Lê o CLAUDE.md e o LEVEL_ESTADO.md. Confirma que entendeste a arquitetura
>  (single-file, validação dos 16 scripts, paleta, i18n) antes de editar nada."

## Vantagens que ganhas
- Ele edita o index.html local e faz `git commit`/`push` direto — sem o passo manual.
- Sessões contínuas, sem handoff entre chats.

## O que continua igual
- As regras de validação (node --check nos 16 scripts, estrutura HTML, render visual).
- O backend Supabase (as Edge Functions já estão deployadas; ele só mexe se preciso).

## Nota sobre a mudança visual (README do Claude Design)
Quando fores aplicar o novo layout: dá ao Claude Code o README/tokens do Claude Design
e peça para ele aplicar APENAS no CSS/estrutura dos componentes visados, mantendo as
mecânicas (abas, glossário, análise). Pedir sempre render de verificação antes de commitar.
