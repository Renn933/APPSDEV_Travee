/* ============================================================
   Travee — roles.js
   Single source of truth for user roles & permissions.
   Loaded FIRST (dependency-free) so state.js can seed
   accounts and router.js can guard routes by role.

   Roles:
     traveler     — the default customer (booking funnel + saved + profile + board)
     admin        — destinations & users
     receptionist — front-desk booking funnel (saved + cart) + flight board
     dashboard    — read-only flight status board only
   ============================================================ */
(function () {
  'use strict';

  /* Every route/view that exists in the app. Kept in sync with router.js. */
  var ALL_VIEWS = ['home', 'detail', 'cart', 'checkout', 'confirmation', 'wishlist', 'profile', 'dashboard', 'users'];

  var ROLES = {
    traveler: {
      id: 'traveler',
      label: 'Traveler',
      icon: 'suitcase',
      tagline: 'Book flights, save trips, earn points',
      home: '#/',
      routes: ['home', 'detail', 'cart', 'checkout', 'confirmation', 'wishlist', 'profile', 'dashboard'],
      caps: []
    },
    receptionist: {
      id: 'receptionist',
      label: 'Receptionist',
      icon: 'bell',
      tagline: 'Front-desk booking & flight board',
      home: '#/dashboard',
      routes: ['home', 'detail', 'cart', 'checkout', 'confirmation', 'wishlist', 'profile', 'dashboard'],
      caps: ['manage_bookings']
    },
    dashboard: {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'chart',
      tagline: 'Read-only flight status board',
      home: '#/dashboard',
      routes: ['dashboard'],
      caps: []
    },
    admin: {
      id: 'admin',
      label: 'Admin',
      icon: 'shield',
      tagline: 'Destinations & users',
      home: '#/',
      /* No cart / checkout / confirmation / wishlist — the admin books nothing.
         Explore (home) is the destination CRUD screen for this role. */
      routes: ['home', 'profile', 'dashboard', 'users'],
      caps: ['manage_users', 'manage_destinations', 'manage_bookings']
    }
  };

  /* Unknown / missing ids fall back to the plain traveler experience. */
  function getRole(id) { return ROLES[id] || ROLES.traveler; }

  function list() {
    return Object.keys(ROLES).map(function (k) { return ROLES[k]; });
  }

  function canAccess(id, view) {
    var r = ROLES[id];
    if (!r) return false;
    return r.routes.indexOf(view) >= 0;
  }

  function home(id) { return getRole(id).home; }

  window.TraveeRoles = {
    ROLES: ROLES,
    ALL_VIEWS: ALL_VIEWS,
    getRole: getRole,
    list: list,
    canAccess: canAccess,
    home: home
  };
})();
