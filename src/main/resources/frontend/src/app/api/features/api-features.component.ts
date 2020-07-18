import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { ICustomer, IRestResponse } from '@app/_shared/interfaces';
import { CustomerService } from '@app/_services/customer.service';
import { AuthenticationService } from '@app/_services/authentication.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { environment } from '@environments/environment';
import { FeaturesService } from '@app/_services/features.service';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { formatError } from '@app/_helpers/utils';

@Component({
  selector: 'app-api-features',
  templateUrl: './api-features.component.html',
  styleUrls: ['./api-features.component.scss'],
})
export class ApiFeaturesComponent implements OnInit, OnDestroy {
  filteredCustomers: Observable<ICustomer[]>;
  inputControl = new FormControl();
  customers: ICustomer[];

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean>;

  jsonResponse: Object;
  bearerToken: string;
  endpointUrl: string;
  customerId: number;

  constructor(
    private customerService: CustomerService,
    private featuresService: FeaturesService,
    private snackBarService: SnackBarService,
    private authService: AuthenticationService
  ) {
    this.endpointUrl = `${environment.API_URL}/${environment.API_VERSION}/features/customer/`;
    this.bearerToken = this.authService.getToken('access_token');
    this.loading$ = this.loadingSubject.asObservable();

    this.customers = [];
  }

  ngOnInit() {
    this.filteredCustomers = this.inputControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filter(value))
    );

    this.customerService
      .load({ page: 0, size: 100 }) // TODO: Apply a server side filtering...
      .pipe(take(1)) // Unsubscribe automatically after first execution
      .subscribe((resp: IRestResponse<ICustomer>) => (this.customers = resp.content));
  }

  ngOnDestroy() {
    this.loadingSubject.unsubscribe();
  }

  private filter(value: any): ICustomer[] {
    const FILTER_VALUE = String(value).toLowerCase();

    return this.customers.filter(
      (customer) => customer.name.toLowerCase().indexOf(FILTER_VALUE) === 0
    );
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    this.customerId = event.option.value;
  }

  public submit(event: any): void {
    event.stopPropagation();
    this.loadingSubject.next(true);
    this.featuresService
      .findFeaturesByCustomerId(this.customerId)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.jsonResponse = res;
          this.loadingSubject.next(false);
        },
        (err) => {
          this.snackBarService.show(false, `The API Request has failed due to ${formatError(err)}.`);
          this.loadingSubject.next(false);
        }
      );
  }
}
