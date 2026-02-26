import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewEncapsulation,
  computed,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';

import { AppHeaderComponent } from './components/app-header/app-header.component';
import { TaskPanelComponent } from './components/task-panel/task-panel.component';
import { UsersPanelComponent } from './components/users-panel/users-panel.component';
import { Task } from './models/task.model';
import { User } from './models/user.model';
import { TaskService } from './services/task.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [AppHeaderComponent, TaskPanelComponent, UsersPanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly destroyRef = inject(DestroyRef);

  tasks = signal<Task[]>([]);
  users = signal<User[]>([]);

  newTaskTitle = signal('');
  newTaskPriority = signal('medium');
  filterState = signal('all');
  searchText = signal('');

  readonly filteredTasks = computed(() => {
    const state = this.filterState();
    const search = (this.searchText() || '').toLowerCase();

    return this.tasks().filter((task) => {
      const matchesState =
        state === 'all' || (state === 'open' && !task.done) || (state === 'done' && task.done);
      const matchesSearch = !search || task.title.toLowerCase().includes(search);
      return matchesState && matchesSearch;
    });
  });

  readonly openCount = computed(() => this.tasks().filter((task) => !task.done).length);
  readonly doneCount = computed(() => this.tasks().filter((task) => task.done).length);

  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService
  ) {
    toObservable(this.searchText)
      .pipe(
        startWith(this.searchText()),
        distinctUntilChanged(),
        switchMap((searchText) => this.taskService.fetchAll(searchText)),
        map((tasks) => this.ensureTaskIds(this.normalizePriorities(tasks))),
        catchError(() => of([{ id: 1, title: 'Error loading tasks', done: false, priority: 'high' }])),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((tasks) => this.tasks.set(tasks));
  }

  addTask(): void {
    if (!this.newTaskTitle()) {
      return;
    }

    this.tasks.update((tasks) => [
      ...tasks,
      {
        id: this.nextTaskId(tasks),
        title: this.newTaskTitle(),
        done: false,
        priority: (this.newTaskPriority() || 'medium').toLowerCase()
      }
    ]);

    this.newTaskTitle.set('');
    this.newTaskPriority.set('medium');
  }

  removeTask(task: Task): void {
    this.tasks.update((tasks) => tasks.filter((currentTask) => currentTask.id !== task.id));
  }

  toggleDone(task: Task): void {
    this.tasks.update((tasks) =>
      tasks.map((currentTask) => (currentTask.id === task.id ? task : currentTask))
    );
  }

  loadUsers(): void {
    this.users.set([]);
    this.userService.fetchUsers().subscribe({
      next: (users) => {
        this.users.set(users);
      },
      error: () => {
        this.users.set([{ name: 'Error loading users', role: 'n/a' }]);
      }
    });
  }

  private normalizePriorities(tasks: Task[]): Task[] {
    return tasks.map((task) => ({
      ...task,
      priority: (task.priority || 'medium').toLowerCase()
    }));
  }

  private ensureTaskIds(tasks: Task[]): Task[] {
    let nextId = this.nextTaskId(tasks);
    const normalizedTasks = tasks.map((task) => {
      if (typeof task.id === 'number') {
        return task;
      }

      const taskWithId = { ...task, id: nextId };
      nextId += 1;
      return taskWithId;
    });

    return normalizedTasks;
  }

  private nextTaskId(tasks: Task[]): number {
    let maxId = 0;
    tasks.forEach((task) => {
      if (typeof task.id === 'number' && task.id > maxId) {
        maxId = task.id;
      }
    });
    return maxId + 1;
  }
}
