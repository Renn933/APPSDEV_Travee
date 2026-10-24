/* ============================================================
   Travee — view: dashboard (flight status board)
   Viewable by EVERY signed-in role. Shows each booked flight's
   live situation — Available, Boarding or Cancelled — plus
   summary tiles. Staff roles (manage_bookings) can flip a
   flight between Available/Boarding or cancel it from here;
   the read-only "dashboard" role and travelers just watch.
   ============================================================ */
(function () {
  'use strict';
  var D = window.TraveeData, T = window.Travee, S = window.TraveeState;

  var STATUS = {
    available: { label: 'Available', icon: 'check', cls: 'available' },
    boarding:  { label: 'Boarding',  icon: 'plane', cls: 'boarding' },
    cancelled: { label: 'Cancelled', icon: 'close', cls: 'cancelled' }
  };

  /* Tally flights by status + a small top-routes roll-up. */
  function computeStats() {
    var stats = { total: 0, available: 0, boarding: 0, cancelled: 0, seats: 0 };
    var byDest = {};
    S.state.bookings.forEach(function (b) {
      var s = S.flightStatus(b);
      stats.total++;
      stats[s]++;
      (b.items || []).forEach(function (it) {
        var key = it.destName || 'Unknown';
        byDest[key] = (byDest[key] || 0) + (it.travelers || 1);
      });
    });
    stats.seats = Object.keys(byDest).reduce(function (sum, k) { return sum + byDest[k]; }, 0);
    var top = Object.keys(byDest).map(function (k) { return { name: k, count: byDest[k] }; });
    top.sort(function (a, b) { return b.count - a.count; });
    top = top.slice(0, 5);
    var max = top.length ? top[0].count : 1;
    top.forEach(function (r) { r.pct = Math.max(8, Math.round((r.count / max) * 100)); });
    stats.topRoutes = top;
    return stats;
  }

  function statCard(icon, label, value, tone) {
    return '' +
      '<div class="stat-card ' + (tone || '') + '">' +
        '<div class="stat-icon" aria-hidden="true">' + icon + '</div>' +
        '<div class="stat-body">' +
          '<div class="stat-num num-tabular">' + value + '</div>' +
          '<div class="stat-label">' + label + '</div>' +
        '</div>' +
      '</div>';
  }

  function statusBadge(b) {
    var s = STATUS[S.flightStatus(b)] || STATUS.cancelled;
    return '<span class="badge-status ' + s.cls + '">' + T.icon(s.icon) + ' ' + s.label + '</span>';
  }

  /* Filter state lives on the view object so re-renders keep the choice. */
  var filter = 'all';

  function render() {
    var user = S.state.user || {};
    var role = S.currentRole() || {};
    var st = computeStats();
    var canManage = S.can('manage_bookings');

    var cards = '' +
      statCard(T.icon('folder'), 'Total flights', st.total) +
      statCard(T.icon('check'), 'Available', st.available, 'ok') +
      statCard(T.icon('plane'), 'Boarding', st.boarding, 'gold') +
      statCard(T.icon('close'), 'Cancelled', st.cancelled, 'bad') +
      statCard(T.icon('suitcase'), 'Seats booked', st.seats);

    /* Filter chips: All / Available / Boarding / Cancelled. */
    var chips = [['all', 'All', st.total]].concat([
      ['available', STATUS.available.label, st.available],
      ['boarding', STATUS.boarding.label, st.boarding],
      ['cancelled', STATUS.cancelled.label, st.cancelled]
    ]).map(function (c) {
      return '<button class="chip' + (filter === c[0] ? ' active' : '') + '" data-status="' + c[0] + '" type="button">' +
        c[1] + ' <span class="num-tabular">' + c[2] + '</span></button>';
    }).join('');

    var routesHtml = st.topRoutes.length
      ? '<ul class="top-routes">' + st.topRoutes.map(function (r) {
          return '<li>' +
            '<span class="tr-name">' + T.esc(r.name) + '</span>' +
            '<span class="tr-bar"><span style="width:' + r.pct + '%"></span></span>' +
            '<span class="tr-count num-tabular">' + r.count + '</span>' +
          '</li>';
        }).join('') + '</ul>'
      : '<p class="muted">No seats booked yet — top routes will appear here.</p>';

    var shown = S.state.bookings.filter(function (b) { return filter === 'all' || S.flightStatus(b) === filter; });
    var boardHtml;
    if (!shown.length) {
      boardHtml = '<div class="empty"><div class="icon">' + T.icon('plane') + '</div><h3>No flights here</h3>' +
        '<p>' + (S.state.bookings.length ? 'No flights match this filter.' : 'Once flights are booked they appear on this board with their live status.') + '</p></div>';
    } else {
      boardHtml = shown.map(function (b) {
        var items = (b.items || []).map(function (it) { return it.travelers + '× ' + T.esc(it.destName); }).join(', ');
        var lead = (b.traveler && b.traveler.fullName) ? T.esc(b.traveler.fullName) : '—';
        var dep = (b.items && b.items[0] && b.items[0].date) ? T.formatDate(b.items[0].date) : '—';
        var st2 = S.flightStatus(b);
        /* Staff can move a confirmed flight Available ⇄ Boarding, or cancel it. */
        var actions = '';
        if (canManage && st2 !== 'cancelled') {
          actions += st2 === 'boarding'
            ? '<button class="btn btn-ghost btn-sm dash-board" data-id="' + b.id + '" data-val="false" type="button">Mark available</button>'
            : '<button class="btn btn-ghost btn-sm dash-board" data-id="' + b.id + '" data-val="true" type="button">Start boarding</button>';
          actions += '<button class="btn btn-ghost btn-sm is-danger dash-cancel" data-id="' + b.id + '" type="button">Cancel</button>';
        }
        return '' +
          '<div class="booking-row">' +
            '<div class="booking-head">' +
              '<div><strong>' + items + '</strong>' +
                '<div class="small muted">' + b.ref + ' · ' + lead + ' · departs ' + dep + '</div></div>' +
              '<div class="flex">' + statusBadge(b) + '</div>' +
            '</div>' +
            '<div class="flex spread mt-1">' +
              '<span class="small muted">Total <span class="num-tabular">' + T.money(b.total || 0) + '</span> · <span class="green">' + T.icon('star') + ' +<span class="num-tabular">' + (b.pointsEarned || 0) + '</span> pts</span></span>' +
              (actions ? '<div class="flex" style="gap:.4rem">' + actions + '</div>' : '') +
            '</div>' +
          '</div>';
      }).join('');
    }

    return '' +
      '<div class="container">' +
        '<div class="flex spread" style="align-items:flex-start;gap:1rem;flex-wrap:wrap">' +
          '<div><h1 class="screen-title" style="margin-bottom:.15rem">Flight status board</h1>' +
          '<p class="screen-sub" style="margin-bottom:0">Welcome, ' + T.esc(user.name || 'there') + ' — live situation of every flight.</p></div>' +
          '<span class="role-badge">' + T.icon(role.icon || 'suitcase') + ' ' + T.esc(role.label || 'Traveler') + (canManage ? '' : ' · read-only') + '</span>' +
        '</div>' +
        '<div class="dash-stats mt-3">' + cards + '</div>' +
        '<div class="chips mt-3" id="status-chips">' + chips + '</div>' +
        '<div class="dash-cols mt-3">' +
          '<section class="panel panel-pad">' +
            '<h2 class="dash-h">Top routes</h2>' + routesHtml +
          '</section>' +
          '<section class="panel panel-pad">' +
            '<div class="flex spread" style="align-items:center"><h2 class="dash-h" style="margin:0">Flights</h2>' +
            (canManage ? '' : '<span class="small muted">View only</span>') + '</div>' +
            '<div class="mt-2">' + boardHtml + '</div>' +
          '</section>' +
        '</div>' +
      '</div>';
  }

  function mount() {
    /* Filter chips — update the view-local filter and re-render. */
    T.$$('#status-chips .chip').forEach(function (c) {
      c.addEventListener('click', function () {
        filter = c.getAttribute('data-status');
        window.Router.renderView('dashboard', []);
      });
    });

    /* Staff: toggle Available ⇄ Boarding. */
    T.$$('.dash-board').forEach(function (b) {
      b.addEventListener('click', function () {
        var res = S.setBoarding(b.getAttribute('data-id'), b.getAttribute('data-val') === 'true');
        if (res.ok) { T.toast(b.getAttribute('data-val') === 'true' ? 'Flight now boarding' : 'Flight marked available', 'success'); window.Router.renderView('dashboard', []); }
        else T.toast(res.error, 'error');
      });
    });

    /* Staff: cancel a flight. */
    T.$$('.dash-cancel').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id');
        T.confirmModal('Cancel this flight?', 'The loyalty points earned from this booking will be deducted.', 'Cancel flight', true).then(function (yes) {
          if (yes && S.cancelBooking(id)) {
            T.toast('Flight cancelled', 'info');
            window.Router.renderView('dashboard', []);
          }
        });
      });
    });
  }

  window.Views = window.Views || {};
  window.Views.dashboard = { render: render, mount: mount };
})();
