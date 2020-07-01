import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { UserService } from '@app/_services/user.service';
import { catchError } from 'rxjs/operators';
import { handleError, formatError } from '../../_helpers/utils';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { IUser } from '@app/_shared/interfaces';
import { AbstractDataSource } from '@app/_shared/abstract-data.source';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: AbstractDataSource<IUser>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private userService: UserService,
    private snackBarService: SnackBarService,
    private router: Router
  ) {}

  ngOnInit() {
    this.dataSource = new AbstractDataSource<IUser>(this.userService, this.snackBarService);
    this.displayedColumns = ['name', 'email', 'role', 'status', 'actions'];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.load();
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

  public onToggleChange(checked: boolean, userId: number): void {
    if (checked) {
      this.enableUser(userId);
    } else {
      this.disableUser(userId);
    }
  }

  public edit(userId: number) {
    this.router.navigate(['/user/edit', userId]);
  }

  public delete(userId: number) {
    this.userService.delete(userId).then(
      (res) => {
        this.snackBarService.show(true, `User has been deleted.`);
        // Realoding table content
        this.dataSource.load();
      },
      (err) =>
        this.snackBarService.show(false, `User deletion has failed due to ${formatError(err)}.`)
    );
  }
}
