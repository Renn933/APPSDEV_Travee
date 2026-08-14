/* ============================================================
   Travee — state.js
   Single source of truth, persisted to localStorage.
   Holds: auth, cart, wishlist, bookings, points, filters.
   ============================================================ */
(function () {
  'use strict';
  var DATA_KEY = 'travee_state_v1';

  var state = {
    user: null,          // { name, email, avatar }
    cart: [],            // [{ id, destId, pkgId, pkgLabel, date, travelers, unit, mult }]
    wishlist: [],        // [ destId, ... ]
    bookings: [],        // [{ id, ref, items, total, pointsEarned, date, status, traveler }]
    points: 0,           // spendable balance
    lifetime: 0,         // all-time earned (drives loyalty tier)
    filters: { search: '', category: 'all', sort: 'popular', maxPrice: 100000 }
  };

  var listeners = [];

  function load() {
    try {
      var raw = localStorage.getItem(DATA_KEY);
      if (raw) Object.assign(state, JSON.parse(raw));
    } catch (e) { /* corrupted storage — start fresh */ }
    if (!Array.isArray(state.cart)) state.cart = [];
    if (!Array.isArray(state.wishlist)) state.wishlist = [];
    if (!Array.isArray(state.bookings)) state.bookings = [];
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

  /* ---------- auth ---------- */
  function login(name, email) {
    state.user = { name: name, email: email, avatar: (name || 'T').trim()[0].toUpperCase() };
    save();
  }
  function logout() {
    state.user = null;
    save();
  }
  function isAuthed() { return !!state.user; }

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
      destId: destId, destName: d.name, destCountry: d.country, art: d.art,
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
      status: 'confirmed', traveler: traveler
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
    if (state.lifetime >= b.pointsEarned) state.lifetime -= b.pointsEarned;
    state.points = Math.max(0, state.points - b.pointsEarned);
    save();
    return true;
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
    state.filters = { search: '', category: 'all', sort: 'popular', maxPrice: 100000 };
    save();
  }
  function filteredDestinations() {
    var f = state.filters;
    var list = window.TraveeData.DESTINATIONS.filter(function (d) {
      var okSearch = !f.search || (d.name + ' ' + d.country + ' ' + d.tagline).toLowerCase().indexOf(f.search.toLowerCase()) >= 0;
      var okCat = !f.category || f.category === 'all' || d.cat === f.category;
      var okPrice = d.price <= (f.maxPrice || 5000);
      return okSearch && okCat && okPrice;
    });
    switch (f.sort) {
      case 'price-asc': list.sort(function (a, b) { return a.price - b.price; }); break;
      case 'price-desc': list.sort(function (a, b) { return b.price - a.price; }); break;
      case 'rating': list.sort(function (a, b) { return b.rating - a.rating; }); break;
      default: list.sort(function (a, b) { return b.pop - a.pop; });
    }
    return list;
  }

  window.TraveeState = {
    get state() { return state; },
    subscribe: subscribe, emit: emit, save: save,
    login: login, logout: logout, isAuthed: isAuthed,
    addToCart: addToCart, removeFromCart: removeFromCart, updateCartTravelers: updateCartTravelers, clearCart: clearCart, cartInfo: cartInfo,
    toggleWishlist: toggleWishlist, isWishlisted: isWishlisted,
    applyDiscount: applyDiscount,
    placeBooking: placeBooking, getBooking: getBooking, cancelBooking: cancelBooking,
    loyaltyInfo: loyaltyInfo,
    setFilters: setFilters, resetFilters: resetFilters, filteredDestinations: filteredDestinations
  };
})();

