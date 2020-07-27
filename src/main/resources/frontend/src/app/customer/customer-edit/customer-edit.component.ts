import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '@services/customer.service';
import { formatError } from '@helpers/utils';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { Customer } from '@app/_models/customer';
import { ICustomer } from '@app/_shared/interfaces';
import { ChipListComponent } from '@app/_shared/components/chip-list-component/chip-list.component';
import { IFeature } from '@app/_shared/interfaces';
import { FeatureService } from '@app/_services/feature.service';

const NAME: string = 'name';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
})
export class CustomerEditComponent implements OnInit {
  private loadingSubject$: BehaviorSubject<boolean>;
  private customerId: number;

  editForm: FormGroup;
  loading$: Observable<boolean>;
  paramsSubscription: Subscription;

  @ViewChild('chipList', { static: true }) chipList: ChipListComponent<IFeature>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private featureService: FeatureService,
    private snackBarService: SnackBarService
  ) {
    this.loadingSubject$ = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loadingSubject$.asObservable();
  }

  ngOnInit() {
    this.editForm = new FormGroup({
      name: new FormControl('', Validators.required),
    });
    this.chipList.init(this.featureService, 'technicalName');
    this.loadCustomerData();
  }

  ngOnDestroy() {
    this.loadingSubject$.unsubscribe();
    this.paramsSubscription.unsubscribe();
  }

  private loadCustomerFeatures() {
    if (this.customerId) {
      this.loadingSubject$.next(true);
      this.customerService
        .findFeaturesByCustomerId(this.customerId)
        .pipe(take(1)) // Unsubscribe automatically after the first execution.
        .subscribe(
          (customers) => {
            this.chipList.selectedEntries = customers;
            this.loadingSubject$.next(false);
          },
          (error) => this.loadingSubject$.next(false)
        );
    }
  }

  private loadCustomerData() {
    this.loadingSubject$.next(true);
    this.paramsSubscription = this.route.paramMap
      .pipe(
        switchMap((params) => {
          const CUSTOMER_ID: number = +params.get('customer_id');
          return this.customerService.findById(CUSTOMER_ID);
        })
      )
      .subscribe((customer) => {
        this.loadingSubject$.next(false);
        this.customerId = customer.id;
        this.editForm.get(NAME).setValue(customer.name);

        // It loads the feature(s) that have the edited customer assigned.
        this.loadCustomerFeatures();
      });
  }

  public edit() {
    this.loadingSubject$.next(true);

    const DATA: ICustomer = new Customer();
    DATA.id = this.customerId;
    DATA.name = this.editForm.get(NAME).value;
    DATA.featureIds = this.chipList.retrieveEntrieIds();
    this.customerService
      .update(DATA)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.loadingSubject$.next(false);
          this.snackBarService.show(true, `Customer has been updated.`);
          this.router.navigate(['/customers']);
        },
        (err) => {
          this.snackBarService.show(false, `Customer edition failed due to ${formatError(err)}.`);
          this.loadingSubject$.next(false);
        }
      );
  }
}
