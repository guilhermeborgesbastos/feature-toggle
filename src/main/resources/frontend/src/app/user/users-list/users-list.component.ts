import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { UsersDataSource } from './users-data.source';
import { UserService } from '@app/_services/user.service';
import { tap, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
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
      (error) => catchError(this.handleError)
    );
  }

  private disableUser(userId: number) {
    return this.userService.disable(userId).then(
      () => this.snackBarService.show(true, 'User has been disabled successfully.'),
      (error) => catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
