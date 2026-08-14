/* ============================================================
   Travee — view: profile
   Account info, loyalty tier & progress, booking history
   with cancel, and sign out.
   ============================================================ */
(function () {
  'use strict';
  var D = window.TraveeData, T = window.Travee, S = window.TraveeState;

  function render() {
    var user = S.state.user;
    var li = S.loyaltyInfo();
    var bookings = S.state.bookings;
    var tiersHtml = D.TIERS.map(function (t) {
      var isCur = t.name === li.tier.name;
      return '<div class="tier-cell' + (isCur ? ' current' : '') + '"><strong>' + t.name + '</strong><div class="small muted">' + t.threshold + ' pts</div></div>';
    }).join('');

    var bookingsHtml;
    if (!bookings.length) {
      bookingsHtml = '<div class="empty"><div class="icon">🗓</div><h3>No bookings yet</h3><p>Your confirmed flights will appear here.</p><a class="btn btn-primary" href="#/">Find a flight</a></div>';
    } else {
      bookingsHtml = bookings.map(function (b) {
        var cat = 'confirmed';
        var label = 'Confirmed';
        if (b.status === 'cancelled') { cat = 'cancelled'; label = 'Cancelled'; }
        var items = b.items.map(function (it) { return it.travelers + '× ' + T.esc(it.destName); }).join(', ');
        return '' +
          '<div class="booking-row">' +
            '<div class="booking-head">' +
              '<div><strong>' + T.esc(items) + '</strong><div class="small muted">' + b.ref + ' · Booked ' + T.formatDate(b.created.slice(0, 10)) + '</div></div>' +
              '<div class="flex"><span class="badge-status ' + cat + '">' + label + '</span></div>' +
            '</div>' +
            '<div class="flex spread mt-1">' +
              '<span class="small muted">Total ' + T.money(b.total) + ' · <span class="green">✦ +' + b.pointsEarned + ' pts</span></span>' +
              (b.status === 'confirmed' ? '<button class="btn btn-ghost btn-sm cancel-booking" data-id="' + b.id + '" type="button">Cancel booking</button>' : '') +
            '</div>' +
          '</div>';
      }).join('');
    }

    return '' +
      '<div class="container">' +
        '<div class="panel panel-pad mb-3 flex">' +
          '<div class="avatar">' + T.esc(user.avatar) + '</div>' +
          '<div style="flex:1">' +
            '<h2 style="margin:0">' + T.esc(user.name) + '</h2>' +
            '<div class="muted">' + T.esc(user.email) + '</div>' +
            '<div class="flex mt-1"><span class="points-pill">✦ ' + S.state.points + ' points available</span></div>' +
          '</div>' +
          '<button class="btn btn-ghost" id="profile-logout" type="button">Sign out</button>' +
        '</div>' +

        '<div class="loyalty-card mb-3" style="margin-bottom:2rem">' +
          '<div class="flex spread"><strong style="letter-spacing:.5px">TRAVEE LOYALTY</strong><span class="tier-badge">' + li.tier.name + '</span></div>' +
          '<div class="mt-2" style="margin-top:1rem"><div class="small" style="opacity:.9">Lifetime points: <strong>' + S.state.lifetime + '</strong></div>' +
            '<div class="loyalty-bar"><div class="loyalty-fill" style="width:' + li.progress + '%"></div></div>' +
            (li.next ? '<div class="small" style="opacity:.9">' + (li.next.threshold - S.state.lifetime) + ' points to reach ' + li.next.name + '</div>' : '<div class="small" style="opacity:.9">Top tier reached — legend! 🏆</div>') +
          '</div>' +
          '<div class="tier-row">' + tiersHtml + '</div>' +
        '</div>' +

        '<div class="flex spread mb-2"><h2 style="margin:0">Booking history</h2></div>' +
        bookingsHtml +
      '</div>';
  }

  function mount() {
    T.$$('.cancel-booking').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id');
        var bk = S.getBooking(id);
        T.confirmModal('Cancel this booking?', 'The loyalty points earned from this booking will be deducted.', 'Cancel booking', true).then(function (yes) {
          if (yes && S.cancelBooking(id)) {
            T.toast('Booking cancelled', 'info');
            window.Router.renderView('profile', []);
          }
        });
      });
    });
    if (T.$('#profile-logout')) {
      T.$('#profile-logout').addEventListener('click', function () {
        T.confirmModal('Sign out?', 'Your saved flights stay in this browser.', 'Sign out', false).then(function (yes) {
          if (yes) {
            S.logout();
            T.toast('Signed out', 'info');
            window.location.hash = '#/login';
          }
        });
      });
    }
  }

  window.Views = window.Views || {};
  window.Views.profile = { render: render, mount: mount };
})();