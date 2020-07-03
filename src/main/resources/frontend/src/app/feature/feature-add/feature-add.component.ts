import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FeatureService } from '@services/feature.service';
import { formatError } from '@helpers/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { ICustomer, IRestResponse } from '@app/_shared/interfaces';
import { startWith, map } from 'rxjs/operators';
import { CustomerService } from '@app/_services/customer.service';

@Component({
  selector: 'app-feature-add',
  templateUrl: './feature-add.component.html',
  styleUrls: ['./feature-add.component.scss'],
})
export class FeatureAddComponent implements OnInit {
  private loadingSubject: BehaviorSubject<boolean>;
  loading$: Observable<boolean>;

  createForm: FormGroup;
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
    private featureService: FeatureService,
    private customerService: CustomerService,
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
    this.customerService
      .load({ page: 0, size: 100 }) // TODO: Apply a server side filtering...
      .subscribe((resp: IRestResponse<ICustomer>) => (this.allCustomers = resp.content));

    this.createForm = new FormGroup({
      displayName: new FormControl(''),
      technicalName: new FormControl('', Validators.required),
      expiresOn: new FormControl(''),
      inverted: new FormControl(''),
    });
  }

  private filter(value: any): ICustomer[] {
    const filterValue = value && value.name ? value.name : value;
    return this.allCustomers.filter(
      (cust) => cust.name.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
    );
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

  create() {
    const customerIds: number[] = this.selectedCustomers.map((cust) => cust.id);
    this.featureService
      .create(
        this.createForm.get('displayName').value,
        this.createForm.get('technicalName').value,
        this.description.nativeElement.value,
        this.createForm.get('inverted').value,
        this.createForm.get('expiresOn').value,
        customerIds
      )
      .then(
        (newFeature) => {
          this.loadingSubject.next(false);
          this.snackBarService.show(true, `Feature has been successfully created.`);
          this.router.navigate(['/features']);
        },
        (error) => {
          this.snackBarService.show(false, `Feature creation failed due to ${formatError(error)}.`);
          this.loadingSubject.next(false);
        }
      );
  }

  cancel() {
    this.router.navigate(['/features']);
  }
}
