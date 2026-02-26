import { Injectable } from '@angular/core';
import { Observable, map, timer } from 'rxjs';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private cachedUsers: User[] | null = null;

  fetchUsers(): Observable<User[]> {
    return timer(800).pipe(
      map(() => {
        if (!this.cachedUsers) {
          this.cachedUsers = [
            { name: 'Avery Reed', role: 'Admin' },
            { name: 'Casey Patel', role: 'Editor' },
            { name: 'Jordan Kim', role: 'Viewer' }
          ];
        } else {
          // Keep legacy mutation behavior for parity.
          this.cachedUsers[0].role = this.cachedUsers[0].role === 'Admin' ? 'Owner' : 'Admin';
        }

        return this.cachedUsers;
      })
    );
  }
}
