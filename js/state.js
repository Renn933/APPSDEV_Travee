/* ============================================================
   Travee — state.js
   Single source of truth, persisted to localStorage.
   Holds: auth, cart, wishlist, bookings, points, filters.
   ============================================================ */
(function () {
  'use strict';
  var DATA_KEY = 'travee_state_v2';

  var state = {
    user: null,          // current session { username, name, role, avatar }
    users: [],           // account directory [{ username, password, role, name }]
    cart: [],            // [{ id, destId, pkgId, pkgLabel, date, travelers, unit, mult }]
    wishlist: [],        // [ destId, ... ]
    bookings: [],        // [{ id, ref, items, total, pointsEarned, date, status, traveler }]
    points: 0,           // spendable balance
    lifetime: 0,         // all-time earned (drives loyalty tier)
    destinations: null,  // live Explore catalog (seeded from data.js on load)
    filters: { search: '', category: 'all', sort: 'popular', maxPrice: 50000, scope: 'all' }
  };

  var listeners = [];

  /* Built-in accounts, seeded on first run. Passwords are plaintext because
     this is a browser-only demo — there is no server and no real security. */
  var SEED_USERS = [
    { username: 'admin',        password: 'admin123', role: 'admin',        name: 'Avery Santos' },
    { username: 'receptionist', password: 'recep123', role: 'receptionist', name: 'Rico Cruz' },
    { username: 'dashboard',    password: 'dash123',  role: 'dashboard',    name: 'Dana Lim' }
  ];

  function load() {
    try {
      var raw = localStorage.getItem(DATA_KEY);
      if (raw) Object.assign(state, JSON.parse(raw));
    } catch (e) { /* corrupted storage — start fresh */ }
    if (!Array.isArray(state.cart)) state.cart = [];
    if (!Array.isArray(state.wishlist)) state.wishlist = [];
    if (!Array.isArray(state.bookings)) state.bookings = [];
    /* Seed the built-in accounts on first run (or if the directory was wiped). */
    if (!Array.isArray(state.users) || !state.users.length) {
      state.users = SEED_USERS.map(function (u) { return Object.assign({}, u); });
    }
    /* Seed the Explore catalog from the static data on first run. */
    if (!Array.isArray(state.destinations)) {
      var seed = (window.TraveeData && window.TraveeData.DESTINATIONS) || [];
      state.destinations = seed.map(function (d) { return Object.assign({}, d); });
    }
    /* Older sessions stored { name, email, role } with no username — that shape
       no longer authenticates, so drop it and force a fresh sign-in. */
    if (state.user && !state.user.username) state.user = null;
  }
  load();

  function save() {
    try { localStorage.setItem(DATA_KEY, JSON.stringify(state)); }
    catch (e) { /* storage full/unavailable — non-fatal */ }
    emit();
  }

  function emit() {
    for (var i = 0; i < listeners.length; i++) { try { listeners[i](); } catch (e) {} }
  }
  function subscribe(fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (x) { return x !== fn; }); }; }

  /* ---------- auth (credential-based accounts) ---------- */
  function normalizeUsername(u) { return String(u == null ? '' : u).trim().toLowerCase(); }

  function findUser(username) {
    var u = normalizeUsername(username);
    for (var i = 0; i < state.users.length; i++) {
      if (state.users[i].username === u) return state.users[i];
    }
    return null;
  }

  /* Sign in against the account directory. Returns { ok, error }. */
  function signIn(username, password) {
    var acct = findUser(username);
    if (!acct) return { ok: false, error: 'No account with that username.' };
    if (acct.password !== password) return { ok: false, error: 'Incorrect password.' };
    startSession(acct);
    return { ok: true };
  }

  /* Self-signup always creates a plain traveler. Returns { ok, error }. */
  function signUp(name, username, password) {
    var u = normalizeUsername(username);
    if (u.length < 3) return { ok: false, error: 'Username must be at least 3 characters.' };
    if (findUser(u)) return { ok: false, error: 'That username is already taken.' };
    if (!password || password.length < 4) return { ok: false, error: 'Password must be at least 4 characters.' };
    var acct = { username: u, password: password, role: 'traveler', name: (name || u) };
    state.users.push(acct);
    save();
    startSession(acct);
    return { ok: true };
  }

  /* Admin-only: create an account with any role. Returns { ok, error }. */
  function createUser(name, username, password, role) {
    if (!can('manage_users')) return { ok: false, error: 'Only an admin can create users.' };
    var u = normalizeUsername(username);
    if (u.length < 3) return { ok: false, error: 'Username must be at least 3 characters.' };
    if (findUser(u)) return { ok: false, error: 'That username is already taken.' };
    if (!password || password.length < 4) return { ok: false, error: 'Password must be at least 4 characters.' };
    var roleId = (window.TraveeRoles && window.TraveeRoles.ROLES[role]) ? role : 'traveler';
    state.users.push({ username: u, password: password, role: roleId, name: (name || u) });
    save();
    return { ok: true };
  }

  /* Admin-only: remove an account (can't remove the built-in admin or yourself). */
  function deleteUser(username) {
    if (!can('manage_users')) return { ok: false, error: 'Only an admin can remove users.' };
    var u = normalizeUsername(username);
    if (u === 'admin') return { ok: false, error: 'The built-in admin account can’t be removed.' };
    if (state.user && state.user.username === u) return { ok: false, error: 'You can’t remove your own account.' };
    var before = state.users.length;
    state.users = state.users.filter(function (a) { return a.username !== u; });
    if (state.users.length === before) return { ok: false, error: 'Account not found.' };
    save();
    return { ok: true };
  }

  function listUsers() {
    return state.users.map(function (a) {
      return { username: a.username, name: a.name, role: a.role };
    });
  }

  function startSession(acct) {
    state.user = {
      username: acct.username, name: acct.name, role: acct.role,
      avatar: (acct.name || acct.username || 'T').trim()[0].toUpperCase()
    };
    save();
  }
  function logout() {
    state.user = null;
    save();
  }
  function isAuthed() { return !!state.user; }

  /* ---------- roles & permissions ---------- */
  function currentRole() {
    if (!window.TraveeRoles || !state.user) return null;
    return window.TraveeRoles.getRole(state.user.role);
  }
  /* Can the signed-in user open this view? (login is always allowed.) */
  function canAccess(view) {
    if (view === 'login') return true;
    if (!state.user) return false;
    return !!(window.TraveeRoles && window.TraveeRoles.canAccess(state.user.role, view));
  }
  /* Does the current role hold a capability (e.g. manage_bookings)? */
  function can(cap) {
    var r = currentRole();
    return !!(r && r.caps && r.caps.indexOf(cap) >= 0);
  }
  /* Home route for the current user's role (used for post-login redirects). */
  function roleHome() {
    var r = currentRole();
    return r ? r.home : '#/';
  }

  /* ---------- cart ---------- */
  function addToCart(destId, pkgId, date, travelers) {
    var d = window.TraveeData.getDestination(destId);
    if (!d) return null;
    var pkg = null;
    for (var i = 0; i < window.TraveeData.PACKAGES.length; i++) if (window.TraveeData.PACKAGES[i].id === pkgId) pkg = window.TraveeData.PACKAGES[i];
    if (!pkg) pkg = window.TraveeData.PACKAGES[0];
    var unit = window.TraveeData.packagePrice(d.price, pkg.mult);
    var item = {
      id: window.Travee.uid('cart'),
      destId: destId, destName: d.name, destCountry: d.country, art: d.art, photo: d.photo,
      code: d.code, scope: d.scope,
      cat: d.cat, pkgId: pkg.id, pkgLabel: pkg.label,
      date: date, travelers: travelers || 1, unit: unit
    };
    state.cart.push(item);
    save();
    return item;
  }
  function removeFromCart(id) { state.cart = state.cart.filter(function (i) { return i.id !== id; }); save(); }
  function updateCartTravelers(id, delta) {
    for (var i = 0; i < state.cart.length; i++) {
      if (state.cart[i].id === id) {
        state.cart[i].travelers = Math.max(1, Math.min(9, state.cart[i].travelers + delta));
        save(); return;
      }
    }
  }
  function clearCart() { state.cart = []; save(); }
  function cartInfo() {
    var subtotal = 0;
    for (var i = 0; i < state.cart.length; i++) subtotal += state.cart[i].unit * state.cart[i].travelers;
    return { count: state.cart.length, subtotal: subtotal };
  }

  /* ---------- wishlist ---------- */
  function toggleWishlist(destId) {
    var idx = state.wishlist.indexOf(destId);
    if (idx >= 0) state.wishlist.splice(idx, 1); else state.wishlist.push(destId);
    save();
    return idx < 0;
  }
  function isWishlisted(destId) { return state.wishlist.indexOf(destId) >= 0; }

  /* ---------- coupons ---------- */
  function applyDiscount(subtotal, code) {
    var c = window.TraveeData.COUPONS[(code || '').trim().toUpperCase()];
    if (!c) return null;
    if (c.type === 'percent') return subtotal * c.value;
    return Math.min(c.value, subtotal);
  }
  /* ---------- bookings ---------- */
  function placeBooking(items, traveler, discountAmount) {
    var subtotal = 0;
    for (var i = 0; i < items.length; i++) subtotal += items[i].unit * items[i].travelers;
    var total = Math.max(0, subtotal - (discountAmount || 0));
    var pointsEarned = Math.round(total / 10) + 20;
    var booking = {
      id: window.Travee.uid('bk'),
      ref: 'TRV-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
      items: items.map(function (it) { return Object.assign({}, it); }),
      subtotal: subtotal, discount: discountAmount || 0, total: total,
      pointsEarned: pointsEarned, created: new Date().toISOString(),
      status: 'confirmed', boarding: false, traveler: traveler
    };
    state.bookings.unshift(booking);
    state.points += pointsEarned;
    state.lifetime += pointsEarned;
    state.cart = [];
    save();
    return booking;
  }
  function getBooking(id) {
    for (var i = 0; i < state.bookings.length; i++) if (state.bookings[i].id === id) return state.bookings[i];
    return null;
  }
  function cancelBooking(id) {
    var b = getBooking(id);
    if (!b || b.status !== 'confirmed') return false;
    b.status = 'cancelled';
    b.boarding = false;
    if (state.lifetime >= b.pointsEarned) state.lifetime -= b.pointsEarned;
    state.points = Math.max(0, state.points - b.pointsEarned);
    save();
    return true;
  }

  /* Staff (manage_bookings) flip a confirmed flight between Available and Boarding.
     Cancelled flights can't board. Returns { ok, error }. */
  function setBoarding(id, boarding) {
    if (!can('manage_bookings')) return { ok: false, error: 'You can’t change flight status.' };
    var b = getBooking(id);
    if (!b) return { ok: false, error: 'Booking not found.' };
    if (b.status !== 'confirmed') return { ok: false, error: 'Only confirmed flights can board.' };
    b.boarding = !!boarding;
    save();
    return { ok: true };
  }

  /* One-line status label for a flight on the board. */
  function flightStatus(b) {
    if (!b) return 'cancelled';
    if (b.status === 'cancelled') return 'cancelled';
    return b.boarding ? 'boarding' : 'available';
  }

  /* ---------- loyalty ---------- */
  function loyaltyInfo() {
    var tiers = window.TraveeData.TIERS;
    var current = tiers[0], next = null, idx = 0;
    for (var i = 0; i < tiers.length; i++) {
      if (state.lifetime >= tiers[i].threshold) { current = tiers[i]; idx = i; }
    }
    if (idx < tiers.length - 1) next = tiers[idx + 1];
    var progress = next ? Math.min(100, Math.round(((state.lifetime - current.threshold) / (next.threshold - current.threshold)) * 100)) : 100;
    return { tier: current, next: next, progress: progress };
  }

  /* ---------- filters ---------- */
  function setFilters(patch) { Object.assign(state.filters, patch); save(); }
  function resetFilters() {
    state.filters = { search: '', category: 'all', sort: 'popular', maxPrice: 50000, scope: 'all' };
    save();
  }
  function filteredDestinations() {
    var f = state.filters;
    var list = allDestinations().filter(function (d) {
      var okSearch = !f.search || (d.name + ' ' + d.country + ' ' + d.tagline).toLowerCase().indexOf(f.search.toLowerCase()) >= 0;
      var okCat = !f.category || f.category === 'all' || d.cat === f.category;
      var okScope = !f.scope || f.scope === 'all' || d.scope === f.scope;
      var okPrice = d.price <= (f.maxPrice || 5000);
      return okSearch && okCat && okScope && okPrice;
    });
    switch (f.sort) {
      case 'price-asc': list.sort(function (a, b) { return a.price - b.price; }); break;
      case 'price-desc': list.sort(function (a, b) { return b.price - a.price; }); break;
      case 'rating': list.sort(function (a, b) { return b.rating - a.rating; }); break;
      default: list.sort(function (a, b) { return b.pop - a.pop; });
    }
    return list;
  }

  /* ---------- destinations (admin CRUD on Explore catalog) ---------- */
  function allDestinations() {
    if (!Array.isArray(state.destinations)) state.destinations = [];
    return state.destinations;
  }
  function getDestination(id) {
    var list = allDestinations();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  /* Build a normalized destination record from form input. */
  function normalizeDest(data, existingId) {
    var name = String(data.name || '').trim();
    var id = existingId || String(data.id || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return {
      id: id,
      name: name,
      city: String(data.city || '').trim() || name,
      country: String(data.country || '').trim(),
      scope: data.scope === 'international' ? 'international' : 'domestic',
      cat: String(data.cat || 'luzon'),
      code: String(data.code || '').trim().toUpperCase().slice(0, 3),
      rating: Math.max(0, Math.min(5, Number(data.rating) || 4.5)),
      price: Math.max(0, Math.round(Number(data.price) || 0)),
      duration: Math.max(0, Math.round(Number(data.duration) || 0)),
      pop: Math.max(0, Math.round(Number(data.pop) || 50)),
      airline: String(data.airline || '').trim(),
      art: String(data.art || '').trim() || 'plane',
      photo: String(data.photo || '').trim(),
      tagline: String(data.tagline || '').trim(),
      description: String(data.description || '').trim(),
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      bestSeason: String(data.bestSeason || '').trim()
    };
  }

  /* Create a destination. Returns { ok, error, id }. */
  function createDestination(data) {
    if (!can('manage_destinations')) return { ok: false, error: 'Only an admin can manage destinations.' };
    var rec = normalizeDest(data, null);
    if (rec.name.length < 2) return { ok: false, error: 'Destination name must be at least 2 characters.' };
    if (!rec.id) return { ok: false, error: 'Could not build an id from that name.' };
    if (getDestination(rec.id)) return { ok: false, error: 'A destination with that id already exists.' };
    allDestinations().push(rec);
    save();
    return { ok: true, id: rec.id };
  }

  /* Update an existing destination (id is kept stable). Returns { ok, error }. */
  function updateDestination(id, data) {
    if (!can('manage_destinations')) return { ok: false, error: 'Only an admin can manage destinations.' };
    var rec = getDestination(id);
    if (!rec) return { ok: false, error: 'Destination not found.' };
    /* Merge over the existing record first so fields the form doesn't send
       (anything added later) are preserved rather than reset. */
    var next = normalizeDest(Object.assign({}, rec, data), rec.id);
    if (next.name.length < 2) return { ok: false, error: 'Destination name must be at least 2 characters.' };
    Object.assign(rec, next);
    save();
    return { ok: true };
  }

  /* Delete a destination and drop it from saved/cart so nothing dangles. */
  function deleteDestination(id) {
    if (!can('manage_destinations')) return { ok: false, error: 'Only an admin can manage destinations.' };
    if (!getDestination(id)) return { ok: false, error: 'Destination not found.' };
    state.destinations = allDestinations().filter(function (d) { return d.id !== id; });
    state.wishlist = state.wishlist.filter(function (w) { return w !== id; });
    state.cart = state.cart.filter(function (c) { return c.destId !== id; });
    save();
    return { ok: true };
  }

  window.TraveeState = {
    get state() { return state; },
    subscribe: subscribe, emit: emit, save: save,
    signIn: signIn, signUp: signUp, logout: logout, isAuthed: isAuthed,
    createUser: createUser, deleteUser: deleteUser, listUsers: listUsers,
    currentRole: currentRole, canAccess: canAccess, can: can, roleHome: roleHome,
    addToCart: addToCart, removeFromCart: removeFromCart, updateCartTravelers: updateCartTravelers, clearCart: clearCart, cartInfo: cartInfo,
    toggleWishlist: toggleWishlist, isWishlisted: isWishlisted,
    applyDiscount: applyDiscount,
    placeBooking: placeBooking, getBooking: getBooking, cancelBooking: cancelBooking,
    setBoarding: setBoarding, flightStatus: flightStatus,
    loyaltyInfo: loyaltyInfo,
    allDestinations: allDestinations, getDestination: getDestination,
    createDestination: createDestination, updateDestination: updateDestination, deleteDestination: deleteDestination,
    setFilters: setFilters, resetFilters: resetFilters, filteredDestinations: filteredDestinations
  };
})();
