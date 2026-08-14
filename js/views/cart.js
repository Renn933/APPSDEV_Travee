/* ============================================================
   Travee — view: cart
   Cart list, traveler steppers, coupon, order summary, checkout.
   ============================================================ */
(function () {
  'use strict';
  var D = window.TraveeData, T = window.Travee, S = window.TraveeState;

  function render() {
    var items = S.state.cart;
    var info = S.cartInfo();
    if (!items.length) {
      return '' +
        '<div class="container">' +
          '<h1 class="screen-title">Your cart</h1>' +
          '<div class="empty">' +
            '<div class="icon">🧳</div>' +
            '<h3>Your cart is empty</h3>' +
            '<p>Looks like you haven’t picked any flights yet.</p>' +
            '<a class="btn btn-primary" href="#/">Find flights</a>' +
          '</div>' +
        '</div>';
    }
    return '' +
      '<div class="container">' +
        '<h1 class="screen-title">Your cart</h1>' +
        '<p class="screen-sub">' + info.count + (info.count === 1 ? ' flight' : ' flights') + ' ready to book</p>' +
        '<div class="cart-grid">' +
          '<div id="cart-items">' + items.map(cartItemHtml).join('') + '</div>' +
          '<aside class="cart-summary">' +
            '<h3>Order summary</h3>' +
            '<div class="sum-row"><span>Subtotal</span><span id="sum-subtotal">' + T.money(info.subtotal) + '</span></div>' +
            '<div class="sum-row" id="sum-discount-row" style="display:none"><span>Discount</span><span class="green" id="sum-discount">−' + T.money(0) + '</span></div>' +
            '<hr class="divider">' +
            '<div class="sum-row total"><span>Total</span><span id="sum-total">' + T.money(info.subtotal) + '</span></div>' +
            '<div class="field mt-1">' +
              '<label for="coupon-input">Promo code</label>' +
              '<div class="field-search">' +
                '<input id="coupon-input" type="text" placeholder="e.g. TRAVEE10" aria-label="Promo code">' +
                '<button class="btn btn-soft" id="coupon-apply" type="button">Apply</button>' +
              '</div>' +
            '</div>' +
            '<p class="points-note"><span aria-hidden="true">✦</span> You’ll earn roughly ' + Math.round(info.subtotal / 10) + ' points on this order</p>' +
            '<button class="btn btn-accent" style="width:100%;margin-top:.8rem" id="checkout-btn" type="button">Checkout →</button>' +
            '<button class="btn btn-ghost btn-sm" style="width:100%;margin-top:.6rem" id="clear-cart-btn" type="button">Clear cart</button>' +
          '</aside>' +
        '</div>' +
      '</div>';
  }

  function cartItemHtml(it) {
    var cat = D.getCategory(it.cat);
    var line = it.unit * it.travelers;
    var thumb = it.photo
      ? 'background-image:url(\'' + it.photo + '\');background-size:cover;background-position:center'
      : 'background:' + cat.gradient;
    return '' +
      '<div class="cart-item" data-id="' + it.id + '">' +
        '<a href="#/destination/' + it.destId + '"><div class="cart-thumb" style="' + thumb + '">' + (it.photo ? '' : it.art) + '</div></a>' +
        '<div class="cart-item-info">' +
          '<h4><a href="#/destination/' + it.destId + '">' + T.esc(it.destName) + '</a></h4>' +
          '<div class="sub">' + it.pkgLabel + ' class · Departing ' + T.formatDate(it.date) + '</div>' +
          '<div class="cart-actions">' +
            '<div class="stepper">' +
              '<button type="button" class="trv-chg" data-delta="-1" aria-label="Fewer travelers">−</button>' +
              '<span class="val">' + it.travelers + '</span>' +
              '<button type="button" class="trv-chg" data-delta="1" aria-label="More travelers">+</button>' +
            '</div>' +
            '<span class="small muted">' + it.travelers + ' traveler' + (it.travelers > 1 ? 's' : '') + ' × ' + T.money(it.unit) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="cart-item-right">' +
          '<div class="cart-line-total">' + T.money(line) + '</div>' +
          '<button class="btn btn-danger btn-sm remove-btn" type="button" style="margin-top:.5rem">Remove</button>' +
        '</div>' +
      '</div>';
  }

  function mount() {
    if (!T.$('#cart-items')) return;
    var items = S.state.cart;
    var couponApplied = null;

    function compute() {
      var info = S.cartInfo();
      var subtotal = info.subtotal;
      var discount = couponApplied ? S.applyDiscount(subtotal, couponApplied) || 0 : 0;
      var total = Math.max(0, subtotal - discount);
      T.$('#sum-subtotal').textContent = T.money(subtotal);
      if (couponApplied) {
        T.$('#sum-discount').textContent = '−' + T.money(discount);
        T.$('#sum-discount-row').style.display = 'flex';
      } else {
        T.$('#sum-discount-row').style.display = 'none';
      }
      T.$('#sum-total').textContent = T.money(total);
      return { subtotal: subtotal, discount: discount, total: total };
    }

    function rerender() {
      T.$('#cart-items').innerHTML = S.state.cart.map(cartItemHtml).join('');
      mountControls();
      compute();
      if (!S.state.cart.length) { window.Router.renderView('cart', []); return; }
      window.Router.refreshBars();
    }
    function mountControls() {
      T.$$('.trv-chg').forEach(function (b) {
        b.addEventListener('click', function () {
          var row = b.closest('.cart-item');
          S.updateCartTravelers(row.getAttribute('data-id'), Number(b.getAttribute('data-delta')));
          rerender();
        });
      });
      T.$$('.remove-btn').forEach(function (b) {
        b.addEventListener('click', function () {
          var row = b.closest('.cart-item');
          T.confirmModal('Remove from cart?', 'This flight will be removed from your cart.', 'Remove', true).then(function (yes) {
            if (yes) { S.removeFromCart(row.getAttribute('data-id')); rerender(); T.toast('Removed from cart', 'info'); }
          });
        });
      });
    }
    mountControls();
    T.$('#coupon-apply').addEventListener('click', function () {
      var code = T.$('#coupon-input').value.trim();
      var info = S.cartInfo();
      var applied = S.applyDiscount(info.subtotal, code);
      if (applied == null) { T.toast('That promo code isn’t valid. Try TRAVEE10 or EXPLORE50.', 'error'); return; }
      couponApplied = code.toUpperCase();
      T.$('#coupon-input').value = '';
      compute();
      T.toast('Promo applied: ' + (window.TraveeData.COUPONS[couponApplied] ? window.TraveeData.COUPONS[couponApplied].label : ''), 'success');
    });
    T.$('#checkout-btn').addEventListener('click', function () { window.location.hash = '#/checkout'; });
    T.$('#clear-cart-btn').addEventListener('click', function () {
      T.confirmModal('Clear your cart?', 'All ' + S.state.cart.length + ' flights will be removed.', 'Clear cart', true).then(function (yes) {
        if (yes) { S.clearCart(); T.toast('Cart cleared', 'info'); }
      });
    });
    compute();
  }

  window.Views = window.Views || {};
  window.Views.cart = { render: render, mount: mount };
})();
