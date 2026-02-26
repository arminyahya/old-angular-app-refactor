import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, signal } from '@angular/core';

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
    const normalizedTasks = this.normalizePriorities(this.taskService.getAll());
    const tasksWithIds = this.ensureTaskIds(normalizedTasks);
    this.tasks.set(tasksWithIds);
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
    this.persist();
  }

  removeTask(task: Task): void {
    this.tasks.update((tasks) => tasks.filter((currentTask) => currentTask.id !== task.id));
    this.persist();
  }

  toggleDone(task: Task): void {
    this.tasks.update((tasks) =>
      tasks.map((currentTask) => (currentTask.id === task.id ? task : currentTask))
    );
    this.persist();
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
    let changed = false;
    let nextId = this.nextTaskId(tasks);
    const normalizedTasks = tasks.map((task) => {
      if (typeof task.id === 'number') {
        return task;
      }

      changed = true;
      const taskWithId = { ...task, id: nextId };
      nextId += 1;
      return taskWithId;
    });

    if (changed) {
      this.taskService.save(normalizedTasks);
    }

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

  private persist(): void {
    this.taskService.save(this.tasks());
  }
}
