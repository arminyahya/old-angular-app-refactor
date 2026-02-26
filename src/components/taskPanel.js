(function () {
  'use strict';

  angular
    .module('legacyApp.tasks')
    .component('taskPanel', {
      bindings: {
        tasks: '<',
        filteredTasks: '<',
        newTaskTitle: '=',
        newTaskPriority: '=',
        filterState: '=',
        searchText: '=',
        openCount: '<',
        doneCount: '<',
        onAdd: '&',
        onRemove: '&',
        onToggleDone: '&',
        onApplyFilter: '&'
      },
      templateUrl: 'components/templates/taskPanel.html'
    });
})();
