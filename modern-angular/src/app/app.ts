import { Component, ViewEncapsulation, computed, signal } from '@angular/core';

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
  encapsulation: ViewEncapsulation.None
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
    this.tasks.set(this.taskService.getAll());
    this.normalizePriorities(this.tasks());
    this.ensureTaskIds(this.tasks());
  }

  addTask(): void {
    if (!this.newTaskTitle()) {
      return;
    }

    this.tasks.set(this.taskService.add({
      id: this.nextTaskId(this.tasks()),
      title: this.newTaskTitle(),
      done: false,
      priority: this.newTaskPriority()
    }));

    this.newTaskTitle.set('');
    this.newTaskPriority.set('medium');
    this.normalizePriorities(this.tasks());
    this.persist();
  }

  removeTask(task: Task): void {
    this.tasks.set(this.taskService.remove(task));
    this.persist();
  }

  toggleDone(): void {
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

  private normalizePriorities(tasks: Task[]): void {
    tasks.forEach((task) => {
      task.priority = (task.priority || 'medium').toLowerCase();
    });
  }

  private ensureTaskIds(tasks: Task[]): void {
    let changed = false;
    tasks.forEach((task) => {
      if (typeof task.id !== 'number') {
        task.id = this.nextTaskId(tasks);
        changed = true;
      }
    });

    if (changed) {
      this.persist();
    }
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
