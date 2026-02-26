import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Task } from '../../models/task.model';

@Component({
  selector: 'li[task-item]',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskItemComponent {
  readonly task = input.required<Task>();

  @Output() remove = new EventEmitter<Task>();
  @Output() toggleDone = new EventEmitter<Task>();

  onDoneChange(done: boolean): void {
    const task = this.task();
    this.toggleDone.emit({ ...task, done });
  }

  onRemove(): void {
    this.remove.emit(this.task());
  }
}
