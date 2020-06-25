import { Component, OnInit } from '@angular/core';

import { IUser, IPageParams } from '@shared/interfaces';
import { UserService } from '@app/_services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  title: string;
  users: IUser[];

  page: number = 0;
  size: number = 10;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.title = 'Users';
    this.userService
      .getAll({ page: this.page, size: this.size } as IPageParams)
      .subscribe((users: IUser[]) => (this.users = users));
  }
}
