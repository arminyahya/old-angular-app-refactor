import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { Task } from '../models/task.model';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TaskService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('fetches tasks from the api endpoint', () => {
    const response = [
      { id: 1, title: 'Review legacy controller', done: false, priority: 'high' },
      { id: 2, title: 'Replace $scope watchers', done: false, priority: 'medium' }
    ];

    let tasks: Task[] | undefined;
    service.fetchAll().subscribe((value) => {
      tasks = value;
    });

    const req = httpController.expectOne('/api/tasks.json');
    expect(req.request.method).toBe('GET');
    req.flush(response);

    expect(tasks).toEqual(response);
  });

  it('passes through http errors', () => {
    let status = 0;
    let sawNext = false;
    service.fetchAll().subscribe({
      next: () => {
        sawNext = true;
      },
      error: (err) => {
        status = err.status;
      }
    });

    const req = httpController.expectOne('/api/tasks.json');
    req.flush('failed', { status: 500, statusText: 'Server Error' });
    expect(sawNext).toBe(false);
    expect(status).toBe(500);
  });
});
