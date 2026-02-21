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
      normalizePriorities(vm.tasks);
      applyFilter();

      $scope.$watchGroup([
        function () { return vm.filterState; },
        function () { return vm.searchText; }
      ], function () {
        applyFilter();
      });

      // Keep counts/filter aligned when "done" changes via checkbox.
      $scope.$watch(taskDoneSignature, function (next, prev) {
        if (next !== prev) {
          applyFilter();
        }
      });
    }

    function addTask() {
      if (!vm.newTaskTitle) {
        return;
      }

      vm.tasks = taskService.add({
        title: vm.newTaskTitle,
        done: false,
        priority: vm.newTaskPriority
      });

      vm.newTaskTitle = '';
      vm.newTaskPriority = 'medium';
      normalizePriorities(vm.tasks);
      applyFilter();
      persist();
    }

    function removeTask(task) {
      vm.tasks = taskService.remove(task);
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

    function normalizePriorities(tasks) {
      tasks.forEach(function (task) {
        task.priority = (task.priority || 'medium').toLowerCase();
      });
    }

    function taskDoneSignature() {
      return vm.tasks.map(function (task) {
        return task.done ? '1' : '0';
      }).join('|');
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
