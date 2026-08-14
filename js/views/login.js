/* ============================================================
   Travee — view: login
   Fake login/profile backed by localStorage. Demo only.
   ============================================================ */
(function () {
  'use strict';
  var D = window.TraveeData, T = window.Travee, S = window.TraveeState;

  function render() {
    var manual = D.DESTINATIONS.length + ' destinations across ' + Object.keys(D.CATEGORIES).length + ' categories';
    return '' +
      '<div class="login-wrap">' +
        '<div class="login-card">' +
          '<div class="login-brand"><span class="brand-mark" aria-hidden="true">✈</span> <span>Travee</span></div>' +
          '<div class="center"><span class="demo-shield">🔒 Demo login — saved in your browser</span></div>' +
          '<div class="tabs">' +
            '<button class="tab active" data-tab="signin" type="button">Sign in</button>' +
            '<button class="tab" data-tab="create" type="button">Create profile</button>' +
          '</div>' +
          '<form id="login-form" novalidate>' +
            '<div class="field">' +
              '<label for="lf-name">Your name</label>' +
              '<input id="lf-name" name="name" type="text" placeholder="e.g. Alex Reed" autocomplete="name">' +
              '<div class="err" data-for="name">Please enter at least 2 characters.</div>' +
            '</div>' +
            '<div class="field">' +
              '<label for="lf-email">Email</label>' +
              '<input id="lf-email" name="email" type="email" placeholder="you@example.com" autocomplete="email">' +
              '<div class="err" data-for="email">Enter a valid email address.</div>' +
            '</div>' +
            '<div class="field">' +
              '<label for="lf-pass">Password <span class="muted small">(demo — any value)</span></label>' +
              '<input id="lf-pass" name="pass" type="password" placeholder="••••••" autocomplete="current-password">' +
              '<div class="err" data-for="pass">Use at least 4 characters.</div>' +
            '</div>' +
            '<button class="btn btn-primary" style="width:100%" type="submit" data-load>Continue</button>' +
          '</form>' +
          '<p class="login-note">This is a demo of the interface, not real security.<br>Your trip data never leaves this browser. Explore ' + manual + '.</p>' +
        '</div>' +
      '</div>';
  }

  function mount() {
    var tabs = T.$$('.tab');
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x) { x.classList.remove('active'); });
        t.classList.add('active');
      });
    });

    var form = T.$('#login-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var name = T.$('#lf-name').value.trim();
      var email = T.$('#lf-email').value.trim();
      var pass = T.$('#lf-pass').value;

      ok = validate('#lf-name', name.length >= 2) && ok;
      ok = validate('#lf-email', T.validEmail(email)) && ok;
      ok = validate('#lf-pass', pass.length >= 4) && ok;
      if (!ok) return;

      var btn = T.$('[data-load]', form);
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Signing in…';
      T.delay(700).then(function () {
        S.login(name, email);
        T.toast('Welcome to Travee, ' + name.split(' ')[0] + '!', 'success');
        window.location.hash = '#/';
      });
    });

    function validate(sel, valid) {
      var field = T.$(sel).closest('.field');
      field.classList.toggle('invalid', !valid);
      return valid;
    }
  }

  window.Views = window.Views || {};
  window.Views.login = { render: render, mount: mount };
})();
