import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() newTaskTitle = '';
  @Input() newTaskPriority = 'medium';
  @Input() filterState = 'all';
  @Input() searchText = '';
  @Input() openCount = 0;
  @Input() doneCount = 0;

  @Output() newTaskTitleChange = new EventEmitter<string>();
  @Output() newTaskPriorityChange = new EventEmitter<string>();
  @Output() filterStateChange = new EventEmitter<string>();
  @Output() searchTextChange = new EventEmitter<string>();

  @Output() add = new EventEmitter<void>();
  @Output() remove = new EventEmitter<Task>();
  @Output() toggleDone = new EventEmitter<Task>();
  @Output() applyFilter = new EventEmitter<void>();

  private searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  onSearchTextChanged(value: string): void {
    this.searchTextChange.emit(value);
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    this.searchDebounceTimer = setTimeout(() => {
      this.applyFilter.emit();
    }, 150);
  }
}
