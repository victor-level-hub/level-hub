# Mapas Interativos — Gridlock (handoff para o Claude Code)

Protótipo funcional da página **Mapas** do LEVEL com mapa tático interativo, inspirado
na estrutura do guia oficial do Black Ops 7 mas 100% na linguagem LEVEL (glass/neon).
Mapa: **Gridlock** (BO7). Conteúdo bilíngue **PT-BR + EN**.

> ### ⚠️ Este é o mapa-PILOTO
> O **Gridlock é o primeiro mapa**, feito como **teste/prova de conceito**. A ideia é
> validar este padrão com o Victor e, **depois, ir adicionando os outros mapas aos poucos,
> exatamente no mesmo formato** (mesma estrutura de dados, mesmas camadas, mesmo layout).
> Por isso a arquitetura é toda data-driven: **um mapa novo = um novo ficheiro de dados no
> mesmo molde de `poi-data.js`** + a sua base de mapa. Nada de UI nova por mapa.

> **Nota legal:** UI e arte 100% originais (LEVEL). Os **nomes de locais** (Expressway,
> Street, Underpass, Onsen, Restaurant, Promenade, Delivery Truck, Ramp Up, Fine Dining)
> são callouts factuais do mapa. Os textos de Prebrief, Intel e Dicas foram **reescritos
> nas minhas palavras** — nada é copiado do guia da Activision. As **fotos dos locais NÃO
> são incluídas** (direitos) — são slots que o app preenche localmente (ver secção FOTOS).

---

## 1. O que a página faz

- **Mapa base Gridlock VERTICAL** (retrato, como no guia oficial), SVG abstrato próprio
  (`gridlock-map.js`, espaço **1100×1760**) — **NÃO reproduz a planta real**; usa formas
  abstratas. Veículos legíveis por tipo (ônibus, caminhão, van, carro) + caminhões de
  bombeiros vermelhos na Passagem. **Rótulos dos locais** (Passagem Inferior, Rua, Via
  Expressa, Onsen, Calçadão) sobre o mapa em **PT-BR/EN** conforme o idioma.
- **Painel de camadas à esquerda** — 10 camadas que se ligam/desligam, com ícone, cor,
  descrição e contagem. Botões `Tudo` / `Limpar`.
- **Camada Entradas** com duas cores: **rua = verde** (ícone porta) e **1º andar/sniper =
  violeta** (ícone janela). As janelas de 1º andar são os spots de sniper.
- **POIs clicáveis** com **ícones** que ilustram o tipo. Clicar mostra o detalhe **ao lado
  do mapa** (painel direito, não modal) com: **foto do local** (slot), termo técnico, dica
  tática e a **arma certa** (classe + build + nota "para o seu estilo").
- **Rotas por time:** clicar no quadrado do **Spawn A** mostra só as rotas do time A (ciano);
  clicar no **Spawn B** mostra as do time B (vermelho). Cada rota tem `team: 'A'|'B'`.
- **Painel direito com abas** quando nada está selecionado:
  - **Prebrief** — briefing do mapa + build recomendada;
  - **Itens** (= *Gridlock Intel*) — mira híbrida, perk Tracker/Scout, lança-foguetes;
  - **Dicas** (Dicas avançadas) — os 3 pontos oficiais do guia (Delivery Truck/A, Ramp Up/B,
    Fine Dining/Γ); tocar numa leva ao ponto no mapa.
- **Legenda** colapsável (símbolos de veículos e entradas).
- **Vista maximizada** (botão `Maximizar`) — alterna o mapa para ecrã cheio **na mesma
  página** (filtros em chips no topo, legenda + detalhe à direita). O × vermelho volta.
- **2 direções visuais** (`Néon` / `Tático`) e **2 idiomas independentes** (Interface PT/EN
  + Termos técnicos PT/EN, como no hub). Default: Interface **PT**, Termos técnicos **EN**.

---

## 2. Ficheiros

| Ficheiro | Papel |
|---|---|
| `Mapas Interativo.html` | Shell: carrega React, `_ds_bundle.js`, os 3 scripts e monta a app. |
| `gridlock-map.js` | Base SVG **vertical** abstrata (1100×1760). `window.LevelGridlockMap.build()`. |
| `poi-data.js` | **Toda a data**: `window.LevelMapData = { MAP, LAYERS, FEATURES, ZONES, TERMS, CLASS }`. |
| `image-slot.js` | Web component `<image-slot>` da foto do local (drop persistente em localStorage). |
| `app.jsx` | UI React (`window.MapasInterativo`). Só renderiza a data — sem lógica de negócio. |

---

## 3. 📸 FOTOS DOS LOCAIS — o que o Claude Code tem de fazer

Cada ponto do mapa tem uma **foto** que aparece no topo do painel de detalhe. No protótipo
isso é um `<image-slot id="photo-<ID>">` que guarda a imagem solta pelo utilizador em
localStorage. **No app real, o Claude Code deve servir essas fotos a partir da configuração
local / assets do app** (não do localStorage).

