import { Injectable } from '@angular/core';

import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly storageKey = 'legacy_tasks';

  getAll(): Task[] {
    const storage = this.getStorage();
    const raw = storage?.getItem(this.storageKey);

    if (!raw) {
      return [
        { title: 'Review legacy controller', done: false, priority: 'high' },
        { title: 'Replace $scope watchers', done: false, priority: 'medium' },
        { title: 'Upgrade to components', done: true, priority: 'low' }
      ];
    }

    try {
      return JSON.parse(raw) as Task[];
    } catch {
      return [];
    }
  }

  add(task: Task): Task[] {
    const tasks = this.getAll();
    // Keep the legacy in-place mutation behavior for migration parity.
    tasks.push(task);
    this.save(tasks);
    return tasks;
  }

  remove(task: Task): Task[] {
    const tasks = this.getAll();
    const index = tasks.indexOf(task);

    if (index !== -1) {
      // Keep the legacy in-place mutation behavior for migration parity.
      tasks.splice(index, 1);
      this.save(tasks);
    }

    return tasks;
  }

  save(tasks: Task[]): void {
    this.getStorage()?.setItem(this.storageKey, JSON.stringify(tasks));
  }

  private getStorage(): Storage | null {
    return typeof localStorage === 'undefined' ? null : localStorage;
  }
}
