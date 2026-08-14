/* ============================================================
   Travee — view: home (Explore)
   Hero, data-driven grid, search, category filter, sort, price.
   ============================================================ */
(function () {
  'use strict';
  var D = window.TraveeData, T = window.Travee, S = window.TraveeState;

  function render() {
    var f = S.state.filters;
    return '' +
      '<div class="container">' +
        '<section class="hero">' +
          '<h1>Book flights across the Philippines and around the world</h1>' +
          '<p>Domestic and international routes from Manila — compare fares, pick a class and book your seat in minutes.</p>' +
          '<div class="searchbar">' +
            '<input id="search-input" type="text" placeholder="Search cities, countries…" value="' + T.esc(f.search) + '" aria-label="Search flights">' +
            '<button class="btn btn-accent" id="search-clear" type="button" title="Clear search">✕</button>' +
          '</div>' +
        '</section>' +

        '<div class="scope-toggle" id="scope-toggle" role="group" aria-label="Route scope">' +
          '<button type="button" class="scope-btn' + (f.scope === 'all' ? ' active' : '') + '" data-scope="all">All routes</button>' +
          '<button type="button" class="scope-btn' + (f.scope === 'domestic' ? ' active' : '') + '" data-scope="domestic">🇵🇭 Domestic</button>' +
          '<button type="button" class="scope-btn' + (f.scope === 'international' ? ' active' : '') + '" data-scope="international">🌏 International</button>' +
        '</div>' +

        '<div class="chips" id="cat-chips">' +
          chip('all', 'All') +
          Object.keys(D.CATEGORIES).map(function (k) { return chip(k, D.CATEGORIES[k].icon + ' ' + D.CATEGORIES[k].label); }).join('') +
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

  function mount() {
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
            '<div class="icon">✈</div>' +
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

  window.Views = window.Views || {};
  window.Views.home = { render: render, mount: mount };
})();
