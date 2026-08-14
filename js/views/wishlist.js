/* ============================================================
   Travee — view: wishlist
   Saved destinations with quick actions and empty state.
   ============================================================ */
(function () {
  'use strict';
  var D = window.TraveeData, T = window.Travee, S = window.TraveeState;

  function render() {
    var saved = S.state.wishlist;
    var dests = saved.map(D.getDestination).filter(Boolean);
    var header =
      '<h1 class="screen-title">Saved flights</h1>' +
      '<p class="screen-sub">' + dests.length + (dests.length === 1 ? ' flight' : ' flights') + ' on your wishlist</p>';

    if (!dests.length) {
      return '' +
        '<div class="container">' + header +
          '<div class="empty">' +
            '<div class="icon">💙</div>' +
            '<h3>Nothing saved yet</h3>' +
            '<p>Tap the ♡ on any flight you like and it will wait here.</p>' +
            '<a class="btn btn-primary" href="#/">Find flights</a>' +
          '</div>' +
        '</div>';
    }

    return '' +
      '<div class="container">' + header +
        '<div class="grid">' +
          dests.map(function (d) {
            var cat = D.getCategory(d.cat);
            return '' +
              '<article class="dcard" data-id="' + d.id + '">' +
                '<a href="#/destination/' + d.id + '"><div class="dcard-cover">' +
                  (d.photo
                    ? '<img class="cover-img" src="' + T.esc(d.photo) + '" alt="' + T.esc(d.name) + '" loading="lazy">'
                    : '<div class="grad" style="background:' + cat.gradient + '"></div><div class="art">' + d.art + '</div>') +
                  '<span class="rating-tag">★ ' + d.rating.toFixed(1) + '</span>' +
                  '<span class="price-tag">from ' + T.money(d.price) + '</span>' +
                '</div></a>' +
                '<div class="dcard-body">' +
                  '<h3 class="dcard-title"><a href="#/destination/' + d.id + '">' + T.esc(d.name) + '</a></h3>' +
                  '<div class="dcard-loc">MNL → ' + T.esc(d.code || '—') + ' · ' + T.esc(d.country) + '</div>' +
                  '<div class="wlist-actions">' +
                    '<a class="btn btn-primary btn-sm" href="#/destination/' + d.id + '">View flight</a>' +
                    '<button class="btn btn-ghost btn-sm wish-remove" data-id="' + d.id + '" type="button">Remove</button>' +
                  '</div>' +
                '</div>' +
              '</article>';
          }).join('') +
        '</div>' +
      '</div>';
  }

  function mount() {
    T.$$('.wish-remove').forEach(function (b) {
      b.addEventListener('click', function () {
        S.toggleWishlist(b.getAttribute('data-id'));
        T.toast('Removed from wishlist', 'info');
        window.Router.renderView('wishlist', []);
      });
    });
  }

  window.Views = window.Views || {};
  window.Views.wishlist = { render: render, mount: mount };
})();