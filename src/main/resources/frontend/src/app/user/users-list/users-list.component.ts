import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { UsersDataSource } from './users-data.source';
import { UserService } from '@app/_services/user.service';
import { tap, catchError } from 'rxjs/operators';
import { handleError } from '../../_helpers/utils';
import { SnackBarService } from '@app/_services/snack-bar.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit, AfterViewInit {
  usersDataSource: UsersDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['name', 'email', 'role', 'status'];

  constructor(private userService: UserService, private snackBarService: SnackBarService) {}

  ngOnInit() {
    this.usersDataSource = new UsersDataSource(this.userService);
    this.usersDataSource.loadUsers();
  }

  ngAfterViewInit() {
    this.usersDataSource.counter$.pipe(tap((count) => (this.paginator.length = count))).subscribe();
    this.paginator.page.pipe(tap(() => this.loadUsers())).subscribe();
  }

  loadUsers() {
    this.usersDataSource.loadUsers(this.paginator.pageIndex, this.paginator.pageSize);
  }

  onToggleChange(checked: boolean, userId: number): void {
    if (checked) {
      this.enableUser(userId);
    } else {
      this.disableUser(userId);
    }
  }

  private enableUser(userId: number) {
    return this.userService.enable(userId).then(
      () => this.snackBarService.show(true, 'User has been enabled successfully.'),
      (error) => catchError(handleError)
    );
  }

  private disableUser(userId: number) {
    return this.userService.disable(userId).then(
      () => this.snackBarService.show(true, 'User has been disabled successfully.'),
      (error) => catchError(handleError)
    );
  }
}
