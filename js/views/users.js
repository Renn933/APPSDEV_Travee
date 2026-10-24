/* ============================================================
   Travee — view: users (admin only)
   Lets the admin create receptionist / admin / dashboard /
   traveler accounts, and remove existing ones. Guarded by the
   "manage_users" capability and the router's role guard.
   ============================================================ */
(function () {
  'use strict';
  var D = window.TraveeData, T = window.Travee, S = window.TraveeState, R = window.TraveeRoles;

  /* Roles an admin may assign (admin can mint any role). */
  function assignableRoles() {
    return ['admin', 'receptionist', 'dashboard', 'traveler'].map(function (id) { return R.getRole(id); });
  }

  function userRow(u) {
    var role = R.getRole(u.role);
    var isSelf = S.state.user && S.state.user.username === u.username;
    var isAdmin = u.username === 'admin';
    return '' +
      '<div class="booking-row user-row">' +
        '<div class="booking-head">' +
          '<div><strong>' + T.esc(u.name) + '</strong>' +
            '<div class="small muted">@' + T.esc(u.username) + '</div></div>' +
          '<span class="role-badge">' + T.icon(role.icon) + ' ' + T.esc(role.label) + '</span>' +
        '</div>' +
        '<div class="flex spread mt-1">' +
          '<span class="small muted">' + (isAdmin ? 'Built-in superuser' : (isSelf ? 'This is you' : T.esc(role.tagline))) + '</span>' +
          (!isAdmin && !isSelf
            ? '<button class="btn btn-ghost btn-sm is-danger user-del" data-username="' + T.esc(u.username) + '" type="button">Remove</button>'
            : '') +
        '</div>' +
      '</div>';
  }

  function render() {
    if (!S.can('manage_users')) {
      return '<div class="container"><div class="empty"><div class="icon">' + T.icon('lock') + '</div><h3>Admins only</h3><p>You don’t have permission to manage users.</p><a class="btn btn-primary" href="#/dashboard">Back to board</a></div></div>';
    }
    var users = S.listUsers();
    var roleOpts = assignableRoles().map(function (r) {
      return '<option value="' + r.id + '">' + T.esc(r.label) + ' — ' + T.esc(r.tagline) + '</option>';
    }).join('');

    return '' +
      '<div class="container">' +
        '<h1 class="screen-title">Manage users</h1>' +
        '<p class="screen-sub">Create receptionist, admin, dashboard or traveler accounts. Only the admin can do this.</p>' +
        '<div class="users-cols">' +
          '<section class="panel panel-pad">' +
            '<h2 class="dash-h">Create a user</h2>' +
            '<form id="user-form" novalidate>' +
              '<div class="field"><label for="nu-name">Full name</label><div class="input-wrap"><input id="nu-name" type="text" placeholder="e.g. Rico Cruz" autocomplete="off"></div><div class="err">Enter at least 2 characters.</div></div>' +
              '<div class="field"><label for="nu-user">Username</label><div class="input-wrap"><input id="nu-user" type="text" placeholder="e.g. rico" autocomplete="off"></div><div class="err">At least 3 characters.</div></div>' +
              '<div class="field"><label for="nu-pass">Password</label><div class="input-wrap"><input id="nu-pass" type="password" placeholder="••••••" autocomplete="new-password"></div><div class="err">At least 4 characters.</div></div>' +
              '<div class="field"><label for="nu-role">Role</label><div class="input-wrap"><select id="nu-role" class="field-select">' + roleOpts + '</select></div></div>' +
              '<button class="btn btn-go" style="width:100%" type="submit" data-load>Create user</button>' +
            '</form>' +
          '</section>' +
          '<section class="panel panel-pad">' +
            '<div class="flex spread" style="align-items:center"><h2 class="dash-h" style="margin:0">Accounts</h2><span class="small muted">' + users.length + ' total</span></div>' +
            '<div class="mt-2">' + users.map(userRow).join('') + '</div>' +
          '</section>' +
        '</div>' +
      '</div>';
  }

  function setErr(input, good) {
    var wrap = input.closest('.field');
    if (wrap) wrap.classList.toggle('invalid', !good);
    input.setAttribute('aria-invalid', good ? 'false' : 'true');
  }

  function mount() {
    /* Create-user form. */
    var form = T.$('#user-form');
    if (form) {
      var name = T.$('#nu-name'), user = T.$('#nu-user'), pass = T.$('#nu-pass'), role = T.$('#nu-role');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var okName = name.value.trim().length >= 2;
        var okUser = user.value.trim().length >= 3;
        var okPass = pass.value.length >= 4;
        setErr(name, okName); setErr(user, okUser); setErr(pass, okPass);
        if (!(okName && okUser && okPass)) {
          T.toast('Please fix the highlighted fields.', 'error');
          var bad = T.$('.field.invalid input', form);
          if (bad) bad.focus();
          return;
        }
        var btn = T.$('[data-load]', form);
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Creating…';
        T.delay(500).then(function () {
          var res = S.createUser(name.value.trim(), user.value.trim(), pass.value, role.value);
          btn.disabled = false;
          btn.textContent = 'Create user';
          if (!res.ok) { T.toast(res.error, 'error'); return; }
          T.toast('Created ' + user.value.trim() + ' (' + R.getRole(role.value).label + ')', 'success');
          window.Router.renderView('users', []);
        });
      });
    }

    /* Remove-user buttons. */
    T.$$('.user-del').forEach(function (b) {
      b.addEventListener('click', function () {
        var username = b.getAttribute('data-username');
        T.confirmModal('Remove this account?', username + ' will no longer be able to sign in.', 'Remove', true).then(function (yes) {
          if (!yes) return;
          var res = S.deleteUser(username);
          if (res.ok) { T.toast('Removed ' + username, 'info'); window.Router.renderView('users', []); }
          else T.toast(res.error, 'error');
        });
      });
    });
  }

  window.Views = window.Views || {};
  window.Views.users = { render: render, mount: mount };
})();