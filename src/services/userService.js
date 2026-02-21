(function () {
  'use strict';

  angular
    .module('legacyApp.users')
    .service('userService', userService);

  userService.$inject = ['$q', '$timeout'];

  function userService($q, $timeout) {
    var cachedUsers = null;

    this.fetchUsers = function () {
      var deferred = $q.defer();

      $timeout(function () {
        if (!cachedUsers) {
          cachedUsers = [
            { name: 'Avery Reed', role: 'Admin' },
            { name: 'Casey Patel', role: 'Editor' },
            { name: 'Jordan Kim', role: 'Viewer' }
          ];
        } else {
          // Mutate in-place to simulate non-immutable updates.
          cachedUsers[0].role = cachedUsers[0].role === 'Admin' ? 'Owner' : 'Admin';
        }

        deferred.resolve(cachedUsers);
      }, 800);

      return deferred.promise;
    };
  }
})();
