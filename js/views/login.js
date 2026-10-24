/* ============================================================
   Travee — view: login
   Credential-based sign in (username + password) plus traveler
   self-signup. Demo only — accounts live in localStorage.
   Built-in demo logins are shown as one-tap buttons.
   ============================================================ */
(function () {
  'use strict';
  var D = window.TraveeData, T = window.Travee, S = window.TraveeState;

  var MIN_PASS = 4;   // minimum password length
  var NEW_PASS = 8;   // recommended minimum when creating a profile

  /* One-tap demo accounts (mirrors the seed users in state.js). */
  var DEMO_ACCOUNTS = [
    { username: 'admin',        password: 'admin123', role: 'admin' },
    { username: 'receptionist', password: 'recep123', role: 'receptionist' },
    { username: 'dashboard',    password: 'dash123',  role: 'dashboard' }
  ];

  /* One-tap demo buttons — instantly sign in as a built-in account. */
  function demoButtons() {
    return '<div class="demo-roles"><span class="demo-roles-label">Or sign in with a demo account</span>' +
      '<div class="demo-roles-row">' +
      DEMO_ACCOUNTS.map(function (a) {
        var r = window.TraveeRoles.getRole(a.role);
        return '<button class="btn btn-ghost btn-sm demo-role" type="button" data-username="' + a.username + '" data-password="' + a.password + '">' +
          T.icon(r.icon) + ' ' + T.esc(r.label) + '</button>';
      }).join('') +
      '</div></div>';
  }

  function firstWord(n) { return String(n || '').trim().split(/\s+/)[0] || 'Traveler'; }

  /* Shared field markup. `err` is the message shown when the field is invalid. */
  function field(o) {
    return '<div class="field"><label for="' + o.id + '">' + o.label +
      (o.hint ? ' <span class="muted small">' + o.hint + '</span>' : '') + '</label>' +
      '<div class="input-wrap"><input id="' + o.id + '" name="' + o.name + '" type="' + o.type +
      '" placeholder="' + T.esc(o.ph) + '" autocomplete="' + (o.ac || 'off') + '"' +
      (o.inputmode ? ' inputmode="' + o.inputmode + '"' : '') +
      ' aria-describedby="' + o.id + '-msg">' +
      (o.reveal ? '<button class="reveal" type="button" data-reveal="' + o.id +
        '" aria-pressed="false" aria-label="Show ' + T.esc(o.label) + '">Show</button>' : '') +
      '</div><div class="err" id="' + o.id + '-msg">' + o.err + '</div></div>';
  }

  /* ---------- Sign in: username + password ---------- */
  function signInForm() {
    return '<form id="login-form" novalidate autocomplete="on">' +
      '<h2 class="form-title">Welcome back</h2>' +
      '<p class="form-sub">Sign in to see your trips, saved flights and points.</p>' +
      field({ id: 'lf-user', name: 'username', label: 'Username', type: 'text', ph: 'e.g. admin', ac: 'username', err: 'Enter your username.' }) +
      field({ id: 'lf-pass', name: 'pass', label: 'Password', type: 'password', ph: '••••••', ac: 'current-password', reveal: true, err: 'Enter your password.' }) +
      '<div class="form-row-between"><label class="check"><input type="checkbox" id="lf-remember" checked> <span>Keep me signed in</span></label>' +
      '<button class="linkish" type="button" id="lf-forgot">Forgot password?</button></div>' +
      '<button class="btn btn-go btn-go-lg" style="width:100%" type="submit" data-load>Sign in</button>' +
      '<p class="login-note center">No account yet? Switch to <strong>Create profile</strong> above.</p></form>';
  }

  /* ---------- Create profile: name + username + password + confirm ---------- */
  function createForm() {
    return '<form id="login-form" novalidate autocomplete="on">' +
      '<h2 class="form-title">Create your profile</h2>' +
      '<p class="form-sub">One profile for bookings, saved flights and loyalty points.</p>' +
      field({ id: 'lf-name', name: 'name', label: 'Full name', type: 'text', ph: 'e.g. Alex Reed', ac: 'name', err: 'Please enter at least 2 characters.' }) +
      field({ id: 'lf-user', name: 'username', label: 'Username', type: 'text', ph: 'e.g. alexreed', ac: 'username', err: 'Use at least 3 characters.' }) +
      field({ id: 'lf-pass', name: 'pass', label: 'Password', hint: '(' + NEW_PASS + '+ characters)', type: 'password', ph: '••••••', ac: 'new-password', reveal: true, err: 'Use at least ' + NEW_PASS + ' characters.' }) +
      field({ id: 'lf-pass2', name: 'pass2', label: 'Confirm password', type: 'password', ph: '••••••', ac: 'new-password', reveal: true, err: 'Passwords do not match.' }) +
      '<div class="pw-strength" id="lf-strength" aria-live="polite"><span class="pw-bar"></span><span class="pw-bar"></span><span class="pw-bar"></span><span class="pw-label"></span></div>' +
      '<label class="check"><input type="checkbox" id="lf-terms"> <span>I understand this is a demo — data stays in this browser.</span></label>' +
      '<button class="btn btn-go btn-go-lg" style="width:100%" type="submit" data-load>Create profile</button></form>';
  }

  function render() {
    var count = (S.allDestinations ? S.allDestinations().length : D.DESTINATIONS.length);
    var manual = count + ' flight routes across the Philippines and beyond';
    var create = window.Views.login._mode === 'create';
    return '<div class="login-wrap"><div class="login-card">' +
      '<div class="login-brand"><span class="brand-mark" aria-hidden="true">' + T.icon('plane') + '</span> <span class="brand-name">TRAVEE</span></div>' +
      '<div class="center"><span class="demo-shield">' + T.icon('lock') + ' Demo login — accounts saved in your browser</span></div>' +
      '<div class="tabs" role="tablist" aria-label="Sign in or create a profile">' +
      '<button class="tab' + (create ? '' : ' active') + '" data-tab="signin" type="button" role="tab" id="tab-signin" aria-selected="' + (!create) + '" aria-controls="login-panel" tabindex="' + (create ? '-1' : '0') + '">Sign in</button>' +
      '<button class="tab' + (create ? ' active' : '') + '" data-tab="create" type="button" role="tab" id="tab-create" aria-selected="' + create + '" aria-controls="login-panel" tabindex="' + (create ? '0' : '-1') + '">Create profile</button>' +
      '</div><div id="login-panel" role="tabpanel" aria-labelledby="tab-' + (create ? 'create' : 'signin') + '">' +
      (create ? createForm() : signInForm()) + '</div>' +
      (create ? '' : demoButtons()) +
      '<p class="login-note center">This is a demo of the interface, not real security.<br>Your data never leaves this browser. Explore ' + manual + '.</p>' +
      '</div></div>';
  }

  function mount() {
    var tabs = T.$$('.tab');
    var panel = T.$('#login-panel');

    /* One rule set drives submit validation, blur checks and live clearing. */
    function checkField(input) {
      var v = input.value.trim();
      var pw = input.type === 'password' ? input.value : v;
      if (input.id === 'lf-name') return v.length >= 2;
      if (input.id === 'lf-user') return v.length >= 3;
      if (input.id === 'lf-pass') return pw.length >= (window.Views.login._mode === 'create' ? NEW_PASS : MIN_PASS);
      if (input.id === 'lf-pass2') {
        var first = T.$('#lf-pass', panel);
        return !!first && pw.length > 0 && pw === first.value;
      }
      return true;
    }
    function setState(input, good) {
      var wrap = input.closest('.field');
      if (wrap) wrap.classList.toggle('invalid', !good);
      input.setAttribute('aria-invalid', good ? 'false' : 'true');
    }
    function strength(v) {
      var s = 0;
      if (v.length >= NEW_PASS) s++;
      if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
      if (/\d/.test(v)) s++;
      if (/[^A-Za-z0-9]/.test(v)) s++;
      return s;
    }

    /* Bind everything inside the panel. Re-run after each tab swap. */
    function wirePanel() {
      /* Show / hide password */
      T.$$('[data-reveal]', panel).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var input = T.$('#' + btn.getAttribute('data-reveal'), panel);
          if (!input) return;
          var show = input.type === 'password';
          input.type = show ? 'text' : 'password';
          btn.textContent = show ? 'Hide' : 'Show';
          btn.setAttribute('aria-pressed', show ? 'true' : 'false');
          input.focus();
        });
      });

      /* Live strength meter + confirm-match feedback */
      var meter = T.$('#lf-strength', panel);
      if (meter) {
        var p1 = T.$('#lf-pass', panel), p2 = T.$('#lf-pass2', panel);
        var bars = T.$$('.pw-bar', meter), label = T.$('.pw-label', meter);
        var names = ['', 'Weak', 'Fair', 'Good', 'Strong'];
        function paint() {
          var s = p1.value ? strength(p1.value) : 0;
          bars.forEach(function (b, i) {
            b.classList.toggle('on', i < s);
            b.classList.remove('weak', 'ok');
            if (i < s) b.classList.add(s <= 1 ? 'weak' : 'ok');
          });
          label.textContent = p1.value ? names[s] : '';
          label.className = 'pw-label lv' + s;
          if (p2.value) setState(p2, p2.value === p1.value);
        }
        p1.addEventListener('input', paint);
        p2.addEventListener('input', paint);
      }

      /* Validate on blur; clear the error as soon as the value becomes valid. */
      T.$$('input[type=text], input[type=email], input[type=password]', panel).forEach(function (input) {
        input.addEventListener('blur', function () {
          if (!input.value.trim()) return;
          setState(input, checkField(input));
        });
        input.addEventListener('input', function () {
          if (input.closest('.field').classList.contains('invalid') && checkField(input)) setState(input, true);
        });
      });

      var forgot = T.$('#lf-forgot', panel);
      if (forgot) {
        forgot.addEventListener('click', function () {
          T.toast('Demo only — no password reset is sent.', 'info');
        });
      }

      var form = T.$('#login-form', panel);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var create = window.Views.login._mode === 'create';
        var ok = true;
        T.$$('input[type=text], input[type=email], input[type=password]', form).forEach(function (input) {
          var good = checkField(input);
          setState(input, good);
          ok = good && ok;
        });
        /* Creating a profile needs an explicit acknowledgement. */
        var terms = T.$('#lf-terms');
        if (create && terms && !terms.checked) {
          ok = false;
          T.toast('Please tick the demo confirmation box.', 'error');
        }
        if (!ok) {
          var bad = T.$('.field.invalid input', form);
          if (bad) bad.focus();
          T.toast('Please fix the highlighted fields.', 'error');
          return;
        }

        var username = (T.$('#lf-user', form) || {}).value.trim() || '';
        var password = (T.$('#lf-pass', form) || {}).value || '';
        var nameInput = T.$('#lf-name', form);
        var name = nameInput ? nameInput.value.trim() : '';
        var btn = T.$('[data-load]', form);
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> ' + (create ? 'Creating…' : 'Signing in…');
        T.delay(700).then(function () {
          var res = create
            ? S.signUp(name, username, password)
            : S.signIn(username, password);
          btn.disabled = false;
          btn.textContent = create ? 'Create profile' : 'Sign in';
          if (!res.ok) { T.toast(res.error || 'Something went wrong.', 'error'); return; }
          var who = S.state.user || {};
          T.toast((create ? 'Profile created — welcome, ' : 'Welcome back, ') + firstWord(who.name) + '!', 'success');
          window.location.hash = window.TraveeState.roleHome();
        });
      });
    }

    /* Switching tabs replaces the panel — Sign in never asks for a name. */
    function selectTab(name) {
      window.Views.login._mode = name;
      var create = name === 'create';
      tabs.forEach(function (t) {
        var on = t.getAttribute('data-tab') === name;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      panel.setAttribute('aria-labelledby', 'tab-' + name);
      panel.innerHTML = create ? createForm() : signInForm();
      wirePanel();
      var first = panel.querySelector('input');
      if (first) first.focus();
    }

    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        if (t.getAttribute('data-tab') === window.Views.login._mode) return;
        selectTab(t.getAttribute('data-tab'));
      });
    });

    /* One-tap demo account sign-in — no form required. */
    T.$$('.demo-role').forEach(function (b) {
      b.addEventListener('click', function () {
        var u = b.getAttribute('data-username');
        var p = b.getAttribute('data-password');
        var res = S.signIn(u, p);
        if (!res.ok) { T.toast(res.error || 'Could not sign in.', 'error'); return; }
        T.toast('Signed in as ' + window.TraveeRoles.getRole(S.state.user.role).label, 'success');
        window.location.hash = window.TraveeState.roleHome();
      });
    });

    wirePanel();
    var start = T.$('#login-panel input');
    if (start) start.focus();
  }

  window.Views = window.Views || {};
  window.Views.login = { render: render, mount: mount, _mode: 'signin' };
})();
