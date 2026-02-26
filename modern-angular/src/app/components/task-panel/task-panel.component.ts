import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Task } from '../../models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskStatsComponent } from '../task-stats/task-stats.component';

@Component({
  selector: 'task-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskStatsComponent, TaskItemComponent],
  templateUrl: './task-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
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
  @Input() autoPrioritizing = false;
  @Input() autoPriorityStatus = '';

  @Output() add = new EventEmitter<void>();
  @Output() autoPrioritize = new EventEmitter<void>();
  @Output() remove = new EventEmitter<Task>();
  @Output() toggleDone = new EventEmitter<Task>();
}
