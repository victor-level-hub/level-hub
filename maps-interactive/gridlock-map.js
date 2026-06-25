/* ============================================================
   LEVEL · Mapas — base abstrata VERTICAL do GRIDLOCK (retrato)
   NÃO reproduz a planta real: formas abstratas próprias num
   espaço 1100×1760 (retrato, como no guia). Sem rótulos de
   texto aqui — os nomes dos locais vêm da app (PT-BR/EN).
   API: window.LevelGridlockMap.build() -> string de conteúdo
        SVG interno (viewBox 0 0 1100 1760).
   ============================================================ */
window.LevelGridlockMap = (function () {
  function build() {
    function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
    const rng = mulberry32(20260625);
    const out = [];
    const P = s => out.push(s);
    const r2 = n => Math.round(n * 10) / 10;
    function rect(x,y,w,h,fill,rx,extra){return `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" ${rx?`rx="${rx}"`:''} fill="${fill}" ${extra||''}/>`;}
    function poly(pts,fill,extra){return `<polygon points="${pts.map(p=>r2(p[0])+','+r2(p[1])).join(' ')}" fill="${fill}" ${extra||''}/>`;}

    // ---- paleta ----
    const C = { void:'#0B0D12', field:'#15181F', zoneDk:'#262B33', zoneMd:'#333A44', zoneLt:'#4C545F',
                bld:'#1C2027', bldEdge:'#2C323B', road:'#3A4049', concrete:'#5A626D', concreteDk:'#454C56',
                red:'#FF2E2E' };

    // ---- contorno (blob retrato irregular) ----
    const B = [[560,64],[712,108],[792,236],[760,392],[886,520],[968,704],[902,892],[956,1086],
               [852,1276],[742,1430],[660,1612],[516,1700],[442,1556],[346,1432],[262,1236],
               [316,1040],[196,876],[262,672],[214,492],[330,360],[420,212]];
    const bp = 'M' + B.map(p=>r2(p[0])+' '+r2(p[1])).join(' L') + ' Z';

    function inB(x,y){let c=false;for(let i=0,j=B.length-1;i<B.length;j=i++){const xi=B[i][0],yi=B[i][1],xj=B[j][0],yj=B[j][1];if(((yi>y)!=(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))c=!c;}return c;}

    // ---- defs: hachuras + glow ----
    P(`<defs>
      <pattern id="gl-red" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="22" height="22" fill="${C.void}"/>
        <line x1="0" y1="0" x2="0" y2="22" stroke="#E0242480" stroke-width="2.5"/>
      </pattern>
      <pattern id="gl-bld" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="11" height="11" fill="${C.bld}"/>
        <line x1="0" y1="0" x2="0" y2="11" stroke="${C.bldEdge}" stroke-width="2"/>
      </pattern>
      <radialGradient id="gl-glow" cx="50%" cy="46%" r="62%">
        <stop offset="60%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#FF2222" stop-opacity="0.34"/>
      </radialGradient>
      <clipPath id="gl-clip"><path d="${bp}"/></clipPath>
    </defs>`);

    // fundo
    P(rect(0,0,1100,1760,C.void));
    P(`<rect x="0" y="0" width="1100" height="1760" fill="url(#gl-red)" opacity="0.5"/>`);
    P(`<rect x="0" y="0" width="1100" height="1760" fill="url(#gl-glow)"/>`);

    // ===== dentro do contorno =====
    P(`<g clip-path="url(#gl-clip)">`);
    P(rect(0,0,1100,1760,C.field));
    P(`<rect x="0" y="0" width="1100" height="1760" fill="url(#gl-red)" opacity="0.16"/>`);

    // zonas de jogo (cinzas) — estrutura abstrata dos locais
    P(poly([[470,300],[680,330],[700,470],[560,540],[400,500],[360,380]], C.zoneDk));            // Underpass (topo)
    P(poly([[250,520],[360,520],[360,1240],[250,1180]], C.zoneMd));                                // Street (corredor esq.)
    P(poly([[430,640],[760,700],[820,940],[700,1140],[470,1120],[380,900]], C.zoneMd));            // miolo
    P(poly([[470,760],[700,800],[720,980],[520,1040],[420,920]], C.zoneLt));                       // Expressway (centro claro)
    P(poly([[760,860],[968,900],[940,1140],[760,1160],[720,1000]], C.zoneDk));                     // Onsen (dir.)
    P(poly([[330,1180],[560,1180],[600,1420],[420,1520],[300,1380]], C.zoneMd));                   // Promenade / Restaurante (baixo)

    // tabuleiro da via colapsada (lajes de concreto, no centro-topo)
    P(poly([[430,560],[600,540],[640,640],[470,680],[400,620]], C.concreteDk));
    P(poly([[470,620],[630,600],[660,700],[500,740]], C.concrete, 'opacity="0.85"'));
    P(`<path d="M430 560 L610 700" stroke="#2A3038" stroke-width="6"/>`);
    P(`<path d="M470 680 L650 660" stroke="#2A3038" stroke-width="5"/>`);

    // edifícios (hachurados) — procedurais dentro do contorno
    const reserved=[[560,880,170],[850,1020,120],[330,1180,120],[380,560,120],[700,460,90],[560,1610,160],[560,175,160]];
    function nearRes(x,y){return reserved.some(r=>Math.hypot(x-r[0],y-r[1])<r[2]);}
    let placed=0,tries=0;
    while(placed<22 && tries<400){
      tries++;
      const x=120+rng()*860, y=180+rng()*1420;
      if(!inB(x,y)||nearRes(x,y)) continue;
      const w=46+rng()*92, h=40+rng()*82, rot=(rng()*40-20);
      if(!inB(x-w/2,y-h/2)||!inB(x+w/2,y+h/2)||!inB(x-w/2,y+h/2)||!inB(x+w/2,y-h/2)) continue;
      P(`<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})">`);
      P(rect(-w/2,-h/2,w,h,'url(#gl-bld)',3,`stroke="${C.bldEdge}" stroke-width="1.5"`));
      P(`</g>`);
      placed++;
    }
    // destroços pequenos
    for(let i=0;i<14;i++){const x=140+rng()*820,y=220+rng()*1340;if(!inB(x,y)||nearRes(x,y))continue;const w=10+rng()*26,rot=rng()*90;P(`<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})">`);P(rect(-w/2,-4,w,8,C.bldEdge,2));P(`</g>`);}

    // ---- veículos ----
    // (vertical: frente para cima)
    function veh(x,y,w,h,color,opt){opt=opt||{};const win=opt.win||'#C8CDD3';const type=opt.type||'car';
      P(rect(x+3,y+5,w,h,'rgba(8,9,12,0.45)',6));P(rect(x,y,w,h,color,6));
      if(type==='bus'){P(rect(x+w*0.16,y,w*0.68,h,'#58C4DC',6,'opacity="0.22"'));for(let wy=y+9;wy<y+h-9;wy+=15)P(rect(x+5,wy,w-10,8,win,2));}
      else if(type==='truck'){P(rect(x,y,w,h*0.30,'#2E343B',6));P(rect(x+4,y+4,w-8,h*0.15,win,2));P(rect(x+2,y+h*0.30,w-4,h*0.66,'#9AA0A8',4));}
      else if(type==='fire'){P(rect(x,y,w,h*0.32,'#7E1116',6));P(rect(x+4,y+4,w-8,h*0.16,win,2));P(rect(x+2,y+h*0.32,w-4,h*0.64,'#C2161C',4));P(rect(x+w*0.3,y+h*0.4,w*0.4,h*0.5,'#8E1015',2));}
      else{P(rect(x+1.5,y+1.5,w-3,h-3,'none',4,'stroke="rgba(255,255,255,0.08)" stroke-width="1.5"'));P(rect(x+4,y+h*0.16,w-8,h*0.2,win,2));P(rect(x+4,y+h*0.56,w-8,h*0.18,win,2));P(rect(x+5,y+h*0.40,w-10,h*0.14,'rgba(255,255,255,0.08)',2));}
    }
    // fila da Rua (esquerda)
    veh(232,640,52,104,'#5A636E',{});
    veh(236,800,50,98,'#6E7884',{});
    veh(228,960,58,118,'#9AA0A8',{type:'bus'});
    veh(240,1110,48,92,'#646E79',{});
    // carros encravados (centro)
    veh(560,946,48,92,'#71787F',{});
    veh(620,1000,46,88,'#828A93',{});
    // caminhões de bombeiros (Passagem / Underpass) — vermelhos
    veh(640,420,56,116,'#C2161C',{type:'fire'});
    veh(712,470,54,112,'#C2161C',{type:'fire'});
    // caminhão de entregas (verde) na curva
    veh(700,600,56,116,'#3E7D49',{type:'truck'});

    P(`</g>`); // fim clip

    // contorno (glow + linha)
    P(`<path d="${bp}" fill="none" stroke="#FF2222" stroke-width="11" stroke-opacity="0.30" stroke-linejoin="round"/>`);
    P(`<path d="${bp}" fill="none" stroke="${C.red}" stroke-width="3.5" stroke-linejoin="round"/>`);

    return out.join('');
  }
  return { build };
})();
