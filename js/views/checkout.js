/* ============================================================
   Travee — view: checkout (2-step: traveler info → review & confirm)
   Holds traveler info, validates, then places the booking.
   ============================================================ */
(function () {
  'use strict';
  var D = window.TraveeData, T = window.Travee, S = window.TraveeState;

  var ck = { step: 1, form: { fullName: '', email: '', phone: '', requests: '' }, discount: 0 };

  function render() {
    var items = S.state.cart;
    if (!items.length) {
      return '<div class="container"><div class="empty"><div class="icon">🧳</div><h3>Nothing to check out</h3><p>Add a flight to your cart first.</p><a class="btn btn-primary" href="#/">Find flights</a></div></div>';
    }
    return '' +
      '<div class="container">' +
        '<h1 class="screen-title">Checkout</h1>' +
        '<div class="steps">' +
          '<div class="step' + (ck.step >= 1 ? ' active' : '') + (ck.step > 1 ? ' done' : '') + '"><span class="dot">' + (ck.step > 1 ? '✓' : '1') + '</span> Traveler details</div>' +
          '<div class="step' + (ck.step >= 2 ? ' active' : '') + '"><span class="dot">2</span> Review &amp; confirm</div>' +
        '</div>' +
        '<div id="checkout-body">' + (ck.step === 1 ? step1() : step2()) + '</div>' +
      '</div>';
  }

  function step1() {
    return '' +
      '<div class="checkout-card">' +
        '<h3>Traveler details</h3>' +
        '<p class="muted small">These details appear on your booking. Demo only — no real data is transmitted.</p>' +
        '<div class="checkout-card-2col">' +
          '<div class="field"><label for="cf-name">Full name</label><input id="cf-name" type="text" placeholder="Jane Doe" value="' + T.esc(ck.form.fullName) + '"><div class="err" data-for="cf-name">Enter your full name (2+ characters).</div></div>' +
          '<div class="field"><label for="cf-email">Email</label><input id="cf-email" type="email" placeholder="jane@example.com" value="' + T.esc(ck.form.email) + '"><div class="err" data-for="cf-email">Enter a valid email.</div></div>' +
        '</div>' +
        '<div class="checkout-card-2col">' +
          '<div class="field"><label for="cf-phone">Phone</label><input id="cf-phone" type="tel" placeholder="+1 555 000 1234" value="' + T.esc(ck.form.phone) + '"><div class="err" data-for="cf-phone">Enter a phone number (7+ digits).</div></div>' +
          '<div class="field"><label for="cf-req">Special requests <span class="muted small">(optional)</span></label><input id="cf-req" type="text" placeholder="e.g. vegetarian meals" value="' + T.esc(ck.form.requests) + '"></div>' +
        '</div>' +
        '<button class="btn btn-primary" id="cf-next" type="button">Continue to review →</button>' +
      '</div>';
  }

  function step2() {
    var items = S.state.cart;
    var subtotal = 0;
    for (var i = 0; i < items.length; i++) subtotal += items[i].unit * items[i].travelers;
    var total = Math.max(0, subtotal - ck.discount);
    var rows = items.map(function (it) {
      return '<div class="sum-row"><span>' + it.travelers + '× ' + T.esc(it.destName) + ' · ' + it.pkgLabel + '</span><span>' + T.money(it.unit * it.travelers) + '</span></div>';
    }).join('');
    return '<div class="checkout-card">' +
      '<h3>Review your flights</h3>' + rows +
      (ck.discount ? '<div class="sum-row"><span>Discount</span><span class="green">−' + T.money(ck.discount) + '</span></div>' : '') +
      '<hr class="divider">' +
      '<div class="sum-row total"><span>Total</span><span>' + T.money(total) + '</span></div>' +
      '<p class="small muted mt-1">Traveler: ' + T.esc(ck.form.fullName) + ' · ' + T.esc(ck.form.email) + '</p>' +
      '<div class="field mt-2"><label><input type="checkbox" id="cf-terms"> I understand this is a demo booking with no real payment or itinerary.</label></div>' +
      '<div class="flex mt-2">' +
        '<button class="btn btn-ghost" id="cf-back" type="button">← Back</button>' +
        '<button class="btn btn-accent" id="cf-confirm" type="button">Confirm &amp; book</button>' +
      '</div>' +
    '</div>';
  }

  function mount() {
    if (!T.$('#checkout-body')) return;

    if (ck.step === 1 && T.$('#cf-next')) {
      T.$('#cf-next').addEventListener('click', function () {
        var name = T.$('#cf-name').value.trim();
        var email = T.$('#cf-email').value.trim();
        var phone = T.$('#cf-phone').value.trim();
        var ok = true;
        ok = valid('#cf-name', name.length >= 2) && ok;
        ok = valid('#cf-email', T.validEmail(email)) && ok;
        ok = valid('#cf-phone', (phone.replace(/\D/g, '')).length >= 7) && ok;
        if (!ok) { T.toast('Please fix the highlighted fields.', 'error'); return; }
        ck.form = { fullName: name, email: email, phone: phone, requests: T.$('#cf-req').value.trim() };
        ck.discount = 0;
        ck.step = 2;
        window.Router.renderView('checkout', []);
      });
      function valid(sel, ok) {
        var field = T.$(sel).closest('.field');
        field.classList.toggle('invalid', !ok);
        return ok;
      }
    }

    if (ck.step === 2) {
      if (T.$('#cf-back')) T.$('#cf-back').addEventListener('click', function () { ck.step = 1; window.Router.renderView('checkout', []); });
      if (T.$('#cf-confirm')) {
        T.$('#cf-confirm').addEventListener('click', function () {
          var terms = T.$('#cf-terms');
          if (terms && !terms.checked) { T.toast('Please tick the demo confirmation box.', 'error'); return; }
          var btn = T.$('#cf-confirm');
          btn.disabled = true;
          var old = btn.innerHTML;
          btn.innerHTML = '<span class="spinner"></span> Confirming…';
          T.delay(1000).then(function () {
            var booking = S.placeBooking(S.state.cart, ck.form, ck.discount);
            ck.step = 1;
            ck.form = { fullName: '', email: '', phone: '', requests: '' };
            ck.discount = 0;
            window.location.hash = '#/confirmation/' + booking.id;
          });
        });
      }
    }
  }

  window.Views = window.Views || {};
  window.Views.checkout = { render: render, mount: mount };
 })();