- **Quantidade:** são **41 fotos** (uma por ponto), listadas na tabela da secção 5.
- **Convenção de id/nome de ficheiro:** o slot de cada ponto é `photo-<ID>`. Sugiro guardar
  os assets como `assets/maps/gridlock/<ID>.jpg` (ex.: `assets/maps/gridlock/spawn-a.jpg`).
- **Como integrar:** onde o protótipo monta `<image-slot id={`photo-${f.id}`}>`, trocar por
  `<img src={mapPhoto('gridlock', f.id)} …>`, com `mapPhoto()` a resolver da config local do
  mapa. Mantém-se o mesmo aspect-ratio 16/9 e o gradiente/título por cima.
- **Tipo de cada ponto:** está na coluna **Tipo** da tabela (Spawn, Hardpoint, Bandeira,
  Sniper, Rota, etc.). **Exemplo do print que o Victor mandou:** o ponto aberto é o
  **`spawn-a` → "Spawn · Lado da Rua" → tipo SPAWN** (foto = uma captura do nascimento norte
  do mapa, do lado da Rua).
- Enquanto não houver foto, o slot mostra um placeholder com o nome do local — o app pode
  cair num placeholder/blur em vez do `<image-slot>`.

---

## 4. Modelo de dados (`poi-data.js`)

Tudo é data-driven. **Coordenadas no espaço vertical 1100×1760.**

```js
// uma feature do mapa
{
  id: 'spawn-a',               // único; vira o id da foto: photo-spawn-a
  layer: 'spawns',             // id de uma LAYER
  geom: 'zone',                // 'point' | 'line' | 'route' | 'zone' | 'entrance'
  x: 500, y: 150, w: 210, h: 76, // zone (point usa só x,y)
  // from:[x,y], to:[x,y]      // line
  // path:[[x,y],...]          // route
  // level:'street'|'upper'    // só geom:'entrance' (rua verde / 1º andar violeta)
  team: 'A',                   // spawns e rotas: 'A'|'B' (controla cor + filtro por spawn)
  term: 'spawn',               // chave em TERMS (resolve PT/EN técnico)
  name:      { pt:'Spawn · Lado da Rua', en:'Street-Side Spawn' },
  tip:       { pt:'…', en:'…' },        // dica tática (idioma Interface)
  weaponClass: 'AR',           // AR|SMG|SNP|LMG|MAR → cor + ClassBadge
  build: 'DOLORE ETERNO',      // nome da build recomendada
  playstyle: { pt:'…', en:'…' },
}
```

- `LAYERS` — id, **icon**, cor (e `color2` nas Entradas), label e descrição (PT/EN).
- `MAP` — meta + `prebrief` (briefing) + `items` (Gridlock Intel).
- `ZONES` — rótulos dos locais desenhados sobre o mapa (PT/EN).
- `TERMS` / `CLASS` — dicionários de termos técnicos e classes (PT/EN do jogo).
- A camada `dicas` (geom `point`, icon `bulb`) são as Dicas avançadas — aparecem como
  marcadores no mapa **e** na aba Dicas.

---

## 5. Os 41 pontos (= 41 fotos · `photo-<ID>`)

