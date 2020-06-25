import { Component, OnInit, Input } from '@angular/core';

import { IUser } from '@shared/interfaces';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit {
  private _users: IUser[] = []; // The original entries
  filteredUsers: any[] = []; // The filtered entries

  @Input() get users(): IUser[] {
    return this._users;
  }

  set users(value: IUser[]) {
    if (value) {
      this.filteredUsers = this._users = value;
    }
  }

  constructor() {}

  // As an standard practice the class implements the OnInit interface, that will be used in the life-cycle in the future.
  ngOnInit() {}

  filter(data: string) {
    if (data) {
      this.filteredUsers = this.users.filter((user: IUser) => {
        return (
          user.name.toLowerCase().indexOf(data.toLowerCase()) > -1 ||
          user.email.toLowerCase().indexOf(data.toLowerCase()) > -1 ||
          user.role.toString().indexOf(data) > -1
        );
      });
    } else {
      this.filteredUsers = this.users;
    }
  }

  sort(prop: string) {
    console.log(this.filteredUsers, prop);
  }
}
