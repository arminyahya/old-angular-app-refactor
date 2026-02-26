import { TestBed } from '@angular/core/testing';

import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
    localStorage.removeItem('legacy_tasks');
  });

  it('returns default tasks when storage is empty', () => {
    const tasks = service.getAll();

    expect(tasks.length).toBe(3);
    expect(tasks[0].title).toBe('Review legacy controller');
  });

  it('returns empty list when stored JSON is invalid', () => {
    localStorage.setItem('legacy_tasks', 'not-json');

    expect(service.getAll()).toEqual([]);
  });

  it('adds and persists a task', () => {
    const tasks = service.add({
      id: 1,
      title: 'Test task',
      done: false,
      priority: 'medium'
    });

    expect(tasks.some((task) => task.title === 'Test task')).toBe(true);
    expect(JSON.parse(localStorage.getItem('legacy_tasks') ?? '[]').length).toBe(tasks.length);
  });

  it('does not remove when reference is from a different getAll call', () => {
    service.save([
      { id: 1, title: 'A', done: false, priority: 'high' },
      { id: 2, title: 'B', done: false, priority: 'low' }
    ]);

    const externalRef = service.getAll()[0];
    const updated = service.remove(externalRef);

    // Legacy behavior: remove compares by reference against a fresh getAll() result.
    expect(updated.length).toBe(2);
  });
});
