/* ============================================================
   Travee — router.js
   Hash-based SPA router with auth guarding and view transitions.
   ============================================================ */
(function () {
  'use strict';

  var routes = [
    { pattern: /^#\/$/,                          view: 'home' },
    { pattern: /^#\/destination\/([\w-]+)\/?$/,  view: 'detail' },
    { pattern: /^#\/cart\/?$/,                   view: 'cart' },
    { pattern: /^#\/checkout\/?$/,               view: 'checkout' },
    { pattern: /^#\/confirmation\/([\w-]+)\/?$/, view: 'confirmation' },
    { pattern: /^#\/wishlist\/?$/,               view: 'wishlist' },
    { pattern: /^#\/profile\/?$/,                view: 'profile' },
    { pattern: /^#\/login\/?$/,                  view: 'login' }
  ];

  // Views that require a logged-in user.
  var PROTECTED = { home: 1, detail: 1, cart: 1, checkout: 1, confirmation: 1, wishlist: 1, profile: 1 };

  var current = null;

  function parseHash() {
    var h = window.location.hash || '';
    if (h === '' || h === '#') h = '#/';
    for (var i = 0; i < routes.length; i++) {
      var m = h.match(routes[i].pattern);
      if (m) return { view: routes[i].view, params: m.slice(1) };
    }
    return { view: 'home', params: [] };
  }

  function renderView(viewName, params) {
    var viewEl = window.Travee.$('#view');
    if (!viewEl) return;
    var view = window.Views[viewName];
    if (!view) { view = window.Views.home; }
    viewEl.classList.remove('fade-in');
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (view.render) viewEl.innerHTML = view.render(params);
    if (view.mount) { try { view.mount(params); } catch (e) { console.error(e); } }
    // Re-trigger entrance animation.
    void viewEl.offsetWidth;
    viewEl.classList.add('fade-in');
    updateChrome(viewName);
  }

  function updateChrome(viewName) {
    var header = window.Travee.$('#site-header');
    var footer = window.Travee.$('#site-footer');
    var authed = window.TraveeState.isAuthed();
    var showShell = authed && viewName !== 'login';

    header.hidden = !showShell;
    header.classList.toggle('hidden', !showShell);
    footer.hidden = !showShell;
    footer.classList.toggle('hidden', !showShell);
    var logoutBtn = window.Travee.$('#logout-btn');
    logoutBtn.hidden = !authed;
    logoutBtn.classList.toggle('hidden', !authed);

    // Active nav link.
    var map = { home: 'home', wishlist: 'wishlist', cart: 'cart', profile: 'profile' };
    var activeKey = map[viewName];
    window.Travee.$$('#site-header [data-nav]').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-nav') === activeKey);
    });
    refreshBars();
  }

  function refreshBars() {
    var info = window.TraveeState.cartInfo();
    var badge = window.Travee.$('#cart-badge');
    if (info.count > 0) {
      badge.textContent = info.count;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
      badge.textContent = '';
    }
    var pts = window.Travee.$('#points-balance');
    if (pts) pts.textContent = window.TraveeState.state.points;
  }

  // Public: bump the cart badge animation (called after adding to cart).
  window.bumpCartBadge = function () {
    var badge = window.Travee.$('#cart-badge');
    if (!badge) return;
    badge.classList.remove('bump');
    void badge.offsetWidth;
    badge.classList.add('bump');
  };

  function navigate() {
    var r = parseHash();
    // Auth guard.
    if (PROTECTED[r.view] && !window.TraveeState.isAuthed()) {
      if (current !== 'login') { window.location.hash = '#/login'; }
      return;
    }
    // Logged-in users shouldn't linger on login.
    if (r.view === 'login' && window.TraveeState.isAuthed()) {
      window.location.hash = '#/';
      return;
    }
    current = r.view;
    renderView(r.view, r.params);
  }

  function init() {
    window.addEventListener('hashchange', navigate);
    // Delegated click handler for destination cards (works for async-loaded grids).
    document.addEventListener('click', function (e) {
      var card = e.target.closest('.dcard');
      if (card && !e.target.closest('a') && !e.target.closest('button')) {
        window.location.hash = '#/destination/' + card.getAttribute('data-id');
      }
    });
    // Ensure an initial hash.
    if (!window.location.hash) { window.location.hash = '#/'; }
    navigate();
  }

  window.Router = { init: init, navigate: navigate, renderView: renderView, refreshBars: refreshBars };

  // Keep the header bars in sync whenever state changes.
  window.TraveeState.subscribe(function () { refreshBars(); });
})();
