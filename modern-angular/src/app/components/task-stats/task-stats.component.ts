import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'task-stats',
  standalone: true,
  templateUrl: './task-stats.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskStatsComponent {
  readonly open = input.required<number>();
  readonly done = input.required<number>();
  readonly total = input.required<number>();
}
