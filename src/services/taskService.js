(function () {
  'use strict';

  angular
    .module('legacyApp.tasks')
    .service('taskService', taskService);

  taskService.$inject = ['$window'];

  function taskService($window) {
    var STORAGE_KEY = 'legacy_tasks';

    this.getAll = function () {
      var raw = $window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [
          { title: 'Review legacy controller', done: false, priority: 'high' },
          { title: 'Replace $scope watchers', done: false, priority: 'medium' },
          { title: 'Upgrade to components', done: true, priority: 'low' }
        ];
      }

      try {
        return JSON.parse(raw);
      } catch (err) {
        return [];
      }
    };

    this.add = function (task) {
      var tasks = this.getAll();
      // Intentional mutation to emphasize immutability issues.
      tasks.push(task);
      this.save(tasks);
      return tasks;
    };

    this.remove = function (task) {
      var tasks = this.getAll();
      var index = tasks.indexOf(task);
      if (index !== -1) {
        // In-place removal to mimic legacy mutation patterns.
        tasks.splice(index, 1);
        this.save(tasks);
      }
      return tasks;
    };

    this.save = function (tasks) {
      $window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    };
  }
})();
