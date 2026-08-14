/* ============================================================
   Travee — view: detail
   Destination page with package picker, travelers, date,
   add-to-cart, wishlist and related trips.
   ============================================================ */
(function () {
  'use strict';
  var D = window.TraveeData, T = window.Travee, S = window.TraveeState;

  function render(params) {
    var id = params && params[0];
    var dest = D.getDestination(id);
    if (!dest) return '<div class="container"><div class="empty"><div class="icon">🗺</div><h3>Trip not found</h3><p>That destination may have moved on.</p><a class="btn btn-primary" href="#/">Back to explore</a></div></div>';

    var cat = D.getCategory(dest.cat);
    var dates = D.upcomingDates(6);
    var wish = S.isWishlisted(dest.id);
    var related = D.sameCategoryDestinations(dest).slice(0, 3);

    return '' +
      '<div class="container">' +
        '<div class="breadcrumb"><a href="#/">Explore</a> <span>/</span> ' + T.esc(dest.country) + '</div>' +

        '<div class="detail-cover">' +
          '<div class="grad" style="background:' + cat.gradient + ';position:absolute;inset:0"></div>' +
          '<div class="art">' + dest.art + '</div>' +
          '<span class="price-line">from ' + T.money(dest.price) + '/person</span>' +
          '<div class="ov">' +
            '<h1>' + T.esc(dest.name) + '</h1>' +
            '<div class="meta"><span>📍 ' + T.esc(dest.country) + '</span><span>★ ' + dest.rating.toFixed(1) + '</span><span>⏱ ' + dest.duration + ' days</span></div>' +
          '</div>' +
        '</div>' +

        '<div class="detail-layout">' +
          '<div class="detail-main">' +
            '<div class="tagline-card mb-2"><span aria-hidden="true">💬</span> ' + T.esc(dest.tagline) + '</div>' +
            '<h2>About this trip</h2>' +
            '<p>' + T.esc(dest.description) + '</p>' +
            '<h2>Highlights</h2>' +
            '<ul class="highlights">' + dest.highlights.map(function (h) { return '<li><span class="tick">✓</span>' + T.esc(h) + '</li>'; }).join('') + '</ul>' +
            '<div class="tagline-card"><span aria-hidden="true">🗓</span> Best season: <strong>' + T.esc(dest.bestSeason) + '</strong></div>' +
          '</div>' +

          '<div class="book-card">' +
            '<h3>Plan your trip</h3>' +
            '<p class="field" style="margin-bottom:.6rem"><label>Package</label></p>' +
            '<div class="radio-row" id="pkg-row">' +
              D.PACKAGES.map(function (p) {
                var price = D.packagePrice(dest.price, p.mult);
                return '' +
                  '<div class="radio-opt' + (p.id === 'comfort' ? ' sel' : '') + '" data-pkg="' + p.id + '" data-mult="' + p.mult + '" data-price="' + price + '" role="radio" aria-checked="' + (p.id === 'comfort' ? 'true' : 'false') + '" tabindex="0">' +
                    '<div class="label">' + p.label + '</div>' +
                    '<div class="sub">' + T.esc(p.sub) + '</div>' +
                    '<div class="price">' + T.money(price) + '</div>' +
                  '</div>';
              }).join('') +
            '</div>' +
            '<div class="flex spread mb-1">' +
              '<div class="field" style="margin-bottom:.3rem">' +
                '<label for="trv-val">Travelers</label>' +
                '<div class="stepper">' +
                  '<button type="button" id="trv-dec" aria-label="Fewer travelers">−</button>' +
                  '<span class="val" id="trv-val">1</span>' +
                  '<button type="button" id="trv-inc" aria-label="More travelers">+</button>' +
                '</div>' +
              '</div>' +
              '<div class="field" style="flex:1;min-width:170px">' +
                '<label for="date-select">Departure</label>' +
                '<select id="date-select" class="field-select" style="width:100%">' +
                  dates.map(function (dt) { return '<option value="' + dt + '">' + T.formatDate(dt) + '</option>'; }).join('') +
                '</select>' +
              '</div>' +
            '</div>' +
            '<hr class="divider">' +
            '<div class="sum-row total"><span>Total</span><span id="detail-total">' + T.money(D.packagePrice(dest.price, 1.45)) + '</span></div>' +
            '<p class="small muted" id="detail-perperson"></p>' +
            '<button class="btn btn-primary" style="width:100%" id="add-to-cart-btn" type="button">Add to cart</button>' +
            '<button class="btn btn-ghost" style="width:100%;margin-top:.6rem" id="wish-btn" type="button">' +
              (wish ? '♥ Saved to wishlist' : '♡ Save to wishlist') +
            '</button>' +
            '<button class="btn btn-accent" style="width:100%;margin-top:.6rem" id="buy-now-btn" type="button">Book now →</button>' +
          '</div>' +
        '</div>' +
        (related.length ? (
          '<h2 style="margin-top:3rem">More ' + cat.label.toLowerCase() + ' escapes</h2>' +
          '<div class="grid">' + related.map(T.destCard).join('') + '</div>'
        ) : '') +
      '</div>';
  }

  function mount(params) {
    var dest = D.getDestination(params && params[0]);
    if (!dest) return;
    var current = { pkgId: 'comfort', travelers: 1 };
    function unitPrice() {
      for (var i = 0; i < D.PACKAGES.length; i++) if (D.PACKAGES[i].id === current.pkgId) return D.packagePrice(dest.price, D.PACKAGES[i].mult);
      return dest.price;
    }
    function refreshTotal() {
      var unit = unitPrice();
      var total = unit * current.travelers;
      T.$('#detail-total').textContent = T.money(total);
      T.$('#detail-perperson').textContent = T.money(unit) + ' per person × ' + current.travelers + ' traveler' + (current.travelers > 1 ? 's' : '');
    }
    T.$$('#pkg-row .radio-opt').forEach(function (opt) {
      function pick() {
        T.$$('#pkg-row .radio-opt').forEach(function (x) { x.classList.remove('sel'); x.setAttribute('aria-checked', 'false'); });
        opt.classList.add('sel'); opt.setAttribute('aria-checked', 'true');
        current.pkgId = opt.getAttribute('data-pkg'); refreshTotal();
      }
      opt.addEventListener('click', pick);
      opt.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    });
    T.$('#trv-inc').addEventListener('click', function () { current.travelers = Math.min(9, current.travelers + 1); T.$('#trv-val').textContent = current.travelers; refreshTotal(); });
    T.$('#trv-dec').addEventListener('click', function () { current.travelers = Math.max(1, current.travelers - 1); T.$('#trv-val').textContent = current.travelers; refreshTotal(); });
    T.$('#add-to-cart-btn').addEventListener('click', function () {
      var addBtn = T.$('#add-to-cart-btn'); addBtn.disabled = true;
      var old = addBtn.innerHTML; addBtn.innerHTML = '<span class="spinner"></span> Adding…';
      T.delay(500).then(function () {
        S.addToCart(dest.id, current.pkgId, T.$('#date-select').value, current.travelers);
        addBtn.disabled = false; addBtn.innerHTML = old;
        window.bumpCartBadge && window.bumpCartBadge();
        T.toast(dest.name + ' added to your cart', 'success');
      });
    });
    T.$('#buy-now-btn').addEventListener('click', function () {
      S.addToCart(dest.id, current.pkgId, T.$('#date-select').value, current.travelers);
      window.bumpCartBadge && window.bumpCartBadge();
      window.location.hash = '#/checkout';
    });
    T.$('#wish-btn').addEventListener('click', function () {
      var added = S.toggleWishlist(dest.id);
      T.$('#wish-btn').textContent = added ? '♥ Saved to wishlist' : '♡ Save to wishlist';
      T.toast(added ? 'Saved to wishlist' : 'Removed from wishlist', added ? 'success' : 'info');
    });
    refreshTotal();
  }

  window.Views = window.Views || {};
  window.Views.detail = { render: render, mount: mount };
})();

