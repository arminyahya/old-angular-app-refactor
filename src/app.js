(function () {
  'use strict';

  angular
    .module('legacyApp', [
      'legacyApp.core',
      'legacyApp.tasks',
      'legacyApp.users'
    ])
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', 'taskService', 'userService'];

  function MainCtrl($scope, taskService, userService) {
    var vm = this;

    vm.tasks = taskService.getAll();
    vm.filteredTasks = [];
    vm.users = [];

    vm.newTaskTitle = '';
    vm.newTaskPriority = 'medium';
    vm.filterState = 'all';
    vm.searchText = '';

    vm.openCount = 0;
    vm.doneCount = 0;

    vm.addTask = addTask;
    vm.removeTask = removeTask;
    vm.applyFilter = applyFilter;
    vm.persist = persist;
    vm.loadUsers = loadUsers;

    init();

    function init() {
      applyFilter();

      // Legacy style watcher that updates counts.
      $scope.$watch(function () {
        return vm.tasks;
      }, function () {
        updateCounts();
      }, true);

      // Another deep watcher that mutates in-place (immutability issue).
      $scope.$watch(function () {
        return vm.filteredTasks;
      }, function () {
        // Normalize priorities in-place to illustrate mutation patterns.
        vm.filteredTasks.forEach(function (task) {
          task.priority = (task.priority || 'medium').toLowerCase();
        });
      }, true);
    }

    function addTask() {
      if (!vm.newTaskTitle) {
        return;
      }

      taskService.add({
        title: vm.newTaskTitle,
        done: false,
        priority: vm.newTaskPriority
      });

      vm.newTaskTitle = '';
      vm.newTaskPriority = 'medium';
      applyFilter();
      persist();
    }

    function removeTask(task) {
      taskService.remove(task);
      applyFilter();
      persist();
    }

    function applyFilter() {
      var state = vm.filterState;
      var search = (vm.searchText || '').toLowerCase();

      vm.filteredTasks = vm.tasks.filter(function (task) {
        var matchesState = (state === 'all') ||
          (state === 'open' && !task.done) ||
          (state === 'done' && task.done);

        var matchesSearch = !search || task.title.toLowerCase().indexOf(search) !== -1;

        return matchesState && matchesSearch;
      });

      updateCounts();
    }

    function updateCounts() {
      var open = 0;
      var done = 0;

      vm.tasks.forEach(function (task) {
        if (task.done) {
          done += 1;
        } else {
          open += 1;
        }
      });

      vm.openCount = open;
      vm.doneCount = done;
    }

    function persist() {
      taskService.save(vm.tasks);
    }

    function loadUsers() {
      vm.users = [];

      userService.fetchUsers().then(function (users) {
        vm.users = users;
      }, function () {
        vm.users = [{ name: 'Error loading users', role: 'n/a' }];
      });
    }
  }
})();
