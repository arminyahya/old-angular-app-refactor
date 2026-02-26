import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Task } from '../../models/task.model';
import { TaskStatsComponent } from '../task-stats/task-stats.component';

@Component({
  selector: 'task-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskStatsComponent],
  templateUrl: './task-panel.component.html'
})
export class TaskPanelComponent {
  @Input() tasks: Task[] = [];
  @Input() filteredTasks: Task[] = [];
  newTaskTitle = model('');
  newTaskPriority = model('medium');
  filterState = model('all');
  searchText = model('');
  @Input() openCount = 0;
  @Input() doneCount = 0;

  @Output() add = new EventEmitter<void>();
  @Output() remove = new EventEmitter<Task>();
  @Output() toggleDone = new EventEmitter<Task>();
}
