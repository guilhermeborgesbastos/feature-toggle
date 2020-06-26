import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { UserService } from '@app/_services/user.service';
import { IUser, IRestResponse } from '@app/_shared/interfaces';

export class UsersDataSource implements DataSource<IUser> {
  private usersSubject = new BehaviorSubject<IUser[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();

  constructor(private usersService: UserService) {}

  connect(collectionViewer: CollectionViewer): Observable<IUser[]> {
    return this.usersSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.usersSubject.complete();
    this.loadingSubject.complete();
    this.countSubject.complete();
  }

  loadUsers(pageNumber = 0, pageSize = 10) {
    this.loadingSubject.next(true);
    this.usersService
      .getAll({ page: pageNumber, size: pageSize })
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((result: IRestResponse<IUser>) => {
        this.usersSubject.next(result.content);
        this.countSubject.next(result.totalElements);
      });
  }
}
