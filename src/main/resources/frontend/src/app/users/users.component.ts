import { Component, OnInit } from '@angular/core';

import { UserService } from '@app/_services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  title: string;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.title = 'Users';
  }
}
