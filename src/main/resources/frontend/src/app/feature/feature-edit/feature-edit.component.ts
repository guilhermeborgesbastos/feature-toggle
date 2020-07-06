import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FeatureService } from '@services/feature.service';
import { formatError } from '@helpers/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, startWith, map } from 'rxjs/operators';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { Feature } from '@app/_models/feature';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ICustomer, IRestResponse } from '@app/_shared/interfaces';
import { CustomerService } from '@app/_services/customer.service';

@Component({
  selector: 'app-feature-edit',
  templateUrl: './feature-edit.component.html',
  styleUrls: ['./feature-edit.component.scss'],
})
export class FeatureEditComponent implements OnInit {
  editForm: FormGroup;
  loading$: Observable<boolean>;
  private loadingSubject: BehaviorSubject<boolean>;
  private featureId: number;

  customerCtrl = new FormControl();

  selectable = true;
  removable = true;

  filteredCustomers: Observable<ICustomer[]>;

  allCustomers: ICustomer[] = [];
  selectedCustomers: ICustomer[] = [];

  @ViewChild('customersInput', { static: false }) customersInput: ElementRef<HTMLInputElement>;
  @ViewChild('description', { static: false }) description: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private featureService: FeatureService,
    private snackBarService: SnackBarService
  ) {
    this.loadingSubject = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loadingSubject.asObservable();

    this.filteredCustomers = this.customerCtrl.valueChanges.pipe(
      startWith(null),
      map((search: ICustomer | null) => (search ? this.filter(search) : this.allCustomers.slice()))
    );
  }

  ngOnInit() {
    this.editForm = new FormGroup({
      displayName: new FormControl(''),
      technicalName: new FormControl('', Validators.required),
      expiresOn: new FormControl(''),
      inverted: new FormControl(''),
    });

    this.customerService
      .load({ page: 0, size: 100 }) // TODO: Apply a server side filtering...
      .subscribe((resp: IRestResponse<ICustomer>) => (this.allCustomers = resp.content));

    this.loadFeatureData();
  }

  private loadCustomersData() {
    if (this.featureId) {
      this.loadingSubject.next(true);
      this.featureService.findCustomersByFeatureId(this.featureId).subscribe((customers) => {
        this.selectedCustomers = customers;
        this.loadingSubject.next(false);
      });
    }
  }

  private loadFeatureData() {
    this.loadingSubject.next(true);
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const featureId: number = +params.get('feature_id');
          return this.featureService.findById(featureId);
        })
      )
      .subscribe((feature) => {
        this.loadingSubject.next(false);
        this.featureId = feature.id;
        this.editForm.get('displayName').setValue(feature.displayName);
        this.editForm.get('technicalName').setValue(feature.technicalName);
        this.editForm.get('expiresOn').setValue(new Date(feature.expiresOn));
        this.editForm.get('inverted').setValue(feature.inverted);
        this.description.nativeElement.value = feature.description;

        // It loads the customers that have the edited feature assigned.
        this.loadCustomersData();
      });
  }

  private filter(value: any): ICustomer[] {
    const filterValue = value && value.name ? value.name : value;
    return this.allCustomers.filter(
      (cust) => cust.name.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
    );
  }

  edit() {
    this.loadingSubject.next(true);
    const data = new Feature();
    data.id = this.featureId;
    data.displayName = this.editForm.get('displayName').value;
    data.technicalName = this.editForm.get('technicalName').value;
    data.expiresOn = this.editForm.get('expiresOn').value;
    data.inverted = this.editForm.get('inverted').value ? true : false;
    data.description = this.description.nativeElement.value;
    data.customerIds = this.selectedCustomers.map((cust) => cust.id);

    this.featureService.update(data).subscribe(
      (res) => {
        this.loadingSubject.next(false);
        this.snackBarService.show(true, `Feature has been updated.`);
        this.router.navigate(['/features']);
      },
      (err) => {
        this.snackBarService.show(false, `Feature edition failed due to ${formatError(err)}.`);
        this.loadingSubject.next(false);
      }
    );
  }

  cancel() {
    this.router.navigate(['/features']);
  }

  remove(customer: ICustomer): void {
    const index = this.selectedCustomers.indexOf(customer);

    if (index > -1) {
      this.selectedCustomers.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const customer: ICustomer = event.option.value;
    const index = this.selectedCustomers.indexOf(customer);

    if (index === -1) {
      this.selectedCustomers.push(customer);
      this.customersInput.nativeElement.value = '';
      this.customerCtrl.setValue(null);
    }
  }
}
