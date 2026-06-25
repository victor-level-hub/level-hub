/* ============================================================
   Shim do Design System para a ilha de Mapas Interativos.
   Recria SÓ o que o app.jsx usa: Button, Badge, ClassBadge.
   Plain JS (React.createElement) — não precisa de Babel.
   Exposto como window.LEVELDesignSystem_3a808b (nome esperado).
   ============================================================ */
(function () {
  var h = React.createElement;
  var CLASS_COLOR = {
    AR: 'var(--class-ar)', SMG: 'var(--class-smg)', SNP: 'var(--class-sniper)',
    SNIPER: 'var(--class-sniper)', LMG: 'var(--class-lmg)',
    MAR: 'var(--class-marksman)', MARKSMAN: 'var(--class-marksman)',
  };
  function classColor(code) { return CLASS_COLOR[String(code || '').toUpperCase()] || 'var(--text-muted)'; }

  function Button(props) {
    props = props || {};
    var size = props.size || 'md';
    var variant = props.variant || 'primary';
    var base = {
      cursor: 'pointer', borderRadius: 10, padding: size === 'sm' ? '8px 14px' : '11px 18px',
      fontFamily: 'var(--font-mono)', fontSize: size === 'sm' ? 12 : 13.5, letterSpacing: '0.04em',
      textTransform: 'uppercase', fontWeight: 700, transition: 'all .14s ease',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, lineHeight: 1,
    };
    var look = variant === 'secondary'
      ? { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid rgba(174,199,224,0.25)' }
      : { background: 'var(--level-orange)', color: '#1A1206', border: '1px solid var(--level-orange)' };
    var style = Object.assign({}, base, look, props.style || {});
    return h('button', { onClick: props.onClick, title: props.title, style: style }, props.children);
  }

  function Badge(props) {
    props = props || {};
    var c = props.color || 'var(--text-muted)';
    var style = Object.assign({
      display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 6,
      fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
      color: c, border: '1px solid ' + c, background: 'color-mix(in oklab, ' + c + ' 12%, transparent)',
    }, props.style || {});
    return h('span', { style: style }, props.children);
  }

  function ClassBadge(props) {
    props = props || {};
    var code = String(props.weaponClass || '').toUpperCase();
    var c = classColor(code);
    var lg = props.size === 'lg';
    var style = {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: lg ? 40 : 32, height: lg ? 28 : 22, padding: '0 9px', borderRadius: 7,
      fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: lg ? 13 : 11, letterSpacing: '0.06em',
      color: '#0B0F1A', background: c,
      boxShadow: '0 0 10px color-mix(in oklab, ' + c + ' 55%, transparent)',
    };
    return h('span', { style: style }, code);
  }

  window.LEVELDesignSystem_3a808b = { Button: Button, Badge: Badge, ClassBadge: ClassBadge };
})();
