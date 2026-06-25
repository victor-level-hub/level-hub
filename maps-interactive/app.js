const DS = window.LEVELDesignSystem_3a808b;
const { Button, Badge, ClassBadge } = DS;
const { MAP, LAYERS, FEATURES, ZONES, TERMS, CLASS } = window.LevelMapData;
const UI = {
  pageTitle: { pt: "MAPAS", en: "MAPS" },
  eyebrow: { pt: "// Mapa t\xE1tico interativo \xB7 Multiplayer", en: "// Interactive tactical map \xB7 Multiplayer" },
  layers: { pt: "Camadas", en: "Layers" },
  showAll: { pt: "Tudo", en: "All" },
  clear: { pt: "Limpar", en: "Clear" },
  pts: { pt: "pts", en: "pts" },
  recTitle: { pt: "Recomenda\xE7\xE3o do Le V\xE9l", en: "Le V\xE9l recommendation" },
  yourBuild: { pt: "Sua build", en: "Your build" },
  forStyle: { pt: "Para o seu estilo nesta zona", en: "For your style in this zone" },
  hintClick: { pt: "Clique num ponto no mapa para ver a dica t\xE1tica e a arma certa.", en: "Click a point on the map to see the tactical tip and the right weapon." },
  mode: { pt: "Modo", en: "Mode" },
  size: { pt: "Tamanho", en: "Size" },
  bestWeapon: { pt: "Arma certa", en: "Right weapon" },
  openLoadout: { pt: "Abrir no Loadout", en: "Open in Loadout" },
  equip: { pt: "Equipar build", en: "Equip build" },
  close: { pt: "Fechar", en: "Close" },
  photoHint: { pt: "Solte a foto deste local", en: "Drop a photo of this spot" },
  visible: { pt: "vis\xEDveis", en: "visible" },
  direction: { pt: "Dire\xE7\xE3o", en: "Style" },
  dirA: { pt: "N\xE9on", en: "Neon" },
  dirB: { pt: "T\xE1tico", en: "Tactical" },
  langUI: { pt: "Interface", en: "Interface" },
  langTech: { pt: "Termos t\xE9cnicos", en: "Tech terms" },
  langSite: { pt: "Idioma do site", en: "Site language" },
  langSiteHint: { pt: "Interface, menus e textos gerais.", en: "Interface, menus and general text." },
  langTermsHint: { pt: "Nomes de armas, acess\xF3rios e perks do jogo.", en: "In-game weapon, attachment and perk names." },
  point: { pt: "Ponto cr\xEDtico", en: "Critical point" },
  maximize: { pt: "Maximizar", en: "Maximize" },
  exit: { pt: "Sair", en: "Exit" },
  backToMaps: { pt: "Voltar aos mapas", en: "Back to maps" },
  tabPrebrief: { pt: "Prebrief", en: "Prebrief" },
  tabItems: { pt: "Itens", en: "Items" },
  tabDicas: { pt: "Dicas", en: "Tips" },
  prebriefTitle: { pt: "Prebrief do mapa", en: "Map prebrief" },
  itemsTitle: { pt: "Itens interessantes para usar", en: "Useful items to run" },
  dicasTitle: { pt: "Dicas avan\xE7adas \u2014 toca para ver no mapa", en: "Advanced tips \u2014 tap to see on the map" }
};
const CLASS_VAR = { AR: "var(--class-ar)", SMG: "var(--class-smg)", SNP: "var(--class-sniper)", LMG: "var(--class-lmg)", MAR: "var(--class-marksman)" };
function glass(extra) {
  return { borderRadius: 16, border: "1px solid rgba(174,199,224,0.12)", background: "rgba(31,40,63,0.40)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", ...extra || {} };
}
const layerById = Object.fromEntries(LAYERS.map((l) => [l.id, l]));
function featColor(f) {
  const l = layerById[f.layer];
  if (f.geom === "entrance") return f.level === "upper" ? l.color2 : l.color;
  return l.color;
}
function Icon({ name, size = 16, color = "currentColor", sw = 2 }) {
  const p = { fill: "none", stroke: color, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  const G = {
    flag: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M6 21V4", ...p }), /* @__PURE__ */ React.createElement("path", { d: "M6 5h11l-3 3 3 3H6", ...p })),
    spawn: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "8", r: "3.2", ...p }), /* @__PURE__ */ React.createElement("path", { d: "M5.5 20a6.5 6.5 0 0 1 13 0", ...p })),
    cross: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "7", ...p }), /* @__PURE__ */ React.createElement("path", { d: "M12 2v5M12 17v5M2 12h5M17 12h5", ...p })),
    peak: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M3 18l6-9 4 5 3-4 5 8", ...p })),
    route: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M4 12h12", ...p }), /* @__PURE__ */ React.createElement("path", { d: "M13 7l5 5-5 5", ...p })),
    flame: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 2 1 2 1-2-1-5 2-8z", ...p })),
    shield: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z", ...p })),
    bomb: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "14", r: "6", ...p }), /* @__PURE__ */ React.createElement("path", { d: "M15 8l2-2M17 6h2", ...p })),
    door: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M6 21V8a6 6 0 0 1 12 0v13", ...p }), /* @__PURE__ */ React.createElement("path", { d: "M4 21h16", ...p }), /* @__PURE__ */ React.createElement("circle", { cx: "14.5", cy: "13", r: "1", fill: color, stroke: "none" })),
    bulb: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M9 18h6M10 21h4", ...p }), /* @__PURE__ */ React.createElement("path", { d: "M12 3a6 6 0 0 1 4 10c-1 1-1.2 2-1.2 3H9.2c0-1-.2-2-1.2-3A6 6 0 0 1 12 3z", ...p })),
    smoke: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "8", cy: "10", r: "3", ...p }), /* @__PURE__ */ React.createElement("circle", { cx: "14", cy: "8.5", r: "3.5", ...p }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "14", r: "4", ...p })),
    drone: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "2.4", ...p }), /* @__PURE__ */ React.createElement("path", { d: "M6 6l3.2 3.2M18 6l-3.2 3.2M6 18l3.2-3.2M18 18l-3.2-3.2", ...p }), /* @__PURE__ */ React.createElement("circle", { cx: "6", cy: "6", r: "1.6", ...p }), /* @__PURE__ */ React.createElement("circle", { cx: "18", cy: "6", r: "1.6", ...p }), /* @__PURE__ */ React.createElement("circle", { cx: "6", cy: "18", r: "1.6", ...p }), /* @__PURE__ */ React.createElement("circle", { cx: "18", cy: "18", r: "1.6", ...p })),
    scope: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "8", ...p }), /* @__PURE__ */ React.createElement("path", { d: "M12 2v3M12 19v3M2 12h3M19 12h3M12 9v6M9 12h6", ...p })),
    rocket: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M12 3c3 2 4.5 5 4.5 9l-4.5 4-4.5-4C7.5 8 9 5 12 3z", ...p }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "10", r: "1.6", ...p }), /* @__PURE__ */ React.createElement("path", { d: "M9 17l-2 4 3-1.5M15 17l2 4-3-1.5", ...p })),
    expand: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M9 3H4v5M15 3h5v5M9 21H4v-5M15 21h5v-5", ...p }))
  };
  return /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", style: { display: "block" } }, G[name] || G.flag);
}
function Seg({ value, onChange, options, accent = "var(--level-orange)" }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", padding: 2, borderRadius: 8, border: "1px solid rgba(174,199,224,0.16)", background: "rgba(15,20,34,0.6)" } }, options.map((o) => {
    const on = o.value === value;
    return /* @__PURE__ */ React.createElement("button", { key: o.value, onClick: () => onChange(o.value), style: {
      cursor: "pointer",
      border: "none",
      borderRadius: 6,
      padding: "5px 11px",
      fontFamily: "var(--font-mono)",
      fontSize: 10.5,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: on ? "#1A1206" : "var(--text-muted)",
      background: on ? accent : "transparent",
      fontWeight: on ? 700 : 400,
      transition: "all .14s ease"
    } }, o.label);
  }));
}
function postCloseMap() {
  try {
    if (window.parent && window.parent !== window) window.parent.postMessage({ type: "level:map-close" }, "*");
  } catch (e) {
  }
}
function LangDropdown({ uiLang, setUiLang, techLang, setTechLang, u }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(function() {
    if (!open) return void 0;
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey, true);
    return function() {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);
  const Globe = /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "10" }), /* @__PURE__ */ React.createElement("path", { d: "M2 12h20" }), /* @__PURE__ */ React.createElement("path", { d: "M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20" }));
  const FlagPT = /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 28 20", preserveAspectRatio: "xMidYMid slice" }, /* @__PURE__ */ React.createElement("rect", { width: "28", height: "20", fill: "#009C3B" }), /* @__PURE__ */ React.createElement("path", { d: "M14 2.8 L25.2 10 L14 17.2 L2.8 10 Z", fill: "#FFDF00" }), /* @__PURE__ */ React.createElement("circle", { cx: "14", cy: "10", r: "4.2", fill: "#002776" }));
  const FlagEN = /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 60 40", preserveAspectRatio: "xMidYMid slice" }, /* @__PURE__ */ React.createElement("rect", { width: "60", height: "40", fill: "#012169" }), /* @__PURE__ */ React.createElement("path", { d: "M0 0 L60 40 M60 0 L0 40", stroke: "#FFFFFF", strokeWidth: "8" }), /* @__PURE__ */ React.createElement("path", { d: "M0 0 L60 40 M60 0 L0 40", stroke: "#C8102E", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("path", { d: "M30 0 V40 M0 20 H60", stroke: "#FFFFFF", strokeWidth: "10" }), /* @__PURE__ */ React.createElement("path", { d: "M30 0 V40 M0 20 H60", stroke: "#C8102E", strokeWidth: "6" }));
  const Check = /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", style: { width: 15, height: 15 } }, /* @__PURE__ */ React.createElement("path", { d: "M20 6 L9 17 L4 12" }));
  function row(label, hint, value, onChange) {
    return /* @__PURE__ */ React.createElement("div", { className: "lvl-lang__row", key: label }, /* @__PURE__ */ React.createElement("div", { className: "lvl-lang__lab" }, Globe, /* @__PURE__ */ React.createElement("span", null, label)), /* @__PURE__ */ React.createElement("div", { className: "lvl-lang__hint" }, hint), /* @__PURE__ */ React.createElement("div", { className: "lvl-lang__opts lang-toggle" }, [["pt", "Portugu\xEAs", FlagPT], ["en", "English", FlagEN]].map(function(o) {
      return /* @__PURE__ */ React.createElement("button", { key: o[0], type: "button", className: "lang-opt" + (value === o[0] ? " active" : ""), onClick: function() {
        onChange(o[0]);
      } }, /* @__PURE__ */ React.createElement("span", { className: "lang-flag" }, o[2]), /* @__PURE__ */ React.createElement("span", { className: "lvl-lang__nm" }, o[1]), /* @__PURE__ */ React.createElement("span", { className: "lvl-lang__ck" }, Check));
    })));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "lvl-lang", ref }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "lvl-lang__btn" + (open ? " open" : ""), onClick: function() {
    setOpen(!open);
  }, "aria-haspopup": "true", "aria-expanded": open, title: u("langUI") }, Globe, /* @__PURE__ */ React.createElement("span", { className: "lvl-lang__code" }, (uiLang || "pt").toUpperCase()), /* @__PURE__ */ React.createElement("svg", { className: "lvl-lang__chev", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "m6 9 6 6 6-6" }))), /* @__PURE__ */ React.createElement("div", { className: "lvl-lang__pop", hidden: !open }, row(u("langSite"), u("langSiteHint"), uiLang, setUiLang), row(u("langTech"), u("langTermsHint"), techLang, setTechLang)));
}
function MapasInterativo({ full = false }) {
  const [uiLang, setUiLang] = React.useState("pt");
  const [techLang, setTechLang] = React.useState("en");
  const [dir, setDir] = React.useState("A");
  const [active, setActive] = React.useState(() => new Set(LAYERS.map((l) => l.id)));
  const [sel, setSel] = React.useState(null);
  const [hover, setHover] = React.useState(null);
  const [infoTab, setInfoTab] = React.useState("prebrief");
  const [isFull, setIsFull] = React.useState(full);
  React.useEffect(function() {
    function onKey(e) {
      if (e.key !== "Escape") return;
      if (sel) setSel(null);
      else postCloseMap();
    }
    window.addEventListener("keydown", onKey);
    return function() {
      window.removeEventListener("keydown", onKey);
    };
  }, [sel]);
  const t = (o) => o ? o[uiLang] : "";
  const tt = (o) => o ? o[techLang] : "";
  const u = (k) => UI[k][uiLang];
  const counts = React.useMemo(() => {
    const c = {};
    LAYERS.forEach((l) => c[l.id] = 0);
    FEATURES.forEach((f) => c[f.layer]++);
    return c;
  }, []);
  const visibleFeatures = FEATURES.filter((f) => active.has(f.layer));
  const selFeature = FEATURES.find((f) => f.id === sel) || null;
  const focusTeam = selFeature && selFeature.layer === "spawns" ? selFeature.team : null;
  function toggleLayer(id) {
    setActive((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }
  const allOn = active.size === LAYERS.length;
  const neon = dir === "A";
  const shared = { neon, dir, setDir, uiLang, setUiLang, techLang, setTechLang, active, toggleLayer, setActive, visibleFeatures, sel, setSel, hover, setHover, selFeature, focusTeam, t, tt, u, allOn };
  if (isFull) return /* @__PURE__ */ React.createElement(FullView, { ...shared, onExit: () => setIsFull(false) });
  return /* @__PURE__ */ React.createElement("div", { className: "level-field", style: { minHeight: "100vh", backgroundImage: "radial-gradient(55% 60% at 50% 0%, rgba(255,152,0,0.10), transparent 60%), radial-gradient(50% 60% at 0% 100%, rgba(88,196,220,0.06), transparent 55%), linear-gradient(160deg, #161d33, #111626)", display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "sticky", top: 0, zIndex: 60, background: "rgba(10,13,22,0.6)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", borderBottom: "1px solid rgba(174,199,224,0.10)" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1680, margin: "0 auto", minHeight: 64, padding: "10px 18px", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("img", { src: "level-logo.svg", alt: "LEVEL", style: { height: 28, display: "block", flex: "none" } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", lineHeight: 1.1 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, letterSpacing: "0.06em", color: "var(--text-heading)" } }, u("pageTitle")), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", color: "var(--level-blue)" } }, MAP.name, " \xB7 ", tt(MAP.mode))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(LangDropdown, { uiLang, setUiLang, techLang, setTechLang, u }), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 7 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-faint)" } }, u("direction")), /* @__PURE__ */ React.createElement(Seg, { value: dir, onChange: setDir, options: [{ value: "A", label: u("dirA") }, { value: "B", label: u("dirB") }] })), /* @__PURE__ */ React.createElement("button", { onClick: () => setIsFull(true), title: u("maximize"), style: { display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer", border: "1px solid rgba(255,152,0,0.4)", background: "rgba(255,152,0,0.1)", color: "var(--level-orange)", borderRadius: 8, padding: "7px 12px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase" } }, /* @__PURE__ */ React.createElement(Icon, { name: "expand", size: 14, color: "var(--level-orange)", sw: 2.2 }), u("maximize"))), /* @__PURE__ */ React.createElement("span", { style: { width: 1, height: 26, background: "rgba(174,199,224,0.18)", margin: "0 2px", flex: "none" } }), /* @__PURE__ */ React.createElement("button", { onClick: postCloseMap, title: u("backToMaps"), style: { display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", border: "none", background: "var(--level-orange)", color: "#1A1206", borderRadius: 8, padding: "8px 14px", fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", boxShadow: "0 0 12px rgba(255,152,0,0.35)", flex: "none" } }, "\u2039 ", u("backToMaps")))), /* @__PURE__ */ React.createElement("div", { className: "mi-body", style: { flex: 1, maxWidth: 1680, width: "100%", margin: "0 auto", padding: "18px 18px 32px" } }, /* @__PURE__ */ React.createElement("div", { className: "mi-layers", style: glass({ padding: 16, alignSelf: "start", position: "sticky", top: 84 }) }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-secondary)" } }, u("layers")), /* @__PURE__ */ React.createElement("span", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setActive(new Set(LAYERS.map((l) => l.id))), style: miniBtn(allOn) }, u("showAll")), /* @__PURE__ */ React.createElement("button", { onClick: () => setActive(/* @__PURE__ */ new Set()), style: miniBtn(false) }, u("clear")))), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--text-faint)", margin: "7px 0 12px" } }, active.size, "/", LAYERS.length, " ", u("visible")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, LAYERS.map((l) => {
    const on = active.has(l.id);
    return /* @__PURE__ */ React.createElement("button", { key: l.id, onClick: () => toggleLayer(l.id), style: {
      cursor: "pointer",
      textAlign: "left",
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      gap: 11,
      alignItems: "center",
      padding: "9px 11px",
      borderRadius: 11,
      border: `1px solid ${on ? "color-mix(in oklab, " + l.color + " 45%, transparent)" : "rgba(174,199,224,0.10)"}`,
      background: on ? "color-mix(in oklab, " + l.color + " 12%, transparent)" : "rgba(15,20,34,0.4)",
      opacity: on ? 1 : 0.55,
      transition: "all .15s ease"
    } }, /* @__PURE__ */ React.createElement("span", { style: { width: 26, height: 26, borderRadius: 8, flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", background: l.color2 ? `linear-gradient(135deg, ${l.color} 50%, ${l.color2} 50%)` : on ? l.color : "rgba(174,199,224,0.10)", border: `1.5px solid ${l.color}`, boxShadow: on && neon ? `0 0 8px ${l.color}` : "none" } }, /* @__PURE__ */ React.createElement(Icon, { name: l.icon, size: 14, color: on ? "#0F1422" : l.color, sw: 2.2 })), /* @__PURE__ */ React.createElement("span", { style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement("span", { style: { display: "block", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--text-heading)" } }, t(l.label)), /* @__PURE__ */ React.createElement("span", { style: { display: "block", fontFamily: "var(--font-body)", fontSize: 10.5, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, t(l.desc))), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 10, color: on ? l.color : "var(--text-faint)" } }, counts[l.id]));
  }))), /* @__PURE__ */ React.createElement("div", { className: "mi-map", style: glass({ padding: 0, overflow: "hidden", alignSelf: "start" }) }, /* @__PURE__ */ React.createElement(MapCanvas, { neon, active, visibleFeatures, sel, setSel, hover, setHover, t, tt, uiLang, focusTeam, legendStart: false }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 22, padding: "12px 18px", borderTop: "1px solid rgba(174,199,224,0.1)", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Meta, { label: u("mode"), value: tt(MAP.mode) }), /* @__PURE__ */ React.createElement(Meta, { label: u("size"), value: tt(MAP.size) }), /* @__PURE__ */ React.createElement(Meta, { label: u("bestWeapon"), value: MAP.bestBuild, accent: true }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-faint)" } }, visibleFeatures.length, " ", u("pts"), " \xB7 ", active.size, "/", LAYERS.length, " ", u("layers").toLowerCase()))), /* @__PURE__ */ React.createElement("div", { className: "mi-detail", style: { alignSelf: "start" } }, selFeature ? /* @__PURE__ */ React.createElement(DetailCard, { f: selFeature, neon, t, tt, u, onClose: () => setSel(null) }) : /* @__PURE__ */ React.createElement(InfoPanel, { tab: infoTab, setTab: setInfoTab, neon, t, tt, u, setSel }))));
}
function miniBtn(on) {
  return { cursor: "pointer", border: `1px solid ${on ? "rgba(255,152,0,0.4)" : "rgba(174,199,224,0.16)"}`, background: on ? "rgba(255,152,0,0.12)" : "transparent", color: on ? "var(--level-orange)" : "var(--text-muted)", borderRadius: 6, padding: "3px 9px", fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.06em", textTransform: "uppercase" };
}
function Meta({ label, value, accent }) {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)" } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 13, color: accent ? "var(--level-orange)" : "var(--text-body)", marginTop: 3, whiteSpace: "nowrap" } }, value));
}
function MapCanvas({ neon, active, visibleFeatures, sel, setSel, hover, setHover, t, tt, uiLang, focusTeam = null, fit = false, legendSide = "left", legendStart = true, showLegend = true }) {
  const baseHTML = React.useMemo(() => window.LevelGridlockMap.build(), []);
  const [legendOpen, setLegendOpen] = React.useState(legendStart);
  const lines = visibleFeatures.filter((f) => f.geom === "line");
  const routes = visibleFeatures.filter((f) => f.geom === "route" && (!focusTeam || f.team === focusTeam));
  const zones = visibleFeatures.filter((f) => f.geom === "zone");
  const points = visibleFeatures.filter((f) => f.geom === "point");
  const entrances = visibleFeatures.filter((f) => f.geom === "entrance");
  const rootStyle = fit ? { position: "relative", height: "100%", width: "auto", aspectRatio: "1100/1760", maxWidth: "100%", background: "#0B0D12", borderRadius: 14, overflow: "hidden", boxShadow: "0 0 0 1px rgba(174,199,224,0.12)" } : { position: "relative", height: "min(78vh, 880px)", width: "auto", aspectRatio: "1100/1760", maxWidth: "100%", margin: "0 auto", background: "#0B0D12", borderRadius: 10, overflow: "hidden" };
  return /* @__PURE__ */ React.createElement("div", { style: rootStyle }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0 }, dangerouslySetInnerHTML: { __html: `<svg viewBox="0 0 1100 1760" preserveAspectRatio="xMidYMid meet" style="display:block;width:100%;height:100%">${baseHTML}</svg>` } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(8,11,20,0.55))", pointerEvents: "none" } }), ZONES.map((z) => /* @__PURE__ */ React.createElement("span", { key: z.id, style: {
    position: "absolute",
    left: `${z.x / 1100 * 100}%`,
    top: `${z.y / 1760 * 100}%`,
    transform: "translate(-50%,-50%)",
    pointerEvents: "none",
    whiteSpace: "nowrap",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "clamp(11px, 1.7vh, 19px)",
    letterSpacing: "0.04em",
    color: "#EAF0F7",
    textShadow: "0 1px 3px #000, 0 0 10px rgba(0,0,0,0.9)",
    textTransform: "uppercase",
    zIndex: 5
  } }, t(z.name))), /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 1100 1760", preserveAspectRatio: "xMidYMid meet", style: { position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" } }, zones.map((z) => {
    const c = z.team === "A" ? "#58C4DC" : "#E74C3C";
    const isOn = sel === z.id || hover === z.id;
    return /* @__PURE__ */ React.createElement("g", { key: z.id, style: { pointerEvents: "auto", cursor: "pointer" }, onClick: () => setSel(z.id), onMouseEnter: () => setHover(z.id), onMouseLeave: () => setHover(null) }, /* @__PURE__ */ React.createElement("rect", { x: z.x, y: z.y, width: z.w, height: z.h, rx: "14", fill: c, fillOpacity: isOn ? 0.26 : 0.16, stroke: c, strokeOpacity: isOn ? 0.95 : 0.6, strokeWidth: "2.5", strokeDasharray: "9 7" }), /* @__PURE__ */ React.createElement("text", { x: z.x + z.w / 2, y: z.y + z.h / 2 + 5, textAnchor: "middle", fill: c, style: { font: "700 22px var(--font-display)", letterSpacing: "0.12em" } }, z.team));
  }), lines.map((l) => {
    const c = layerById[l.layer].color;
    const isOn = sel === l.id || hover === l.id;
    return /* @__PURE__ */ React.createElement("g", { key: l.id, style: { pointerEvents: "auto", cursor: "pointer" }, onClick: () => setSel(l.id), onMouseEnter: () => setHover(l.id), onMouseLeave: () => setHover(null) }, /* @__PURE__ */ React.createElement("line", { x1: l.from[0], y1: l.from[1], x2: l.to[0], y2: l.to[1], stroke: "transparent", strokeWidth: "26" }), /* @__PURE__ */ React.createElement("line", { x1: l.from[0], y1: l.from[1], x2: l.to[0], y2: l.to[1], stroke: c, strokeWidth: isOn ? 5 : 3, strokeOpacity: isOn ? 1 : 0.75, strokeLinecap: "round", style: neon ? { filter: `drop-shadow(0 0 ${isOn ? 7 : 4}px ${c})` } : {}, strokeDasharray: neon ? "none" : "2 10" }), [l.from, l.to].map((p, i) => /* @__PURE__ */ React.createElement("circle", { key: i, cx: p[0], cy: p[1], r: isOn ? 9 : 7, fill: c, stroke: "#0F1422", strokeWidth: "2.5" })));
  }), routes.map((r) => {
    const c = r.team === "B" ? "#E74C3C" : r.team === "A" ? "#58C4DC" : layerById[r.layer].color;
    const isOn = sel === r.id || hover === r.id;
    const d = r.path.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
    const a = r.path[r.path.length - 2], b = r.path[r.path.length - 1];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
    return /* @__PURE__ */ React.createElement("g", { key: r.id, style: { pointerEvents: "auto", cursor: "pointer" }, onClick: () => setSel(r.id), onMouseEnter: () => setHover(r.id), onMouseLeave: () => setHover(null) }, /* @__PURE__ */ React.createElement("path", { d, fill: "none", stroke: "transparent", strokeWidth: "30" }), /* @__PURE__ */ React.createElement("path", { d, fill: "none", stroke: "#0B0F1A", strokeWidth: isOn ? 12 : 10, strokeOpacity: "0.6", strokeLinecap: "round", strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("path", { d, fill: "none", stroke: c, strokeWidth: isOn ? 6.5 : 5, strokeOpacity: "1", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "16 12", className: "lvl-route", style: { filter: `drop-shadow(0 0 ${isOn ? 6 : 3.5}px ${c})` } }), /* @__PURE__ */ React.createElement("g", { transform: `translate(${b[0]} ${b[1]}) rotate(${ang})` }, /* @__PURE__ */ React.createElement("polygon", { points: "2,0 -15,-9 -15,9", fill: c, stroke: "#0B0F1A", strokeWidth: "2.5", strokeLinejoin: "round", style: { filter: `drop-shadow(0 0 ${isOn ? 6 : 3}px ${c})` } })));
  })), points.map((p) => {
    const c = layerById[p.layer].color;
    const isSel = sel === p.id;
    const isHov = hover === p.id;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: p.id,
        onClick: () => setSel(p.id),
        onMouseEnter: () => setHover(p.id),
        onMouseLeave: () => setHover(null),
        style: {
          position: "absolute",
          left: `${p.x / 1100 * 100}%`,
          top: `${p.y / 1760 * 100}%`,
          transform: "translate(-50%,-50%)",
          cursor: "pointer",
          border: "none",
          background: "transparent",
          padding: 0,
          zIndex: isSel ? 30 : isHov ? 20 : 10
        }
      },
      /* @__PURE__ */ React.createElement(Marker, { neon, color: c, icon: layerById[p.layer].icon, selected: isSel, hovered: isHov, label: t(p.name), term: tt(TERMS[p.term]), weaponClass: p.weaponClass })
    );
  }), entrances.map((p) => {
    const c = featColor(p);
    const isSel = sel === p.id;
    const isHov = hover === p.id;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: p.id,
        onClick: () => setSel(p.id),
        onMouseEnter: () => setHover(p.id),
        onMouseLeave: () => setHover(null),
        style: { position: "absolute", left: `${p.x / 1100 * 100}%`, top: `${p.y / 1760 * 100}%`, transform: "translate(-50%,-50%)", cursor: "pointer", border: "none", background: "transparent", padding: 0, zIndex: isSel ? 30 : isHov ? 20 : 9 }
      },
      /* @__PURE__ */ React.createElement(EntranceMarker, { neon, color: c, level: p.level, selected: isSel, hovered: isHov, label: t(p.name), term: tt(TERMS[p.term]), weaponClass: p.weaponClass })
    );
  }), showLegend && /* @__PURE__ */ React.createElement(Legend, { open: legendOpen, setOpen: setLegendOpen, uiLang, side: legendSide }));
}
function Marker({ neon, color, icon, selected, hovered, label, term, weaponClass }) {
  const showLabel = selected || hovered;
  const big = selected || hovered;
  const sz = big ? 27 : 22;
  return /* @__PURE__ */ React.createElement("span", { style: { position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" } }, neon && selected && /* @__PURE__ */ React.createElement("span", { className: "lvl-pulse", style: { position: "absolute", width: sz + 14, height: sz + 14, borderRadius: "50%", border: `2px solid ${color}` } }), /* @__PURE__ */ React.createElement("span", { style: {
    width: sz,
    height: sz,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: color,
    borderRadius: neon ? "50%" : 6,
    border: "2px solid #0B0F1A",
    boxShadow: neon ? `0 0 ${big ? 15 : 9}px ${color}, 0 0 0 2px rgba(11,15,26,0.8)` : selected ? `0 0 0 2px ${color}` : "0 2px 7px rgba(0,0,0,0.55)",
    transition: "all .14s ease"
  } }, /* @__PURE__ */ React.createElement(Icon, { name: icon, size: big ? 16 : 13, color: "#0B0F1A", sw: 2.3 })), showLabel && /* @__PURE__ */ React.createElement("span", { style: {
    position: "absolute",
    bottom: "calc(100% + 9px)",
    left: "50%",
    transform: "translateX(-50%)",
    whiteSpace: "nowrap",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    pointerEvents: "none",
    background: "rgba(10,13,22,0.92)",
    border: `1px solid ${color}`,
    borderRadius: neon ? 8 : 3,
    padding: "5px 9px",
    boxShadow: neon ? `0 0 14px ${color}55` : "0 4px 14px rgba(0,0,0,0.5)"
  } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12.5, color: "var(--text-heading)" } }, label), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase", color } }, term, " \xB7 ", weaponClass)));
}
function DetailCard({ f, neon, t, tt, u, onClose }) {
  const layer = layerById[f.layer];
  const c = featColor(f);
  const wc = CLASS_VAR[f.weaponClass];
  const cls = CLASS[f.weaponClass];
  return /* @__PURE__ */ React.createElement("div", { style: glass({ overflow: "hidden", borderColor: `color-mix(in oklab, ${c} 40%, transparent)`, boxShadow: neon ? `0 0 30px ${c}22` : "none" }) }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", aspectRatio: "16/9", background: "#0F1422" } }, /* @__PURE__ */ React.createElement("image-slot", { id: `photo-${f.id}`, shape: "rect", placeholder: `${t(f.name)} \u2014 ${u("photoHint")}`, style: { position: "absolute", inset: 0, width: "100%", height: "100%" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: "56%", pointerEvents: "none", background: "linear-gradient(to top, rgba(8,11,18,0.96), transparent)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 16, right: 52, bottom: 11, pointerEvents: "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 6, padding: "3px 8px", borderRadius: 6, background: "rgba(8,11,18,0.7)", border: `1px solid ${c}` } }, /* @__PURE__ */ React.createElement("span", { style: { width: 17, height: 17, borderRadius: 5, display: "inline-flex", alignItems: "center", justifyContent: "center", background: c } }, /* @__PURE__ */ React.createElement(Icon, { name: layer.icon, size: 11, color: "#0B0F1A", sw: 2.3 })), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "#EAF0F7", whiteSpace: "nowrap" } }, tt(TERMS[f.term]), " \xB7 ", t(layer.label))), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 23, color: "#fff", lineHeight: 1.05, textShadow: "0 2px 10px rgba(0,0,0,0.8)" } }, t(f.name))), /* @__PURE__ */ React.createElement("button", { onClick: onClose, title: u("close"), style: { position: "absolute", top: 11, right: 11, cursor: "pointer", width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(174,199,224,0.22)", background: "rgba(8,11,18,0.7)", color: "#EAF0F7", fontSize: 16, lineHeight: 1 } }, "\xD7")), /* @__PURE__ */ React.createElement("div", { style: { padding: "15px 18px 18px" } }, /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 16px", fontFamily: "var(--font-body)", fontSize: 13.5, lineHeight: 1.62, color: "var(--text-body)" } }, t(f.tip)), /* @__PURE__ */ React.createElement("div", { style: { borderRadius: 12, border: `1px solid color-mix(in oklab, ${wc} 35%, transparent)`, background: `color-mix(in oklab, ${wc} 9%, transparent)`, padding: "13px 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)", marginBottom: 9 } }, u("bestWeapon")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 9 } }, /* @__PURE__ */ React.createElement(ClassBadge, { weaponClass: cls.short, size: "lg" }), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" } }, tt(cls))), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, color: "var(--level-orange)", lineHeight: 1.1 } }, f.build), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 11, paddingTop: 11, borderTop: "1px solid rgba(174,199,224,0.1)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-faint)", marginBottom: 4 } }, u("forStyle")), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--text-secondary)" } }, t(f.playstyle)))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 14 } }, /* @__PURE__ */ React.createElement(Button, { size: "sm", style: { flex: 1 } }, u("equip")), /* @__PURE__ */ React.createElement(Button, { size: "sm", variant: "secondary" }, u("openLoadout")))));
}
function InfoPanel({ tab, setTab, neon, t, tt, u, setSel }) {
  const wc = CLASS_VAR[MAP.bestClass];
  const dicas = FEATURES.filter((f) => f.layer === "dicas");
  const dColor = layerById.dicas.color;
  const tabs = [["prebrief", u("tabPrebrief")], ["items", u("tabItems")], ["dicas", u("tabDicas")]];
  return /* @__PURE__ */ React.createElement("div", { style: glass({ overflow: "hidden" }) }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: 84, background: `radial-gradient(120% 130% at 50% 0%, color-mix(in oklab, ${wc} 20%, transparent), rgba(15,20,34,0.85) 70%)`, display: "flex", alignItems: "flex-end", padding: "0 18px 11px", borderBottom: "1px solid rgba(174,199,224,0.1)" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 25, color: "var(--text-heading)", textShadow: "0 2px 12px rgba(0,0,0,0.6)" } }, MAP.name), /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto" } }, /* @__PURE__ */ React.createElement(ClassBadge, { weaponClass: MAP.bestClass, size: "lg" }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 2, padding: "8px 10px 0", borderBottom: "1px solid rgba(174,199,224,0.1)" } }, tabs.map(([id, label]) => {
    const on = tab === id;
    return /* @__PURE__ */ React.createElement("button", { key: id, onClick: () => setTab(id), style: {
      flex: 1,
      cursor: "pointer",
      border: "none",
      background: "transparent",
      padding: "8px 6px 9px",
      marginBottom: -1,
      borderBottom: `2px solid ${on ? "var(--level-orange)" : "transparent"}`,
      color: on ? "var(--text-heading)" : "var(--text-muted)",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      fontWeight: on ? 700 : 400
    } }, label);
  })), /* @__PURE__ */ React.createElement("div", { style: { padding: "15px 18px 18px" } }, tab === "prebrief" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--level-orange)", marginBottom: 8 } }, u("prebriefTitle")), /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 15px", fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.62, color: "var(--text-body)" } }, t(MAP.prebrief)), /* @__PURE__ */ React.createElement("div", { style: { borderRadius: 12, border: "1px solid rgba(255,152,0,0.25)", background: "rgba(255,152,0,0.07)", padding: "12px 14px", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)", marginBottom: 5 } }, u("yourBuild")), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--level-orange)" } }, MAP.bestBuild), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginTop: 2 } }, tt(CLASS[MAP.bestClass]))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 9, padding: "11px 13px", borderRadius: 11, border: "1px dashed rgba(174,199,224,0.22)" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 8, height: 8, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 7px var(--green)", flex: "none" } }), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-secondary)" } }, u("hintClick")))), tab === "items" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--level-orange)", marginBottom: 12 } }, u("itemsTitle")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 11 } }, MAP.items.map((it, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "start" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 34, height: 34, borderRadius: 9, flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(255,152,0,0.12)", border: "1px solid rgba(255,152,0,0.3)" } }, /* @__PURE__ */ React.createElement(Icon, { name: it.icon, size: 18, color: "var(--level-orange)", sw: 2 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14.5, color: "var(--text-heading)" } }, t(it.name)), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-body)", fontSize: 12.5, lineHeight: 1.5, color: "var(--text-muted)", marginTop: 2 } }, t(it.why))))))), tab === "dicas" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: dColor, marginBottom: 12 } }, u("dicasTitle")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, dicas.map((d) => /* @__PURE__ */ React.createElement("button", { key: d.id, onClick: () => setSel(d.id), style: { cursor: "pointer", textAlign: "left", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 11, alignItems: "center", padding: "10px 12px", borderRadius: 11, border: `1px solid color-mix(in oklab, ${dColor} 30%, transparent)`, background: `color-mix(in oklab, ${dColor} 8%, transparent)` } }, /* @__PURE__ */ React.createElement("span", { style: { width: 28, height: 28, borderRadius: 8, flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", background: dColor } }, /* @__PURE__ */ React.createElement(Icon, { name: "bulb", size: 15, color: "#0B0F1A", sw: 2.2 })), /* @__PURE__ */ React.createElement("span", { style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement("span", { style: { display: "block", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--text-heading)" } }, t(d.name)), /* @__PURE__ */ React.createElement("span", { style: { display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" } }, tt(CLASS[d.weaponClass]), " \xB7 ", d.build)), /* @__PURE__ */ React.createElement("span", { style: { color: dColor, fontFamily: "var(--font-mono)", fontSize: 14 } }, "\u203A")))))));
}
function EntranceMarker({ neon, color, level, selected, hovered, label, term, weaponClass }) {
  const showLabel = selected || hovered;
  const big = selected || hovered;
  const s = big ? 22 : 17;
  const glow = neon ? { filter: `drop-shadow(0 0 ${big ? 7 : 4}px ${color})` } : {};
  return /* @__PURE__ */ React.createElement("span", { style: { position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" } }, level === "upper" ? /* @__PURE__ */ React.createElement("svg", { width: s, height: s, viewBox: "0 0 24 24", style: glow }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "3", width: "18", height: "18", rx: neon ? 4 : 1, fill: `${color}33`, stroke: color, strokeWidth: "2.4" }), /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "3", x2: "12", y2: "21", stroke: color, strokeWidth: "1.8" }), /* @__PURE__ */ React.createElement("line", { x1: "3", y1: "12", x2: "21", y2: "12", stroke: color, strokeWidth: "1.8" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "3.2", fill: "none", stroke: "#0F1422", strokeWidth: "1.6" })) : /* @__PURE__ */ React.createElement("svg", { width: s, height: s, viewBox: "0 0 24 24", style: glow }, /* @__PURE__ */ React.createElement("path", { d: "M5 21 V10 a7 7 0 0 1 14 0 V21 Z", fill: `${color}33`, stroke: color, strokeWidth: "2.4", strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("circle", { cx: "15", cy: "13", r: "1.5", fill: color })), showLabel && /* @__PURE__ */ React.createElement("span", { style: {
    position: "absolute",
    bottom: "calc(100% + 8px)",
    left: "50%",
    transform: "translateX(-50%)",
    whiteSpace: "nowrap",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    pointerEvents: "none",
    background: "rgba(10,13,22,0.92)",
    border: `1px solid ${color}`,
    borderRadius: neon ? 8 : 3,
    padding: "5px 9px",
    boxShadow: neon ? `0 0 14px ${color}55` : "0 4px 14px rgba(0,0,0,0.5)"
  } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12.5, color: "var(--text-heading)" } }, label), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase", color } }, term, " \xB7 ", weaponClass)));
}
const LEG = {
  title: { pt: "Legenda", en: "Legend" },
  vehicles: { pt: "Ve\xEDculos", en: "Vehicles" },
  entries: { pt: "Entradas", en: "Entrances" },
  bus: { pt: "\xD4nibus", en: "Bus" },
  truck: { pt: "Caminh\xE3o", en: "Truck" },
  van: { pt: "Van", en: "Van" },
  car: { pt: "Carro", en: "Car" },
  street: { pt: "Rua", en: "Street" },
  upper: { pt: "1\xBA andar \xB7 sniper", en: "1st floor \xB7 sniper" }
};
function Legend({ open, setOpen, uiLang, side = "left" }) {
  const l = (k) => LEG[k][uiLang];
  const veh = [["bus", "#58C4DC", 26, 11], ["truck", "#FFC857", 24, 12], ["van", "#7CA0C8", 20, 11], ["car", "#AEB6C0", 16, 10]];
  const pos = side === "right" ? { right: 12, bottom: 12 } : { left: 12, bottom: 12 };
  const isStatic = side === "static";
  const wrapStyle = isStatic ? { position: "relative", zIndex: 1, fontFamily: "var(--font-mono)", width: "100%" } : { position: "absolute", ...pos, zIndex: 40, fontFamily: "var(--font-mono)", maxWidth: 224 };
  return /* @__PURE__ */ React.createElement("div", { style: wrapStyle }, /* @__PURE__ */ React.createElement("button", { onClick: () => setOpen(!open), style: { display: "flex", alignItems: "center", gap: 7, cursor: "pointer", border: "1px solid rgba(174,199,224,0.2)", background: "rgba(10,13,22,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", borderRadius: open ? "9px 9px 0 0" : 9, padding: "7px 11px", color: "var(--text-secondary)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 7, height: 7, borderRadius: 2, background: "var(--level-orange)" } }), l("title"), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-faint)" } }, open ? "\u25BE" : "\u25B8")), open && /* @__PURE__ */ React.createElement("div", { style: { border: "1px solid rgba(174,199,224,0.2)", borderTop: "none", background: "rgba(10,13,22,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", borderRadius: "0 9px 9px 9px", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 9 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)" } }, l("vehicles")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 10px" } }, veh.map(([k, col, w, h]) => /* @__PURE__ */ React.createElement("span", { key: k, style: { display: "flex", alignItems: "center", gap: 7 } }, /* @__PURE__ */ React.createElement("span", { style: { width: w, height: h, borderRadius: 3, background: "#5A636E", borderTop: `3px solid ${col}`, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)", flex: "none" } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--text-secondary)" } }, l(k))))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)", marginTop: 2 } }, l("entries")), /* @__PURE__ */ React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 7 } }, /* @__PURE__ */ React.createElement("svg", { width: "15", height: "15", viewBox: "0 0 24 24", style: { flex: "none" } }, /* @__PURE__ */ React.createElement("path", { d: "M5 21 V10 a7 7 0 0 1 14 0 V21 Z", fill: "#34D39933", stroke: "#34D399", strokeWidth: "2.4", strokeLinejoin: "round" })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--text-secondary)", whiteSpace: "nowrap" } }, l("street"))), /* @__PURE__ */ React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 7 } }, /* @__PURE__ */ React.createElement("svg", { width: "15", height: "15", viewBox: "0 0 24 24", style: { flex: "none" } }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "3", width: "18", height: "18", rx: "4", fill: "#C77DFF33", stroke: "#C77DFF", strokeWidth: "2.4" }), /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "3", x2: "12", y2: "21", stroke: "#C77DFF", strokeWidth: "1.8" }), /* @__PURE__ */ React.createElement("line", { x1: "3", y1: "12", x2: "21", y2: "12", stroke: "#C77DFF", strokeWidth: "1.8" })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--text-secondary)", whiteSpace: "nowrap" } }, l("upper")))));
}
function FullView({ neon, dir, setDir, uiLang, setUiLang, techLang, setTechLang, active, toggleLayer, setActive, visibleFeatures, sel, setSel, hover, setHover, selFeature, focusTeam, t, tt, u, allOn, onExit }) {
  const [legOpen, setLegOpen] = React.useState(true);
  return /* @__PURE__ */ React.createElement("div", { style: { height: "100vh", minHeight: "100vh", width: "100%", background: "#0B0F1A", display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: "none", display: "flex", alignItems: "center", gap: 12, padding: "8px 14px", minHeight: 54, background: "rgba(10,13,22,0.9)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: "1px solid rgba(174,199,224,0.1)", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("img", { src: "level-logo.svg", alt: "LEVEL", style: { height: 24, display: "block", flex: "none" } }), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, letterSpacing: "0.04em", color: "var(--text-heading)" } }, MAP.name), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap", flex: 1, justifyContent: "center" } }, LAYERS.map((l) => {
    const on = active.has(l.id);
    return /* @__PURE__ */ React.createElement("button", { key: l.id, onClick: () => toggleLayer(l.id), title: t(l.label), style: {
      width: 34,
      height: 34,
      borderRadius: 9,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: on ? l.color2 ? `linear-gradient(135deg, ${l.color} 50%, ${l.color2} 50%)` : l.color : "rgba(174,199,224,0.07)",
      border: `1.5px solid ${on ? l.color : "rgba(174,199,224,0.18)"}`,
      boxShadow: on && neon ? `0 0 9px ${l.color}` : "none",
      opacity: on ? 1 : 0.6,
      transition: "all .14s ease"
    } }, /* @__PURE__ */ React.createElement(Icon, { name: l.icon, size: 16, color: on ? "#0B0F1A" : l.color, sw: 2.2 }));
  }), /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", gap: 5, marginLeft: 4 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setActive(new Set(LAYERS.map((l) => l.id))), style: miniBtn(allOn) }, u("showAll")), /* @__PURE__ */ React.createElement("button", { onClick: () => setActive(/* @__PURE__ */ new Set()), style: miniBtn(false) }, u("clear")))), /* @__PURE__ */ React.createElement(Seg, { value: dir, onChange: setDir, options: [{ value: "A", label: u("dirA") }, { value: "B", label: u("dirB") }] }), /* @__PURE__ */ React.createElement(LangDropdown, { uiLang, setUiLang, techLang, setTechLang, u }), /* @__PURE__ */ React.createElement("span", { style: { width: 1, height: 26, background: "rgba(174,199,224,0.18)", margin: "0 2px", flex: "none" } }), /* @__PURE__ */ React.createElement("button", { onClick: postCloseMap, title: u("backToMaps"), style: { display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", border: "none", background: "var(--level-orange)", color: "#1A1206", borderRadius: 8, padding: "7px 12px", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", flex: "none" } }, "\u2039 ", u("backToMaps")), /* @__PURE__ */ React.createElement("button", { onClick: () => onExit && onExit(), title: u("exit"), style: { cursor: "pointer", width: 34, height: 34, borderRadius: 8, border: "1px solid rgba(231,76,60,0.4)", background: "rgba(231,76,60,0.12)", color: "var(--red)", fontSize: 16, lineHeight: 1, flex: "none" } }, "\xD7")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minHeight: 0, display: "flex", alignItems: "stretch", justifyContent: "center", gap: 14, padding: 14, position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: "0 1 auto", minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" } }, /* @__PURE__ */ React.createElement(MapCanvas, { neon, active, visibleFeatures, sel, setSel, hover, setHover, t, tt, uiLang, focusTeam, fit: true, showLegend: false })), /* @__PURE__ */ React.createElement("div", { style: { flex: "none", width: selFeature ? 340 : 240, maxWidth: "38%", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", maxHeight: "100%" } }, selFeature && /* @__PURE__ */ React.createElement(DetailCard, { f: selFeature, neon, t, tt, u, onClose: () => setSel(null) }), /* @__PURE__ */ React.createElement(Legend, { open: legOpen, setOpen: setLegOpen, uiLang, side: "static" }))));
}
window.MapasInterativo = MapasInterativo;
