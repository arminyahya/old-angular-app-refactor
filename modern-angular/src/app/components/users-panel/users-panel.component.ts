import { Component, EventEmitter, Input, Output } from '@angular/core';

import { User } from '../../models/user.model';

@Component({
  selector: 'users-panel',
  standalone: true,
  templateUrl: './users-panel.component.html'
})
export class UsersPanelComponent {
  @Input() users: User[] = [];
  @Output() load = new EventEmitter<void>();
}
