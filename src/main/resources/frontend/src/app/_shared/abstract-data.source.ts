import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { IRestResponse, AbstractResource, IAbstractApiService } from '@app/_shared/interfaces';
import { MatPaginator } from '@angular/material/paginator';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { formatError } from '@app/_helpers/utils';

/**
 * Its is a common implementation for the custom Observable-based Angular CDK Data Source.
 */
export class AbstractDataSource<T extends AbstractResource> implements DataSource<T> {
  private subject: BehaviorSubject<T[]>;
  private loadingSubject = new BehaviorSubject<boolean>(false);

  private _paginator: MatPaginator;
  private _subscription: Subscription;

  loading$: Observable<boolean>;

  constructor(
    protected storeService: IAbstractApiService<T>,
    private snackbarService: SnackBarService
  ) {
    this.subject = new BehaviorSubject<T[]>([]);
    this.loadingSubject = new BehaviorSubject<boolean>(true);
    this._subscription = new Subscription();
    this.loading$ = this.loadingSubject.asObservable();
  }

  // Getters and setters
  get data(): T[] {
    return this.subject.value;
  }

  get paginator(): MatPaginator {
    return this._paginator;
  }

  set paginator(paginator: MatPaginator) {
    this._paginator = paginator;
    this._subscription.add(paginator.page.subscribe((event) => this.load()));
  }

  /**
   * It provides an Observable that emits information about what data is being displayed.
   *
   * @param collectionViewer
   */
  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    this._subscription.add(collectionViewer.viewChange.subscribe((change) => this.load()));
    return this.subject.asObservable();
  }

  /**
   * It disconnects the collection viewer (the data-table) from the data source, performing clean-up
   * operations when a view is being destroyed.
   *
   * @param collectionViewer
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.subject.complete();
    this.loadingSubject.complete();
    this._subscription.unsubscribe();
  }

  load() {
    this.loadingSubject.next(true);
    const config = {
      page: this._paginator?.pageIndex || 0,
      size: this._paginator?.pageSize || 10,
    };

    this._subscription.add(
      this.storeService
        .load(config)
        .pipe(
          catchError((err) => {
            this.snackbarService.show(false, `The loading failed due to ${formatError(err)}`);
            return of({ content: [], totalElements: 0 });
          }),
          finalize(() => {
            this.loadingSubject.next(false);
          })
        )
        .subscribe((result: IRestResponse<T>) => {
          this.paginator.length = result.totalElements;
          this.subject.next(result.content);
        })
    );
  }
}
