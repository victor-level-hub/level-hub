/* ═════════ MOTION · scroll-reveal (v2.43.0) ═════════
   data-reveal="fade-up|fade-in|scale-in" (um elemento) ou data-reveal-stagger
   (container que revela os filhos em cascata, data-stagger ms). count-up em
   [data-count]. Base visível; só arma escondido com .reveal-ready (via JS). */
(function () {
  'use strict';
  var reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var io = null;

  function countUp(node) {
    if (node._countDone) return; node._countDone = true;
    var target = parseInt(node.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    var suffix = node.getAttribute('data-suffix') || '';
    if (reduced) { node.textContent = target + suffix; return; }
    var fb = setTimeout(function () { node.textContent = target + suffix; }, 1100);
    var dur = 900, t0 = null;
    function tick(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(target * e) + suffix;
      if (p < 1) requestAnimationFrame(tick); else clearTimeout(fb);
    }
    requestAnimationFrame(tick);
  }

  // countTo: anima a contagem até um alvo dado em runtime (não via data-count).
  // Para readouts dinâmicos que chegam async (ex: Home) — resolve a corrida que
  // impedia o count-up de ligar aos números reais. Conta do valor atual ao alvo.
  function countTo(node, target, opts) {
    if (!node) return;
    target = parseInt(target, 10);
    if (isNaN(target)) return;
    opts = opts || {};
    var suffix = opts.suffix || '';
    if (reduced) { node.textContent = target + suffix; return; }
    var cur = String(node.textContent || '').replace(/[^0-9]/g, '');
    var start = cur === '' ? 0 : parseInt(cur, 10);
    if (start === target) { node.textContent = target + suffix; return; }
    var dur = opts.dur || 900, t0 = null;
    var fb = setTimeout(function () { node.textContent = target + suffix; }, dur + 200);
    function tick(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(start + (target - start) * e) + suffix;
      if (p < 1) requestAnimationFrame(tick); else clearTimeout(fb);
    }
    requestAnimationFrame(tick);
  }

  function revealEl(el) {
    if (el.hasAttribute('data-reveal-stagger')) {
      var step = parseInt(el.getAttribute('data-stagger') || '70', 10);
      var kids = el.children;
      for (var i = 0; i < kids.length; i++) kids[i].style.transitionDelay = (i * step) + 'ms';
    }
    el.classList.add('in');
    el.querySelectorAll('[data-count]').forEach(countUp);
    if (el.hasAttribute('data-count')) countUp(el);
    setTimeout(function () { el.classList.add('settled'); }, 700);
  }

  function settleAll() {
    document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach(function (el) { el.classList.add('settled'); });
    document.querySelectorAll('[data-count]').forEach(function (n) {
      if (!n._countDone) { n._countDone = true; n.textContent = (n.getAttribute('data-count') || '') + (n.getAttribute('data-suffix') || ''); }
    });
  }

  function init() {
    document.body.classList.add('reveal-ready');
    var targets = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
    if (reduced || !('IntersectionObserver' in window) || !targets.length) { settleAll(); return; }
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { revealEl(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });
    // segurança global: nunca deixar conteúdo preso invisível
    setTimeout(settleAll, 2200);
  }

  // Re-arma o reveal de uma seção quando ela fica ativa (display:none → block).
  // Sem isto, o settleAll global (2.2s) congela tudo visível e as seções abertas
  // depois desse limite nunca animavam. Cada seção faz a sua entrada ao ser aberta.
  function rearm(root) {
    if (!root) return;
    var els = root.querySelectorAll('[data-reveal], [data-reveal-stagger]');
    if (!els.length) return;
    if (reduced || !io) { els.forEach(function (el) { el.classList.add('settled'); }); return; }
    els.forEach(function (el) {
      io.unobserve(el);
      el.classList.remove('in', 'settled');
      if (el.hasAttribute('data-reveal-stagger')) {
        var k = el.children;
        for (var i = 0; i < k.length; i++) k[i].style.transitionDelay = '';
      }
    });
    void root.offsetWidth; // commit do estado escondido antes de re-observar
    els.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.LevelReveal = { reveal: revealEl, settleAll: settleAll, rearm: rearm, countTo: countTo };
})();
