import { Component, ViewEncapsulation } from '@angular/core';

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
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  users: User[] = [];

  newTaskTitle = '';
  newTaskPriority = 'medium';
  filterState = 'all';
  searchText = '';

  openCount = 0;
  doneCount = 0;

  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService
  ) {
    this.tasks = this.taskService.getAll();
    this.normalizePriorities(this.tasks);
    this.ensureTaskIds(this.tasks);
    this.applyFilter();
  }

  addTask(): void {
    if (!this.newTaskTitle) {
      return;
    }

    this.tasks = this.taskService.add({
      id: this.nextTaskId(this.tasks),
      title: this.newTaskTitle,
      done: false,
      priority: this.newTaskPriority
    });

    this.newTaskTitle = '';
    this.newTaskPriority = 'medium';
    this.normalizePriorities(this.tasks);
    this.applyFilter();
    this.persist();
  }

  removeTask(task: Task): void {
    this.tasks = this.taskService.remove(task);
    this.applyFilter();
    this.persist();
  }

  applyFilter(): void {
    const state = this.filterState;
    const search = (this.searchText || '').toLowerCase();

    this.filteredTasks = this.tasks.filter((task) => {
      const matchesState =
        state === 'all' || (state === 'open' && !task.done) || (state === 'done' && task.done);
      const matchesSearch = !search || task.title.toLowerCase().includes(search);
      return matchesState && matchesSearch;
    });

    this.updateCounts();
  }

  toggleDone(): void {
    this.applyFilter();
    this.persist();
  }

  loadUsers(): void {
    this.users = [];
    this.userService.fetchUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: () => {
        this.users = [{ name: 'Error loading users', role: 'n/a' }];
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

  private updateCounts(): void {
    let open = 0;
    let done = 0;
    this.tasks.forEach((task) => {
      if (task.done) {
        done += 1;
      } else {
        open += 1;
      }
    });
    this.openCount = open;
    this.doneCount = done;
  }

  private persist(): void {
    this.taskService.save(this.tasks);
  }
}
