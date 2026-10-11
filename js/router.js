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
    { pattern: /^#\/dashboard\/?$/,              view: 'dashboard' },
    { pattern: /^#\/users\/?$/,                  view: 'users' },
    { pattern: /^#\/login\/?$/,                  view: 'login' }
  ];

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

    // Active nav link + role-based visibility (hide links the role can't open).
    var map = { home: 'home', wishlist: 'wishlist', cart: 'cart', profile: 'profile', dashboard: 'dashboard', users: 'users' };
    var activeKey = map[viewName];
    window.Travee.$$('#site-header [data-nav]').forEach(function (a) {
      var key = a.getAttribute('data-nav');
      a.classList.toggle('active', key === activeKey);
      var view = a.getAttribute('data-view') || key;
      var allowed = window.TraveeState.canAccess(view);
      a.hidden = !allowed;
      a.classList.toggle('hidden', !allowed);
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
    // Guests can only see the login screen.
    if (!window.TraveeState.isAuthed()) {
      if (r.view !== 'login') {
        if (current !== 'login') { window.location.hash = '#/login'; }
        return;
      }
      current = 'login';
      renderView('login', r.params);
      return;
    }
    // Logged-in users shouldn't linger on login — send them to their role home.
    if (r.view === 'login') {
      window.location.hash = window.TraveeState.roleHome();
      return;
    }
    // Role guard: bounce to the role's home if this view isn't allowed.
    if (!window.TraveeState.canAccess(r.view)) {
      window.location.hash = window.TraveeState.roleHome();
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
        // Only open the detail page if this role may see it (admin does not).
        if (!window.TraveeState.canAccess('detail')) return;
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
