import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '@services/customer.service';
import { formatError } from '@helpers/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { Customer } from '@app/_models/customer';
import { ICustomer } from '@app/_shared/interfaces';
import { ChipListComponent } from '@app/_shared/components/chip-list-component/chip-list.component';
import { IFeature } from '@app/_shared/interfaces';
import { FeatureService } from '@app/_services/feature.service';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
})
export class CustomerEditComponent implements OnInit {
  editForm: FormGroup;
  loading$: Observable<boolean>;
  private loadingSubject: BehaviorSubject<boolean>;
  private customerId: number;

  @ViewChild('appChipList', { static: true }) appChipList: ChipListComponent<IFeature>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private featureService: FeatureService,
    private snackBarService: SnackBarService
  ) {
    this.loadingSubject = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.editForm = new FormGroup({
      name: new FormControl('', Validators.required),
    });
    this.appChipList.init(this.featureService, 'technicalName');
    this.loadCustomerData();
  }

  private loadCustomerFeatures() {
    if (this.customerId) {
      this.loadingSubject.next(true);
      this.customerService.findFeaturesByCustomerId(this.customerId).subscribe((entries) => {
        this.appChipList.selectedEntries = entries;
        this.loadingSubject.next(false);
      });
    }
  }

  private loadCustomerData() {
    this.loadingSubject.next(true);
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const customerId: number = +params.get('customer_id');
          return this.customerService.findById(customerId);
        })
      )
      .subscribe((customer) => {
        this.loadingSubject.next(false);
        this.customerId = customer.id;
        this.editForm.get('name').setValue(customer.name);

        // It loads the feature(s) that have the edited customer assigned.
        this.loadCustomerFeatures();
      });
  }

  edit() {
    this.loadingSubject.next(true);
    const data: ICustomer = new Customer();
    data.id = this.customerId;
    data.name = this.editForm.get('name').value;
    data.featureIds = this.appChipList.retrieveEntrieIds();
    this.customerService.update(data).subscribe(
      (res) => {
        this.loadingSubject.next(false);
        this.snackBarService.show(true, `Customer has been updated.`);
        this.router.navigate(['/customers']);
      },
      (err) => {
        this.snackBarService.show(false, `Customer edition failed due to ${formatError(err)}.`);
        this.loadingSubject.next(false);
      }
    );
  }

  cancel() {
    this.router.navigate(['/customers']);
  }
}
