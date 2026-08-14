/* ============================================================
   Travee — view: confirmation
   Receipt-style booking confirmation + loyalty points awarded.
   ============================================================ */
(function () {
  'use strict';
  var D = window.TraveeData, T = window.Travee, S = window.TraveeState;

  function render(params) {
    var booking = S.getBooking(params && params[0]);
    if (!booking) {
      return '<div class="container"><div class="empty"><div class="icon">🧾</div><h3>No booking here</h3><p>We couldn’t find that booking reference.</p><a class="btn btn-primary" href="#/">Back to explore</a></div></div>';
    }
    var itemsRows = booking.items.map(function (it) {
      return '<div class="row"><span>' + it.travelers + '× ' + T.esc(it.destName) + ' — ' + it.pkgLabel + ' · ' + T.formatDate(it.date) + '</span><span>' + T.money(it.unit * it.travelers) + '</span></div>';
    }).join('');
    return '' +
      '<div class="confirm-wrap">' +
        '<div class="success-ring">✓</div>' +
        '<h1>Booking confirmed!</h1>' +
        '<p class="muted">Your trip is saved. Pack your bags ✈</p>' +
        '<div class="confirm-card">' +
          '<div class="row"><span>Reference</span><span class="reference">' + booking.ref + '</span></div>' +
          '<div class="row"><span>Booked on</span><span>' + T.formatDate(booking.created.slice(0, 10)) + '</span></div>' +
          '<div class="row"><span>Traveler</span><span>' + T.esc(booking.traveler.fullName) + '</span></div>' +
          itemsRows +
          (booking.discount ? '<div class="row"><span>Discount</span><span class="green">−' + T.money(booking.discount) + '</span></div>' : '') +
          '<div class="row" style="border-top:2px solid var(--line);font-weight:800"><span>Total paid</span><span>' + T.money(booking.total) + '</span></div>' +
        '</div>' +
        '<p class="mt-3"><span class="points-award">✦ +' + booking.pointsEarned + ' loyalty points earned</span></p>' +
        '<div class="flex mt-3" style="justify-content:center">' +
          '<a class="btn btn-primary" href="#/profile">View my bookings</a>' +
          '<a class="btn btn-ghost" href="#/">Keep exploring</a>' +
        '</div>' +
      '</div>';
  }

  function mount() {
    // Celebrate with a confirmation toast.
    T.toast('Booking confirmed — check your profile', 'success');
  }

  window.Views = window.Views || {};
  window.Views.confirmation = { render: render, mount: mount };
})();