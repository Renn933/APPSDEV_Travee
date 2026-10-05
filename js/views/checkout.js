/* ============================================================
   Travee — view: checkout (2-step: traveler info → review & confirm)
   Holds traveler info, validates, then places the booking.
   ============================================================ */
(function () {
  'use strict';
  var D = window.TraveeData, T = window.Travee, S = window.TraveeState;

  function emptyForm() {
    return { fullName: '', email: '', phone: '', phoneDial: '+63', phoneCountry: 'PH', phoneFull: '', requests: '', travelers: [] };
  }
  var ck = { step: 1, form: emptyForm(), discount: 0 };

  /* Total seats booked across every cart line — this drives how many traveler
     detail blocks step 1 renders and how many entries step 2 reviews. */
  function cartTravelers() {
    var items = S.state.cart, total = 0;
    for (var i = 0; i < items.length; i++) total += (items[i].travelers || 1);
    return total < 1 ? 1 : total;
  }

  /* Keep the traveler list exactly as long as the cart, preserving typed names
     so navigating back and forth never wipes what was entered. */
  function syncTravelers() {
    var need = cartTravelers();
    var list = ck.form.travelers || [];
    while (list.length < need) list.push({ fullName: '' });
    if (list.length > need) list.length = need;
    ck.form.travelers = list;
    return list;
  }

  function render() {
    var items = S.state.cart;
    if (!items.length) {
      return '<div class="container"><div class="empty"><div class="icon">🧳</div><h3>Nothing to check out</h3><p>Add a flight to your cart first.</p><a class="btn btn-primary" href="#/">Find flights</a></div></div>';
    }
    return '' +
      '<div class="container">' +
        '<div class="checkout-shell">' +
          '<h1 class="screen-title">Checkout</h1>' +
          '<div class="steps">' +
            '<div class="step' + (ck.step >= 1 ? ' active' : '') + (ck.step > 1 ? ' done' : '') + '"><span class="dot">' + (ck.step > 1 ? '✓' : '1') + '</span> Traveler details</div>' +
            '<div class="step' + (ck.step >= 2 ? ' active' : '') + '"><span class="dot">2</span> Review &amp; confirm</div>' +
          '</div>' +
          '<div id="checkout-body">' + (ck.step === 1 ? step1() : step2()) + '</div>' +
        '</div>' +
      '</div>';
  }

  /* ---------- phone country helpers ---------- */
  function countryByIso(iso) {
    for (var i = 0; i < D.COUNTRIES.length; i++) if (D.COUNTRIES[i].iso === iso) return D.COUNTRIES[i];
    return D.COUNTRIES[0];
  }
  function countryOptions(selIso) {
    return D.COUNTRIES.map(function (c) {
      return '<option value="' + c.iso + '"' + (c.iso === selIso ? ' selected' : '') +
        ' data-dial="' + c.dial + '" data-sample="' + T.esc(c.sample) + '">' +
        T.esc(c.flag) + ' ' + T.esc(c.name) + ' (' + c.dial + ')</option>';
    }).join('');
  }
  /* National digits only: drop formatting, a pasted dial-code prefix and leading zeros. */
  function phoneDigits(raw, dial) {
    var digits = String(raw || '').replace(/\D/g, '');
    var dialDigits = String(dial || '').replace(/\D/g, '');
    if (dialDigits && digits.indexOf(dialDigits) === 0 && digits.length - dialDigits.length >= 7) {
      digits = digits.slice(dialDigits.length);
    }
    return digits.replace(/^0+/, '');
  }

  function step1() {
    var country = countryByIso(ck.form.phoneCountry);
    var list = syncTravelers();
    var blocks = '';
    for (var i = 0; i < list.length; i++) {
      blocks +=
        '<fieldset class="trav-block">' +
          '<legend><span class="trav-legend-tag">' + (i === 0 ? 'Lead traveler' : 'Traveler ' + (i + 1)) + '</span></legend>' +
          (i === 0 ? '<p class="trav-note">Primary contact — the itinerary is sent here.</p>' : '') +
          '<div class="field"><label for="cf-tname-' + i + '">Full name</label>' +
            '<input id="cf-tname-' + i + '" class="cf-tname" type="text" autocomplete="name" placeholder="As printed on their ID" value="' + T.esc(list[i].fullName) + '">' +
            '<div class="err">Enter the full name (2+ characters).</div>' +
          '</div>' +
          (i === 0 ?
            '<div class="field"><label for="cf-email">Email</label>' +
              '<input id="cf-email" type="email" autocomplete="email" placeholder="jane@example.com" value="' + T.esc(ck.form.email) + '">' +
              '<div class="err">Enter a valid email.</div>' +
            '</div>' +
            '<div class="field"><label for="cf-phone">Phone number</label>' +
              '<div class="phone-row">' +
                '<select id="cf-country" class="field-select" aria-label="Country dial code">' + countryOptions(ck.form.phoneCountry) + '</select>' +
                '<input id="cf-phone" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="' + T.esc(country.sample) + '" value="' + T.esc(ck.form.phone) + '">' +
              '</div>' +
              '<div class="err">Enter a valid phone number (7–15 digits).</div>' +
            '</div>'
            : '') +
        '</fieldset>';
    }
    return '' +
      '<div class="checkout-card">' +
        '<h3>Traveler details</h3>' +
        '<p class="muted small center">' + list.length + (list.length === 1 ? ' traveler' : ' travelers') + ' to enter — one block each, matching your cart. Demo only, nothing is transmitted.</p>' +
        blocks +
        '<div class="field"><label for="cf-req">Special requests <span class="muted small">(optional)</span></label><input id="cf-req" type="text" placeholder="e.g. vegetarian meals" value="' + T.esc(ck.form.requests) + '"></div>' +
        '<div class="checkout-actions">' +
          '<button class="btn btn-go btn-go-lg" id="cf-next" type="button">Continue to review →</button>' +
        '</div>' +
      '</div>';
  }

  function step2() {
    var items = S.state.cart;
    var subtotal = 0;
    for (var i = 0; i < items.length; i++) subtotal += items[i].unit * items[i].travelers;
    var total = Math.max(0, subtotal - ck.discount);
    var rows = items.map(function (it) {
      return '<div class="sum-row"><span>' + it.travelers + '× ' + T.esc(it.destName) + ' · ' + it.pkgLabel + '</span><span class="num-tabular">' + T.money(it.unit * it.travelers) + '</span></div>';
    }).join('');
    var f = ck.form;
    /* One entry per booked traveler, each showing the name captured in step 1.
       Contact details are collected once (lead traveler) and shown separately. */
    var list = syncTravelers();
    var travRows = '';
    for (var n = 0; n < list.length; n++) {
      travRows +=
        '<div class="trav-row">' +
          '<span class="trav-tag">' + (n === 0 ? 'Lead traveler' : 'Traveler ' + (n + 1)) + '</span>' +
          '<span class="trav-lines"><span class="trav-name">' + T.esc(list[n].fullName || '—') + '</span></span>' +
        '</div>';
    }
    var contact = [];
    if (f.email) contact.push(T.esc(f.email));
    if (f.phoneFull) contact.push('<span class="num-tabular">' + T.esc(f.phoneFull) + '</span>');
    var contactHtml = contact.length ? '<div class="trav-contact-row"><span class="trav-contact-label">Contact</span><span>' + contact.join(' &middot; ') + '</span></div>' : '';
    var travRequests = f.requests ? '<div class="sum-row stack trav-notes"><span>Special requests</span><span>' + T.esc(f.requests) + '</span></div>' : '';
    return '<div class="checkout-card">' +
      '<h3>Review your flights</h3>' + rows +
      (ck.discount ? '<div class="sum-row"><span>Discount</span><span class="green num-tabular">−' + T.money(ck.discount) + '</span></div>' : '') +
      '<hr class="divider">' +
      '<div class="sum-row total"><span>Total</span><span class="num-tabular">' + T.money(total) + '</span></div>' +
      '<div class="review-block">' +
        '<div class="review-head"><h4>Traveler details <span class="trav-count">' + list.length + '</span></h4><button class="btn btn-ghost btn-sm" id="cf-edit" type="button">Edit</button></div>' +
        '<div class="trav-list">' + travRows + '</div>' +
        contactHtml +
        travRequests +
      '</div>' +
      '<div class="field mt-2"><label class="terms"><input type="checkbox" id="cf-terms">I understand this is a demo booking with no real payment or itinerary.</label></div>' +
      '<div class="checkout-actions">' +
        '<button class="btn btn-ghost" id="cf-back" type="button">← Back</button>' +
        '<button class="btn btn-go btn-go-lg" id="cf-confirm" type="button">Confirm &amp; book</button>' +
      '</div>' +
    '</div>';
  }

  function mount() {
    if (!T.$('#checkout-body')) return;

    if (ck.step === 1 && T.$('#cf-next')) {
      // Country picker: keep the dial code and example number in sync with the selection.
      var countrySel = T.$('#cf-country');
      if (countrySel) {
        countrySel.addEventListener('change', function () {
          var c = countryByIso(countrySel.value);
          ck.form.phoneCountry = c.iso;
          ck.form.phoneDial = c.dial;
          var input = T.$('#cf-phone');
          input.placeholder = c.sample;
          input.focus();
        });
      }
      T.$('#cf-next').addEventListener('click', function () {
        /* One validation pass per traveler block. */
        var names = T.$$('.cf-tname');
        var list = syncTravelers();
        var ok = true;
        for (var i = 0; i < names.length; i++) {
          var good = names[i].value.trim().length >= 2;
          names[i].closest('.field').classList.toggle('invalid', !good);
          ok = good && ok;
        }

        var email = T.$('#cf-email') ? T.$('#cf-email').value.trim() : '';
        var phoneEl = T.$('#cf-phone');
        var phone = phoneEl ? phoneEl.value.trim() : '';
        var country = countryByIso(T.$('#cf-country') ? T.$('#cf-country').value : 'PH');
        var digits = phoneDigits(phone, country.dial);
        ok = valid('#cf-email', T.validEmail(email)) && ok;
        ok = valid('#cf-phone', digits.length >= 7 && digits.length <= 15) && ok;

        if (!ok) {
          var firstBad = T.$('.field.invalid input');
          if (firstBad) firstBad.focus();
          T.toast('Please fix the highlighted fields.', 'error');
          return;
        }

        /* Persist per traveler, and mirror the lead name into `fullName` so the
           confirmation and profile views keep working unchanged. */
        for (var n = 0; n < list.length; n++) list[n].fullName = names[n].value.trim();
        ck.form.fullName = list[0].fullName;
        ck.form.email = email;
        ck.form.phone = phone;
        ck.form.phoneDial = country.dial;
        ck.form.phoneCountry = country.iso;
        ck.form.phoneFull = country.dial + ' ' + digits;
        ck.form.requests = T.$('#cf-req') ? T.$('#cf-req').value.trim() : '';
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
      if (T.$('#cf-edit')) T.$('#cf-edit').addEventListener('click', function () { ck.step = 1; window.Router.renderView('checkout', []); });
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
            ck.form = emptyForm();
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
