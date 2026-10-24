/* ============================================================
   Travee — view: home (Explore)
   Hero, data-driven grid, search, category filter, sort, price.
   ============================================================ */
(function () {
  'use strict';
  var D = window.TraveeData, T = window.Travee, S = window.TraveeState;

  function renderBrowse() {
    var f = S.state.filters;
    return '' +
      '<div class="container">' +
        '<section class="hero">' +
          '<h1>Book flights across the Philippines and around the world</h1>' +
          '<p>Domestic and international routes from Manila — compare fares, pick a class and book your seat in minutes.</p>' +
          '<div class="searchbar">' +
            '<input id="search-input" type="text" placeholder="Search cities, countries…" value="' + T.esc(f.search) + '" aria-label="Search flights">' +
            '<button class="btn btn-ghost btn-sm" id="search-clear" type="button" title="Clear search" aria-label="Clear search">' + T.icon('close') + '</button>' +
          '</div>' +
        '</section>' +

        '<div class="scope-toggle" id="scope-toggle" role="group" aria-label="Route scope">' +
          '<button type="button" class="scope-btn' + (f.scope === 'all' ? ' active' : '') + '" data-scope="all">All routes</button>' +
          '<button type="button" class="scope-btn' + (f.scope === 'domestic' ? ' active' : '') + '" data-scope="domestic">' + T.icon('pin') + ' Domestic</button>' +
          '<button type="button" class="scope-btn' + (f.scope === 'international' ? ' active' : '') + '" data-scope="international">' + T.icon('globe') + ' International</button>' +
        '</div>' +

        '<div class="chips" id="cat-chips">' +
          chip('all', 'All') +
          Object.keys(D.CATEGORIES).map(function (k) { return chip(k, T.icon(D.CATEGORIES[k].icon) + ' ' + T.esc(D.CATEGORIES[k].label)); }).join('') +
        '</div>' +

        '<div class="toolbar">' +
          '<span id="result-count" class="muted small"></span>' +
          '<div class="controls">' +
            '<label class="muted small" for="sort-select">Sort</label>' +
            '<select id="sort-select" class="field-select" aria-label="Sort flights">' +
              '<option value="popular"' + (f.sort === 'popular' ? ' selected' : '') + '>Most popular</option>' +
              '<option value="rating"' + (f.sort === 'rating' ? ' selected' : '') + '>Top rated</option>' +
              '<option value="price-asc"' + (f.sort === 'price-asc' ? ' selected' : '') + '>Price: low to high</option>' +
              '<option value="price-desc"' + (f.sort === 'price-desc' ? ' selected' : '') + '>Price: high to low</option>' +
            '</select>' +
            '<label class="muted small" for="price-select">Max fare</label>' +
            '<select id="price-select" class="field-select" aria-label="Maximum price">' +
              priceOpt(50000, 'Any price', f.maxPrice) +
              priceOpt(2000, 'Under ₱2,000', f.maxPrice) +
              priceOpt(5000, 'Under ₱5,000', f.maxPrice) +
              priceOpt(10000, 'Under ₱10,000', f.maxPrice) +
            '</select>' +
          '</div>' +
        '</div>' +

        '<div id="results-grid" class="grid" aria-live="polite"></div>' +
      '</div>';
  }

  function chip(key, label) {
    var f = S.state.filters;
    var active = (key === 'all' && f.category === 'all') || f.category === key;
    return '<button class="chip' + (active ? ' active' : '') + '" data-cat="' + key + '" type="button">' + label + '</button>';
  }
  function priceOpt(val, label, cur) {
    return '<option value="' + val + '"' + (cur === val ? ' selected' : '') + '>' + label + '</option>';
  }

  function mountBrowse() {
    tieControls();
    tieScope();
    loadResults();
  }

  function tieScope() {
    var toggle = T.$('#scope-toggle');
    if (!toggle) return;
    T.$$('.scope-btn', toggle).forEach(function (b) {
      b.addEventListener('click', function () {
        S.setFilters({ scope: b.getAttribute('data-scope') });
        T.$$('.scope-btn', toggle).forEach(function (x) { x.classList.toggle('active', x === b); });
        loadResults();
      });
    });
  }

  function tieControls() {
    // Search (debounced) + clear
    var input = T.$('#search-input');
    var clear = T.$('#search-clear');
    var doSearch = T.debounce(function () {
      S.setFilters({ search: input.value });
      loadResults();
    }, 260);
    input.addEventListener('input', doSearch);
    clear.addEventListener('click', function () { input.value = ''; S.setFilters({ search: '' }); loadResults(); input.focus(); });

    // Category chips
    T.$$('#cat-chips .chip').forEach(function (b) {
      b.addEventListener('click', function () {
        S.setFilters({ category: b.getAttribute('data-cat') });
        T.$$('#cat-chips .chip').forEach(function (x) { x.classList.toggle('active', x === b); });
        loadResults();
      });
    });

    // Sort + price
    var sortSel = T.$('#sort-select');
    var priceSel = T.$('#price-select');
    sortSel.addEventListener('change', function () { S.setFilters({ sort: sortSel.value }); loadResults(); });
    priceSel.addEventListener('change', function () { S.setFilters({ maxPrice: Number(priceSel.value) }); loadResults(); });
  }

  function loadResults() {
    var grid = T.$('#results-grid');
    var count = T.$('#result-count');
    // Loading skeletons (polish).
    var skels = '';
    for (var i = 0; i < 6; i++) skels += '<div class="sk-card skeleton"></div>';
    grid.innerHTML = skels;
    count.textContent = 'Loading…';

    T.delay(450).then(function () {
      var list = S.filteredDestinations();
      count.textContent = list.length + (list.length === 1 ? ' flight route' : ' flight routes');
      if (!list.length) {
        grid.innerHTML = '' +
          '<div class="empty" style="grid-column:1/-1">' +
            '<div class="icon">' + T.icon('plane') + '</div>' +
            '<h3>No flights match your search</h3>' +
            '<p>Try a different city, region or raise the price cap.</p>' +
            '<button class="btn btn-primary" id="reset-filters-btn" type="button">Clear all filters</button>' +
          '</div>';
        T.$('#reset-filters-btn').addEventListener('click', function () {
          S.resetFilters();
          T.$('#search-input').value = '';
          var sortSel2 = T.$('#sort-select');
          var priceSel2 = T.$('#price-select');
          if (sortSel2) sortSel2.value = 'popular';
          if (priceSel2) priceSel2.value = '50000';
          T.$$('#cat-chips .chip').forEach(function (c) { c.classList.toggle('active', c.getAttribute('data-cat') === 'all'); });
          T.$$('#scope-toggle .scope-btn').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-scope') === 'all'); });
          loadResults();
        });
        return;
      }
      grid.innerHTML = list.map(T.destCard).join('');
    });
  }

  /* ============================================================
     Admin: destination CRUD — this IS the Explore screen for admins.
     Mirrors users.js (left form, right list). Non-admins never see it.
     ============================================================ */
  var editingId = null;   // null => creating; otherwise the id being edited

  function isAdmin() { return S.can('manage_destinations'); }

  function catOptions(selected) {
    return Object.keys(D.CATEGORIES).map(function (k) {
      return '<option value="' + k + '"' + (selected === k ? ' selected' : '') + '>' +
        T.esc(D.CATEGORIES[k].label) + '</option>';
    }).join('');
  }

  function field(id, label, value, opts) {
    opts = opts || {};
    var input;
    if (opts.type === 'select') {
      input = '<select id="' + id + '" class="field-select">' + opts.options + '</select>';
    } else if (opts.type === 'textarea') {
      input = '<textarea id="' + id + '" rows="' + (opts.rows || 3) + '" placeholder="' + T.esc(opts.ph || '') + '">' + T.esc(value || '') + '</textarea>';
    } else {
      input = '<input id="' + id + '" type="' + (opts.type || 'text') + '"' +
        (opts.min != null ? ' min="' + opts.min + '"' : '') +
        (opts.step != null ? ' step="' + opts.step + '"' : '') +
        ' value="' + T.esc(value == null ? '' : value) + '" placeholder="' + T.esc(opts.ph || '') + '">';
    }
    return '<div class="field' + (opts.wide ? ' wide' : '') + '">' +
      '<label for="' + id + '">' + label + '</label>' +
      '<div class="input-wrap">' + input + '</div>' +
      '<div class="err">' + T.esc(opts.err || 'Check this field.') + '</div>' +
    '</div>';
  }

  function destForm() {
    var d = editingId ? S.getDestination(editingId) : null;
    var v = d || {};
    var artOptions = ['city', 'sun', 'island', 'surfboard', 'paw', 'mountain', 'landmark', 'wave', 'motorcycle', 'tower', 'temple', 'skyline'];
    var artLabels = ['City', 'Beach', 'Island', 'Surf', 'Wildlife', 'Mountain', 'Landmark', 'River', 'Motorcycle', 'Tower', 'Temple', 'Skyline'];
    var artSelect = artOptions.map(function (art, i) {
      return '<option value="' + art + '"' + (T.iconKey(v.art || 'city') === art ? ' selected' : '') + '>' + artLabels[i] + '</option>';
    }).join('');
    var scopeOpts =
      '<option value="domestic"' + ((v.scope || 'domestic') === 'domestic' ? ' selected' : '') + '>Domestic</option>' +
      '<option value="international"' + (v.scope === 'international' ? ' selected' : '') + '>International</option>';
    return '' +
      '<form id="dest-form" novalidate>' +
        '<div class="dest-form">' +
          field('df-name', 'Destination name', v.name, { ph: 'e.g. Cebu', err: 'At least 2 characters.' }) +
          field('df-code', 'Airport code', v.code, { ph: 'e.g. CEB' }) +
          field('df-city', 'City', v.city, { ph: 'e.g. Cebu City' }) +
          field('df-country', 'Country', v.country, { ph: 'e.g. Philippines' }) +
          field('df-scope', 'Scope', null, { type: 'select', options: scopeOpts }) +
          field('df-cat', 'Category', null, { type: 'select', options: catOptions(v.cat) }) +
          field('df-price', 'Fare (₱)', v.price, { type: 'number', min: 0, ph: 'e.g. 2450' }) +
          field('df-duration', 'Flight time (min)', v.duration, { type: 'number', min: 0, ph: 'e.g. 75' }) +
          field('df-rating', 'Rating (0–5)', v.rating, { type: 'number', min: 0, step: '0.1', ph: 'e.g. 4.8' }) +
          field('df-pop', 'Popularity (0–100)', v.pop, { type: 'number', min: 0, ph: 'e.g. 90' }) +
          field('df-airline', 'Airlines', v.airline, { ph: 'e.g. PAL · Cebu Pacific' }) +
          field('df-art', 'Cover icon', null, { type: 'select', options: artSelect }) +
          field('df-photo', 'Photo path / URL', v.photo, { wide: true, ph: 'images/cebu.jpg (optional)' }) +
          field('df-tagline', 'Tagline', v.tagline, { wide: true, ph: 'One-line hook shown on cards' }) +
          field('df-desc', 'Description', v.description, { wide: true, type: 'textarea', ph: 'Longer copy shown on the detail page.' }) +
          field('df-highlights', 'Highlights', (v.highlights || []).join(', '), { wide: true, type: 'textarea', rows: 2, ph: 'Comma-separated, e.g. Kawasan Falls, Whale-shark watching' }) +
          field('df-season', 'Best season', v.bestSeason, { wide: true, ph: 'e.g. November – May (or Year-round)' }) +
        '</div>' +
        '<div class="flex" style="gap:.6rem;margin-top:.4rem">' +
          '<button class="btn btn-go" type="submit" data-load>' + (d ? 'Save changes' : 'Add destination') + '</button>' +
          (d ? '<button class="btn btn-ghost" type="button" id="dest-cancel">Cancel</button>' : '') +
        '</div>' +
      '</form>';
  }

  function destRow(d) {
    var cat = D.getCategory(d.cat);
    var editing = editingId === d.id;
    return '' +
      '<div class="booking-row dest-row' + (editing ? ' editing' : '') + '">' +
        '<div class="booking-head">' +
          '<div><strong>' + T.esc(d.name) + '</strong>' +
            '<div class="small muted">MNL → ' + T.esc(d.code || '—') + ' · ' + T.esc(d.city) + (d.country ? ', ' + T.esc(d.country) : '') + '</div></div>' +
          '<span class="role-badge">' + T.icon(cat.icon) + ' ' + T.esc(cat.label) + '</span>' +
        '</div>' +
        '<div class="dest-meta small muted mt-1">' +
          '<span>' + T.money(d.price) + '</span>' +
          '<span>' + T.icon('plane') + ' ' + T.formatDuration(d.duration) + '</span>' +
          '<span>' + T.icon('star', 'rating-icon') + ' ' + Number(d.rating || 0).toFixed(1) + '</span>' +
          '<span>' + T.icon(d.scope === 'international' ? 'globe' : 'pin') + ' ' + (d.scope === 'international' ? 'International' : 'Domestic') + '</span>' +
        '</div>' +
        '<div class="flex spread mt-1">' +
          '<span class="small muted dest-tagline">' + T.esc(d.tagline || '') + '</span>' +
          '<span class="flex" style="gap:.5rem;flex:none">' +
            '<button class="btn btn-ghost btn-sm dest-edit" data-id="' + T.esc(d.id) + '" type="button">Edit</button>' +
            '<button class="btn btn-ghost btn-sm is-danger dest-del" data-id="' + T.esc(d.id) + '" type="button">Delete</button>' +
          '</span>' +
        '</div>' +
      '</div>';
  }

  function renderManager() {
    if (!S.can('manage_destinations')) {
      return '<div class="container"><div class="empty"><div class="icon">' + T.icon('lock') + '</div><h3>Admins only</h3><p>You don’t have permission to manage destinations.</p><a class="btn btn-primary" href="#/dashboard">Back to board</a></div></div>';
    }
    var dests = S.allDestinations();
    return '' +
      '<div class="container">' +
        '<h1 class="screen-title">Manage destinations</h1>' +
        '<p class="screen-sub">Create, edit and remove the routes customers see on Explore.</p>' +
        '<div class="users-cols">' +
          '<section class="panel panel-pad">' +
            '<h2 class="dash-h">' + (editingId ? 'Edit destination' : 'Add a destination') + '</h2>' +
            destForm() +
          '</section>' +
          '<section class="panel panel-pad">' +
            '<div class="flex spread" style="align-items:center"><h2 class="dash-h" style="margin:0">Routes</h2><span class="small muted">' + dests.length + ' total</span></div>' +
            '<div class="mt-2">' +
              (dests.length ? dests.map(destRow).join('')
                : '<div class="empty"><div class="icon">' + T.icon('map') + '</div><h3>No destinations yet</h3><p>Add one using the form.</p></div>') +
            '</div>' +
          '</section>' +
        '</div>' +
      '</div>';
  }

  function setErr(input, good) {
    var wrap = input.closest('.field');
    if (wrap) wrap.classList.toggle('invalid', !good);
    input.setAttribute('aria-invalid', good ? 'false' : 'true');
  }

  function mountManager() {
    var form = T.$('#dest-form');
    if (form) {
      var name = T.$('#df-name');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var okName = name.value.trim().length >= 2;
        setErr(name, okName);
        if (!okName) { T.toast('Please fix the highlighted fields.', 'error'); name.focus(); return; }
        var data = {
          name: name.value.trim(),
          city: T.$('#df-city').value,
          country: T.$('#df-country').value,
          scope: T.$('#df-scope').value,
          cat: T.$('#df-cat').value,
          code: T.$('#df-code').value,
          price: T.$('#df-price').value,
          duration: T.$('#df-duration').value,
          rating: T.$('#df-rating').value,
          pop: T.$('#df-pop').value,
          airline: T.$('#df-airline').value,
          art: T.$('#df-art').value,
          photo: T.$('#df-photo').value,
          tagline: T.$('#df-tagline').value,
          description: T.$('#df-desc').value,
          bestSeason: T.$('#df-season').value,
          highlights: T.$('#df-highlights').value.split(',').map(function (s) { return s.trim(); }).filter(Boolean)
        };
        var btn = T.$('[data-load]', form);
        var isEdit = !!editingId;
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Saving…';
        T.delay(450).then(function () {
          var res = isEdit ? S.updateDestination(editingId, data) : S.createDestination(data);
          btn.disabled = false;
          btn.textContent = isEdit ? 'Save changes' : 'Add destination';
          if (!res.ok) { T.toast(res.error, 'error'); return; }
          T.toast(isEdit ? 'Updated ' + data.name : 'Added ' + data.name, 'success');
          editingId = null;
          window.Router.renderView('home', []);
        });
      });
    }

    T.$$('.dest-edit').forEach(function (b) {
      b.addEventListener('click', function () {
        editingId = b.getAttribute('data-id');
        window.Router.renderView('home', []);
      });
    });

    var cancel = T.$('#dest-cancel');
    if (cancel) cancel.addEventListener('click', function () { editingId = null; window.Router.renderView('home', []); });

    T.$$('.dest-del').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id');
        var d = S.getDestination(id);
        T.confirmModal('Delete this destination?', (d ? d.name : id) + ' will be removed from Explore, saved lists and carts.', 'Delete', true).then(function (yes) {
          if (!yes) return;
          var res = S.deleteDestination(id);
          if (res.ok) {
            if (editingId === id) editingId = null;
            T.toast('Deleted ' + (d ? d.name : id), 'info');
            window.Router.renderView('home', []);
          } else T.toast(res.error, 'error');
        });
      });
    });
  }

  /* ---------- dispatchers: admins get the CRUD screen, everyone else Explore ---------- */
  function render() { return isAdmin() ? renderManager() : renderBrowse(); }
  function mount() { if (isAdmin()) mountManager(); else mountBrowse(); }

  window.Views = window.Views || {};
  window.Views.home = { render: render, mount: mount };
})();
