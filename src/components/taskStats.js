(function () {
  'use strict';

  angular
    .module('legacyApp.tasks')
    .component('taskStats', {
      bindings: {
        open: '<',
        done: '<',
        total: '<'
      },
      template: '<div class="stats">' +
        '<strong>{{$ctrl.open}}</strong> open | ' +
        '<strong>{{$ctrl.done}}</strong> done | ' +
        '<strong>{{$ctrl.total}}</strong> total' +
        '</div>'
    });
})();