| # | ID (slot `photo-<ID>`) | Nome PT-BR | Nome EN | Tipo |
|--|--|--|--|--|
| 1 | `obj-plaza` | Via Expressa (centro) | Expressway (center) | Hardpoint |
| 2 | `obj-rest` | Restaurante | Restaurant | Bandeira |
| 3 | `obj-onsen` | Onsen | Onsen | Local de Bomba |
| 4 | `obj-viaduto` | Via Expressa · Plataforma | Expressway · Platform | Bandeira |
| 5 | `spawn-a` | Spawn · Lado da Rua | Street-Side Spawn | **Spawn (A)** |
| 6 | `spawn-b` | Spawn · Passagem Inferior | Underpass Spawn | **Spawn (B)** |
| 7 | `sl-west` | Rua | Street | Linha de Tiro |
| 8 | `sl-east` | Passagem Inferior | Underpass | Linha de Tiro |
| 9 | `sl-viaduto` | Linha da Plataforma | Platform Line | Linha de Tiro |
| 10 | `pw-viaduto` | Plataforma da Via Expressa | Expressway Platform | Terreno Alto |
| 11 | `pw-varanda` | Varanda do Restaurante | Restaurant Balcony | Posição de Poder |
| 12 | `pw-roofeast` | Telhado · Passagem | Underpass Rooftop | Posição de Poder |
| 13 | `rt-center` | Avanço pela Via Expressa | Expressway Push | Rota (A) |
| 14 | `rt-west` | Flanco pela Rua | Street Flank | Rota (A) |
| 15 | `rt-east` | Flanco pela Passagem | Underpass Flank | Rota (A) |
| 16 | `rtb-center` | Avanço pela Via Expressa (B) | Expressway Push (B) | Rota (B) |
| 17 | `rtb-street` | Flanco pela Rua (B) | Street Flank (B) | Rota (B) |
| 18 | `rtb-onsen` | Flanco pelo Onsen (B) | Onsen Flank (B) | Rota (B) |
| 19 | `hs-escombros` | Escombros da Via Expressa | Expressway Rubble | Zona de Combate |
| 20 | `hs-crossS` | Cruzamento Sul | South Junction | Zona de Combate |
| 21 | `hs-crossN` | Cruzamento Norte | North Junction | Zona de Combate |
| 22 | `cv-bus` | Ônibus da Rua | Street Bus | Cobertura |
| 23 | `cv-truck` | Caminhões de Bombeiros | Fire Trucks | Cobertura |
| 24 | `cv-cars` | Carros Encravados | Jammed Cars | Cobertura |
| 25 | `le-plaza` | Granada na Via Expressa | Frag onto Expressway | Letal |
| 26 | `le-rest` | Molotov no Corredor | Molotov Corridor | Letal |
| 27 | `le-onsen` | C4 no Onsen | C4 at Onsen | Letal |
| 28 | `en-rest` | Porta do Restaurante | Restaurant Door | Entrada · rua |
| 29 | `en-a1` | Loja A1 · Rua | Shop A1 · Street | Entrada · rua |
| 30 | `en-b1` | Acesso · Cruzamento Norte | Access · North Junction | Entrada · rua |
| 31 | `en-c2` | Acesso · Cruzamento Sul | Access · South Junction | Entrada · rua |
| 32 | `en-d2` | Acesso · Passagem | Underpass Access | Entrada · rua |
| 33 | `en-a2` | Meia · Rua | Street Mid | Entrada · rua |
| 34 | `up-b1` | Janela do Restaurante · sobre a Via | Restaurant Window · over Expressway | Janela · 1º andar (sniper) |
| 35 | `up-c1` | Janela da Plataforma · sobre a Via | Platform Window · over Expressway | Janela · 1º andar (sniper) |
| 36 | `up-a2` | Janela · Rua | Window · Street | Janela · 1º andar (sniper) |
| 37 | `up-d2` | Janela · Passagem | Window · Underpass | Janela · 1º andar (sniper) |
| 38 | `up-c2` | Janela · Flanco Leste | Window · East Flank | Janela · 1º andar (sniper) |
| 39 | `adv-truck` | Caminhão de Entregas (A) | Delivery Truck (A) | Dica avançada |
| 40 | `adv-ramp` | Rampa (B) | Ramp Up (B) | Dica avançada |
| 41 | `adv-dining` | Alta Gastronomia (Γ) | Fine Dining (Γ) | Dica avançada |

> Resumo por tipo: 4 objetivos · **2 spawns** · 3 sightlines · 3 posições de poder ·
> 6 rotas (3 do A + 3 do B) · 3 hotspots · 3 coberturas · 3 letais · 6 entradas de rua ·
> 5 janelas de 1º andar · 3 dicas avançadas = **41**.

---

## 6. Para integrar no app real (Claude Code)

1. **Substituir a tela Mapas** atual (`ui_kits/level-app/MoreScreens.jsx` → `Mapas()`,
   exposta como `window.LevelMapas` e servida por `mapas.html`) por esta versão, ou
   adicioná-la como nova rota.
2. **Ligar a data ao backend/config** em vez de `poi-data.js` estático:
   - `MAP`, `LAYERS`, `FEATURES`, `ZONES` viriam da config por mapa (`maps/gridlock`...).
   - `weaponClass` + `build` por POI devem cruzar com o **arsenal/loadout do utilizador**
     (a build recomendada deve respeitar o que ele tem cadastrado, como nas outras telas).
3. **Fotos dos locais:** servir os 41 assets da config local (secção 3). Esta é a parte que
   o Victor pediu para o Claude Code ligar.
4. **Idiomas:** reusar o estado global do hub (Interface + Termos técnicos) em vez do estado
   local `uiLang`/`techLang` deste protótipo.
5. **Multi-mapa (próximos mapas, aos poucos):** para cada mapa novo, criar **um novo ficheiro
   no molde de `poi-data.js`** (mesmos campos) + a sua base de mapa. O ideal para os próximos
   é usar a **imagem do minimapa real por baixo** dos POIs (mantendo o sistema de coordenadas
   e o overlay), em vez do SVG abstrato — fica mais fiel e mais rápido de produzir.
6. **Ganchos futuros pedidos pelo Victor:**
   - *Voz/coach ao vivo:* cada feature já tem `tip` + `playstyle` prontos para TTS ou para
     enviar a um assistente enquanto joga.
   - *IA "o que devo fazer?":* as features são um contexto estruturado ideal para alimentar
     um pedido de ajuda contextual (zona atual → dica + arma).

---

## 7. Decisões pendentes (para o Victor)
- Fixar **A · Néon vs B · Tático** para os marcadores (ou manter as duas como preferência).
- Confirmar o layout do detalhe (ao lado do mapa, atual) no app.
- Recolher as **41 fotos** dos locais (a parte mais demorada — começar pelos spawns e objetivos).
