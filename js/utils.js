/* ============================================================
   Travee — utils.js
   Shared helpers: currency, dates, validation, toast, modal.
   ============================================================ */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function money(n) {
    return '₱' + Math.round(n).toLocaleString('en-US');
  }

  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  function formatDuration(mins) {
    var total = Math.max(0, Math.round(Number(mins) || 0));
    if (total > 60) {
      var h = Math.floor(total / 60);
      var m = total % 60;
      return m ? h + 'h ' + m + 'm' : h + 'h';
    }
    return total + ' min';
  }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function uid(prefix) {
    return (prefix || 'id') + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }

  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

  function delay(ms) {
    return new Promise(function (res) { setTimeout(res, ms); });
  }

  var ICONS = {
    plane: '<path d="m2 16 20-5-20-5 4 5-4 5Z"/><path d="M6 11h16"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
    city: '<path d="M3 21h18M5 21V8l7-4v17M12 10l7-3v14M8 9v1m0 3v1m0 3v1m8-5v1m0 3v1"/>',
    island: '<path d="M3 18c2.2-1.4 4.4-1.4 6.6 0s4.4 1.4 6.6 0 3.8-1.4 5.8 0M12 16V7m0 3c-3-1-4.5-3-4.5-5 2.7.2 4.2 1.8 4.5 5Zm0 2c3-1 4.5-3 4.5-5-2.7.2-4.2 1.8-4.5 5Z"/>',
    mountain: '<path d="m3 20 7-13 4 7 2-3 5 9H3Z"/><path d="m8 11 2 2 2-2"/>',
    temple: '<path d="M3 9h18L12 4 3 9Zm2 3v6m4-6v6m6-6v6m4-6v6M3 21h18M2 18h20"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
    suitcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M8 11v6m8-6v6M7 21v1m10-1v1"/>',
    bell: '<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4"/>',
    chart: '<path d="M4 19V5m0 14h17"/><path d="M8 16v-4m5 4V8m5 8v-7"/>',
    shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    message: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15m6-12v15"/>',
    receipt: '<path d="M4 3h16v18l-4-2-4 2-4-2-4 2V3Z"/><path d="M8 8h8m-8 4h8m-8 4h5"/>',
    folder: '<path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    heart: '<path d="M20.8 8.6c0 5.2-8.8 10.4-8.8 10.4S3.2 13.8 3.2 8.6A4.6 4.6 0 0 1 12 6.3a4.6 4.6 0 0 1 8.8 2.3Z"/>',
    wave: '<path d="M2 8c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 14c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2m-20 6c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    surfboard: '<path d="M12 2c3 4 5 8 5 12a5 5 0 0 1-10 0c0-4 2-8 5-12Z"/><path d="M9 12h6"/>',
    leaf: '<path d="M20 4c-9 0-15 3-15 10a6 6 0 0 0 6 6c7 0 10-6 9-16Z"/><path d="M4 21c3-5 7-8 12-11"/>',
    paw: '<circle cx="8" cy="7" r="2"/><circle cx="16" cy="7" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><path d="M12 12c-3 0-6 5-4 7 1 1 3 0 4 0s3 1 4 0c2-2-1-7-4-7Z"/>',
    motorcycle: '<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="m6 17 4-7h4l4 7m-8-7-2-3h4m2 3 3-2 2 2"/>',
    tower: '<path d="M12 3 9 7h6l-3-4Zm-2 4-2 14m8-14 2 14M8 12h8m-9 5h10m-12 4h14"/>',
    skyline: '<path d="M3 21V9h5v12m0-8h5v8m0-13h5v13m0-9h3v9M2 21h20M5 12h1m-1 3h1m9-6h1m-1 3h1m-1 3h1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>'
  };

  var LEGACY_ICONS = {};
  LEGACY_ICONS[String.fromCodePoint(0x1F3D9)] = 'city';
  LEGACY_ICONS[String.fromCodePoint(0x1F3D6)] = 'sun';
  LEGACY_ICONS[String.fromCodePoint(0x1F334)] = 'island';
  LEGACY_ICONS[String.fromCodePoint(0x1F3DD)] = 'island';
  LEGACY_ICONS[String.fromCodePoint(0x1F3D4)] = 'mountain';
  LEGACY_ICONS[String.fromCodePoint(0x1F3C4)] = 'surfboard';
  LEGACY_ICONS[String.fromCodePoint(0x1F412)] = 'paw';
  LEGACY_ICONS[String.fromCodePoint(0x1F405)] = 'paw';
  LEGACY_ICONS[String.fromCodePoint(0x1F3DB)] = 'landmark';
  LEGACY_ICONS[String.fromCodePoint(0x1F30A)] = 'wave';
  LEGACY_ICONS[String.fromCodePoint(0x1F3CD)] = 'motorcycle';
  LEGACY_ICONS[String.fromCodePoint(0x1F5FC)] = 'tower';
  LEGACY_ICONS[String.fromCodePoint(0x26E9)] = 'temple';
  LEGACY_ICONS[String.fromCodePoint(0x1F3EF)] = 'temple';
  LEGACY_ICONS[String.fromCodePoint(0x1F981)] = 'paw';
  LEGACY_ICONS[String.fromCodePoint(0x1F306)] = 'skyline';
  LEGACY_ICONS[String.fromCodePoint(0x1F998)] = 'paw';
  LEGACY_ICONS[String.fromCodePoint(0x1F30D)] = 'globe';
  LEGACY_ICONS[String.fromCodePoint(0x1F30F)] = 'globe';
  LEGACY_ICONS[String.fromCodePoint(0x2708)] = 'plane';

  function iconKey(name) {
    var normalized = String(name || '').replace(/\uFE0F/g, '');
    return ICONS[normalized] ? normalized : (LEGACY_ICONS[normalized] || normalized);
  }

  function icon(name, className) {
    var key = iconKey(name);
    var paths = ICONS[key] || (key === 'landmark' ? ICONS.temple : null) || ICONS.map;
    var cls = 'icon-svg' + (className ? ' ' + esc(className) : '');
    return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + paths + '</svg>';
  }

  function photoImage(d, cat, loading, className) {
    return '<img class="photo-image' + (className ? ' ' + esc(className) : '') + '" src="' + esc(d.photo) + '" alt="' + esc(d.name) + '" loading="' + (loading === 'eager' ? 'eager' : 'lazy') + '" data-photo-fallback>' +
      '<span class="photo-fallback" hidden style="background:' + cat.gradient + '">' + icon(d.art || cat.icon) + '</span>';
  }

  document.addEventListener('error', function (event) {
    var image = event.target;
    if (image.tagName !== 'IMG' || !image.hasAttribute('data-photo-fallback')) return;
    image.hidden = true;
    if (image.nextElementSibling) image.nextElementSibling.hidden = false;
  }, true);

  /* ---------- Toast ---------- */
  function toast(message, type) {
    var stack = $('#toast-stack');
    var el = document.createElement('div');
    el.className = 'toast ' + (type || 'info');
    var iconName = type === 'success' ? 'check' : type === 'error' ? 'close' : 'info';
    el.innerHTML = '<span class="t-icon">' + icon(iconName) + '</span><span>' + esc(message) + '</span>';
    stack.appendChild(el);
    setTimeout(function () {
      el.classList.add('leaving');
      setTimeout(function () { el.remove(); }, 320);
    }, 2600);
  }

  /* ---------- Confirm modal ---------- */
  function confirmModal(title, body, confirmLabel, danger) {
    return new Promise(function (resolve) {
      var root = $('#modal-root');
      root.innerHTML =
        '<div class="modal" role="dialog" aria-modal="true">' +
          '<h3>' + esc(title) + '</h3>' +
          '<p class="muted">' + esc(body) + '</p>' +
          '<div class="modal-btns">' +
            '<button class="btn btn-ghost" data-act="no">Cancel</button>' +
            '<button class="btn ' + (danger ? 'btn-danger' : 'btn-primary') + '" data-act="yes">' + esc(confirmLabel || 'Confirm') + '</button>' +
          '</div>' +
        '</div>';
      root.hidden = false;
      root.classList.remove('hidden');
      $('#modal-root .btn[data-act=no]').addEventListener('click', close);
      $('#modal-root .btn[data-act=yes]').addEventListener('click', function () { close(true); });
      function close(val) {
        var m = $('#modal-root .modal');
        if (m) { m.style.transition = 'transform .18s ease, opacity .18s'; m.style.opacity = '0'; m.style.transform = 'scale(.92)'; }
        setTimeout(function () { root.innerHTML = ''; root.hidden = true; root.classList.add('hidden'); resolve(!!val); }, 170);
      }
    });
  }

  /* Reusable destination card markup (shared by home & wishlist). */
  function destCard(d) {
    var cat = window.TraveeData.getCategory(d.cat);
    var cover = d.photo
      ? photoImage(d, cat, 'lazy', 'cover-img')
      : '<div class="grad" style="background:' + cat.gradient + '"></div><div class="art">' + icon(d.art || cat.icon) + '</div>';
    return '' +
      '<article class="dcard" data-id="' + d.id + '">' +
        '<div class="dcard-cover">' +
          cover +
          '<span class="rating-tag">' + icon('star', 'rating-icon') + ' ' + d.rating.toFixed(1) + '</span>' +
          '<span class="cat-tag">' + cat.label + '</span>' +
        '</div>' +
        '<div class="dcard-body">' +
          '<h3 class="dcard-title">' + esc(d.name) + '</h3>' +
          '<div class="dcard-loc">MNL → ' + esc(d.code || '—') + ' · ' + esc(d.country) + '</div>' +
          '<div class="dcard-meta"><span class="flight-time">' + icon('plane') + ' ~' + formatDuration(d.duration) + '</span><span>' + icon('plane') + ' ' + esc(d.airline || d.bestSeason) + '</span></div>' +
          '<div class="dcard-foot">' +
            '<span class="price-tag num-tabular">from ' + money(d.price) + '</span>' +
            '<a class="btn btn-primary btn-sm" href="#/destination/' + d.id + '">View flight</a>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  window.Travee = {
    $: $, $$: $$, money: money, formatDate: formatDate, esc: esc, uid: uid,
    debounce: debounce, validEmail: validEmail, delay: delay,
    toast: toast, confirmModal: confirmModal, destCard: destCard, formatDuration: formatDuration,
    icon: icon, iconKey: iconKey, photoImage: photoImage
  };
})();
