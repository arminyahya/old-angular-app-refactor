import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, timer } from 'rxjs';

import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly tasksApiUrl = '/api/tasks.json';

  constructor(private readonly http: HttpClient) {}

  fetchAll(searchText = ''): Observable<Task[]> {
    const search = searchText.trim().toLowerCase();
    const params = search ? new HttpParams().set('search', searchText) : undefined;

    return this.http.get<Task[]>(this.tasksApiUrl, { params }).pipe(
      // Keep client-side filtering for now; backend can later honor `search` directly.
      map((tasks) =>
        search ? tasks.filter((task) => task.title.toLowerCase().includes(search)) : tasks
      )
    );
  }

  suggestPriority(task: Task): Observable<string> {
    const simulatedLatencyMs = 250 + Math.floor(Math.random() * 700);
    return timer(simulatedLatencyMs).pipe(map(() => this.computeSuggestedPriority(task)));
  }

  private computeSuggestedPriority(task: Task): string {
    if (task.done) {
      return 'low';
    }

    const title = task.title.toLowerCase();
    if (title.includes('urgent') || title.includes('blocker') || title.includes('fix')) {
      return 'high';
    }

    if (title.includes('docs') || title.includes('chore') || title.includes('cleanup')) {
      return 'low';
    }

    return 'medium';
  }
}
