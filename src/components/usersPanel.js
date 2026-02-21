(function () {
  'use strict';

  angular
    .module('legacyApp.users')
    .component('usersPanel', {
      bindings: {
        users: '<',
        onLoad: '&'
      },
      templateUrl: 'components/templates/usersPanel.html'
    });
})();
