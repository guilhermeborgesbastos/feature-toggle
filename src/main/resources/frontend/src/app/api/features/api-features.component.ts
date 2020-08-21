import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';

import { formatError } from '@helpers/index';
import { environment } from '@environments/environment';
import { IRestResponse, IFeaturesRequest } from '@shared/interfaces';
import { ICustomer, IFeature } from '@models/index';

import { ChipListComponent } from '@common-components/chip-list-component/chip-list.component';

import { CustomerService, FeaturesService, SnackBarService, FeatureService } from '@services/index';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-api-features',
  templateUrl: './api-features.component.html',
  styleUrls: ['./api-features.component.scss'],
})
export class ApiFeaturesComponent implements OnInit, OnDestroy {
  filteredCustomers: Observable<ICustomer[]>;
  inputControl = new FormControl();
  customers: ICustomer[];
  requestBody: IFeaturesRequest;

  loading$: Observable<boolean>;
  private loadingSubject = new BehaviorSubject<boolean>(false);

  jsonResponse: Object;
  bearerToken: string;
  endpointUrl: string;

  @ViewChild('chipList', { static: true }) chipList: ChipListComponent<IFeature>;

  constructor(
    private customerService: CustomerService,
    private featuresService: FeaturesService,
    private featureService: FeatureService,
    private snackBarService: SnackBarService,
    private authService: AuthenticationService
  ) {
    this.endpointUrl = `${environment.API_URL}/${environment.API_VERSION}/features`;
    this.bearerToken = this.authService.getToken('access_token');
    this.loading$ = this.loadingSubject.asObservable();
    this.requestBody = {};
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

    this.chipList.init(this.featureService, 'technicalName');
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

  public selected(customer: ICustomer): void {
    this.requestBody.customerId = customer.id;
  }

  public chipListChange(event) {
    this.requestBody.featureIds = this.chipList.retrieveEntrieIds();
  }

  public displayFn(customer: ICustomer): string {
    return customer ? customer.name : '';
  }

  public submit(event: any): void {
    event.stopPropagation();
    this.loadingSubject.next(true);
    this.requestBody.featureIds = this.chipList.retrieveEntrieIds();
    this.featuresService
      .findFeatures(this.requestBody)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.jsonResponse = res;
          this.loadingSubject.next(false);
        },
        (err) => {
          this.snackBarService.show(
            false,
            `The API Request has failed due to ${formatError(err)}.`
          );
          this.loadingSubject.next(false);
        }
      );
  }
}
