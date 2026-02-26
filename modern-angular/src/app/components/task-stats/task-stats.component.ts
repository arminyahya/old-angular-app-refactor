import { Component, input } from '@angular/core';

@Component({
  selector: 'task-stats',
  standalone: true,
  templateUrl: './task-stats.component.html'
})
export class TaskStatsComponent {
  readonly open = input.required<number>();
  readonly done = input.required<number>();
  readonly total = input.required<number>();
}
