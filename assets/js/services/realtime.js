// ===================================================================
// LEVEL · services/realtime.js (v2.74.0)
// "Nunca ver dado velho" sem perder a velocidade do cache local.
//
// Estratégia: Realtime como NOTIFICAÇÃO, não como transporte de dados.
//   - Um trigger no Postgres bompa a tabela `sync_state` (só user_id + timestamp,
//     anon-readable, ZERO dado sensível) em qualquer mudança nas hub_* do user.
//   - Este módulo assina sync_state (filtrado ao MEU user) e, ao detetar bump,
//     dispara o CloudSync.pullAll() existente (busca segura via edge function,
//     service-role) e re-renderiza os painéis. As hub_* (edge-only RLS) nunca são
//     expostas ao Realtime.
//   - Rede de segurança: re-pull no foco/visibilidade da aba.
//
// É AGNÓSTICO AO LAYOUT: não depende de IDs/markup — só chama pullAll + dispara
// os eventos/render que o app já tem. Um redesign de tela não o quebra.
// ===================================================================
(function () {
  'use strict';

  var SUPABASE_URL = (window.CloudSync && window.CloudSync.SUPABASE_URL) || 'https://cqkhqtgmolmrfgzozocr.supabase.co';
  var ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxa2hxdGdtb2xtcmZnem96b2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTEwODksImV4cCI6MjA5MzcyNzA4OX0.ets0bgps9n5F4orIAd96iY6bj9R5VgumtgNCm-ui-ck';

  var client = null, channel = null, myUserId = null, started = false;
  var refreshTimer = null, lastRefresh = 0;

  function localId() {
    try {
      if (window.CloudSync && window.CloudSync.getOrCreateLocalId) return window.CloudSync.getOrCreateLocalId();
      return localStorage.getItem('level.sync.local_id') || null;
    } catch (e) { return null; }
  }

  async function resolveUserId() {
    var lid = localId();
    if (!lid) return null;
    try {
      var r = await fetch(SUPABASE_URL + '/rest/v1/hub_users?select=id&local_id=eq.' + encodeURIComponent(lid) + '&limit=1', {
        headers: { 'Authorization': 'Bearer ' + ANON_KEY, 'apikey': ANON_KEY }
      });
      if (!r.ok) return null;
      var arr = await r.json();
      return (Array.isArray(arr) && arr.length) ? arr[0].id : null;
    } catch (e) { return null; }
  }

  // pullAll (cloud→local, seguro) + re-render dos painéis. É a MESMA função usada
  // no auto-pull de login, então é segura (LWW). Throttle evita storms de eco.
  async function refresh(reason) {
    var now = Date.now();
    if (now - lastRefresh < 1500) return;
    lastRefresh = now;
    if (!(window.CloudSync && typeof window.CloudSync.pullAll === 'function')) return;
    try {
      await window.CloudSync.pullAll();
      // Re-render dos painéis conhecidos (tudo guardado — nunca quebra)
      try { if (window.LevelEtapa7 && window.LevelEtapa7.renderSidebarAvatar) await window.LevelEtapa7.renderSidebarAvatar(); } catch (e) {}
      try { if (typeof window.renderOperatorPanel === 'function') window.renderOperatorPanel(); } catch (e) {}
      try { if (typeof window.renderCloudSyncStatus === 'function') window.renderCloudSyncStatus(); } catch (e) {}
      // Eventos que os renderers do app escutam (home, builds, loadouts, weapons)
      try { document.dispatchEvent(new Event('level:builds-change')); } catch (e) {}
      try { window.dispatchEvent(new CustomEvent('level-loadouts-changed', { detail: { source: 'realtime' } })); } catch (e) {}
    } catch (e) {
      // pullAll exige sessão; se não houver (deslogado/expirado), ignora em silêncio.
      if (e && e.message && e.message.indexOf('sessão') === -1) console.warn('[realtime] refresh falhou:', e.message);
    }
  }

  function scheduleRefresh(reason) {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () { refreshTimer = null; refresh(reason); }, 700);
  }

  async function start() {
    if (started) return;
    myUserId = await resolveUserId();
    if (!myUserId) return; // ainda sem identidade (não logado / sem backup) — tenta depois
    started = true;
    try {
      var mod = await import('https://esm.sh/@supabase/supabase-js@2.45.4');
      client = mod.createClient(SUPABASE_URL, ANON_KEY, { realtime: { params: { eventsPerSecond: 2 } } });
      channel = client
        .channel('sync-' + String(myUserId).slice(0, 8))
        .on('postgres_changes', {
          event: '*', schema: 'public', table: 'sync_state',
          filter: 'user_id=eq.' + myUserId
        }, function () { scheduleRefresh('db'); })
        .subscribe(function (status) {
          if (status === 'SUBSCRIBED') console.log('[realtime] sync_state inscrito · user=' + String(myUserId).slice(0, 8));
        });

      // Rede de segurança: re-pull ao voltar o foco / aba ficar visível.
      window.addEventListener('focus', function () { scheduleRefresh('focus'); });
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') scheduleRefresh('visible');
      });
    } catch (e) {
      started = false; // permite re-tentar
      console.warn('[realtime] falha ao iniciar (silencioso):', e && e.message);
    }
  }

  // Boot: tenta iniciar; re-tenta a cada 4s até resolver a identidade (após login).
  async function boot() {
    if (started) return;
    await start();
    if (!started) setTimeout(boot, 4000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 1500); });
  } else {
    setTimeout(boot, 1500);
  }

  // Exposto p/ debug + para o re-pull manual.
  window.LevelRealtime = { start: start, refresh: function () { return refresh('manual'); }, status: function () { return { started: started, userId: myUserId }; } };
})();
