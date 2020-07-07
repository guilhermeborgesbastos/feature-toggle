import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ICustomer, IRestResponse } from '@app/_shared/interfaces';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CustomerService } from '@app/_services/customer.service';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-customer-chip-list',
  templateUrl: './customer-chip-list.component.html',
  styleUrls: ['./customer-chip-list.component.scss'],
})
export class CustomerChipListComponent implements OnInit {
  private _selectedCustomers: ICustomer[] = [];
  private loadingSubject: BehaviorSubject<boolean>;
  loading$: Observable<boolean>;

  filteredCustomers: Observable<ICustomer[]>;
  allCustomers: ICustomer[] = [];
  customerCtrl = new FormControl();

  selectable = true;
  removable = true;

  @ViewChild('customersInput', { static: false }) customersInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  ngOnInit() {
    this.customerService
      .load({ page: 0, size: 100 }) // TODO: Apply a server side filtering...
      .subscribe((resp: IRestResponse<ICustomer>) => (this.allCustomers = resp.content));
  }

  @Input() get selectedCustomers(): ICustomer[] {
    return this._selectedCustomers;
  }

  set selectedCustomers(value: ICustomer[]) {
    this._selectedCustomers = value;
  }

  constructor(private customerService: CustomerService, private snackBarService: SnackBarService) {
    this.loadingSubject = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loadingSubject.asObservable();

    this.filteredCustomers = this.customerCtrl.valueChanges.pipe(
      startWith(null),
      map((search: ICustomer | null) => (search ? this.filter(search) : this.allCustomers.slice()))
    );
  }

  private filter(value: any): ICustomer[] {
    const filterValue = value && value.name ? value.name : value;
    return this.allCustomers.filter(
      (cust) => cust.name.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
    );
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    const customer: ICustomer = event.option.value;
    const index = this._selectedCustomers.indexOf(customer);

    if (index === -1) {
      this._selectedCustomers.push(customer);
      this.customersInput.nativeElement.value = '';
      this.customerCtrl.setValue(null);
    }
  }

  public remove(customer: ICustomer): void {
    const index = this._selectedCustomers.indexOf(customer);

    if (index > -1) {
      this._selectedCustomers.splice(index, 1);
    }
  }

  public retrieveCustomerIds(): number[] {
    return this._selectedCustomers.map((cust) => cust.id);
  }
}
