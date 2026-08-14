/* ============================================================
   Travee — utils.js
   Shared helpers: currency, dates, validation, toast, modal.
   ============================================================ */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function money(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
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

  /* ---------- Toast ---------- */
  function toast(message, type) {
    var stack = $('#toast-stack');
    var el = document.createElement('div');
    el.className = 'toast ' + (type || 'info');
    var icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    el.innerHTML = '<span class="t-icon">' + icon + '</span><span>' + esc(message) + '</span>';
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
    return '' +
      '<article class="dcard" data-id="' + d.id + '">' +
        '<div class="dcard-cover">' +
          '<div class="grad" style="background:' + cat.gradient + '"></div>' +
          '<div class="art">' + d.art + '</div>' +
          '<span class="rating-tag">★ ' + d.rating.toFixed(1) + '</span>' +
          '<span class="cat-tag">' + cat.label + '</span>' +
          '<span class="price-tag">from ' + money(d.price) + '</span>' +
        '</div>' +
        '<div class="dcard-body">' +
          '<h3 class="dcard-title">' + esc(d.name) + '</h3>' +
          '<div class="dcard-loc">' + esc(d.country) + '</div>' +
          '<div class="dcard-meta"><span>⏱ ' + d.duration + ' days</span><span>✦ ' + esc(d.bestSeason) + '</span></div>' +
          '<div class="dcard-foot">' +
            '<span class="dcard-foot"></span>' +
            '<a class="btn btn-primary btn-sm" href="#/destination/' + d.id + '">View trip</a>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  window.Travee = {
    $: $, $$: $$, money: money, formatDate: formatDate, esc: esc, uid: uid,
    debounce: debounce, validEmail: validEmail, delay: delay,
    toast: toast, confirmModal: confirmModal, destCard: destCard
  };
})();
