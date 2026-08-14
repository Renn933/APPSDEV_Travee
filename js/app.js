/* ============================================================
   Travee — app.js
   Bootstrap: wire global header actions, then start the router.
   ============================================================ */
(function () {
  'use strict';
  var T = window.Travee;

  function wireGlobal() {
    var logoutBtn = T.$('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        T.confirmModal('Sign out?', 'Your saved flights stay in this browser.', 'Sign out', false).then(function (yes) {
          if (yes) {
            window.TraveeState.logout();
            T.toast('Signed out', 'info');
            window.location.hash = '#/login';
          }
        });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    wireGlobal();
    window.Router.init();
  });
})();
