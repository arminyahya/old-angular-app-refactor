import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('resolves users after 800ms delay', async () => {
    const start = Date.now();
    const users = await firstValueFrom(service.fetchUsers());
    const elapsed = Date.now() - start;

    expect(users.length).toBe(3);
    expect(elapsed).toBeGreaterThanOrEqual(780);
  });

  it('toggles first user role on repeated calls', async () => {
    const firstUsers = await firstValueFrom(service.fetchUsers());
    const firstRoleAtFirstFetch = firstUsers[0].role;
    const secondUsers = await firstValueFrom(service.fetchUsers());

    expect(firstRoleAtFirstFetch).toBe('Admin');
    expect(secondUsers[0].role).toBe('Owner');
    expect(firstUsers[0].role).toBe('Owner');
  });
});
