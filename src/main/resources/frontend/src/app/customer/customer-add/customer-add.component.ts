import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { CustomerService, FeatureService, SnackBarService } from '@services/index';
import { Customer, ICustomer, IFeature } from '@models/index';
import { formatError } from '@helpers/index';

import { ChipListComponent } from '@common-components/chip-list-component/chip-list.component';

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
})
export class CustomerAddComponent implements OnInit, OnDestroy {
  private loadingSubject$: BehaviorSubject<boolean>;

  createForm: FormGroup;
  loading$: Observable<boolean>;

  @ViewChild('chipList', { static: true }) chipList: ChipListComponent<IFeature>;

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private featureService: FeatureService,
    private snackBarService: SnackBarService
  ) {
    this.loadingSubject$ = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loadingSubject$.asObservable();
  }

  ngOnInit() {
    this.createForm = new FormGroup({
      name: new FormControl('', Validators.required),
    });
    this.chipList.init(this.featureService, 'technicalName');
  }

  ngOnDestroy() {
    this.loadingSubject$.unsubscribe();
  }

  public create() {
    const customer: ICustomer = new Customer();
    customer.name = this.createForm.get('name').value;
    customer.featureIds = this.chipList.retrieveEntrieIds();
    this.loadingSubject$.next(true);

    this.customerService
      .create(customer)
      .then(
        (resp) => {
          this.snackBarService.show(true, `Customer has been successfully created.`);
          this.router.navigate(['/customers']);
        },
        (err) =>
          this.snackBarService.show(false, `Customer creation failed due to ${formatError(err)}.`)
      )
      .finally(() => this.loadingSubject$.next(false));
  }
}
