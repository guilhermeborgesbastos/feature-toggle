import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '@services/customer.service';
import { ICustomer } from '@shared/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { Customer } from '@app/_models/customer';
import { formatError } from '@app/_helpers/utils';

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
})
export class CustomerAddComponent implements OnInit {
  createForm: FormGroup;
  loading$: Observable<boolean>;
  private loadingSubject: BehaviorSubject<boolean>;

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private snackBarService: SnackBarService
  ) {
    this.loadingSubject = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.createForm = new FormGroup({
      name: new FormControl('', Validators.required),
    });
  }

  create() {
    const customer: ICustomer = new Customer();
    customer.name = this.createForm.get('name').value;
    this.customerService.create(customer).then(
      (res) => {
        this.loadingSubject.next(false);
        this.snackBarService.show(true, `Customer has been successfully created.`);
        this.router.navigate(['/customers']);
      },
      (err) => {
        this.snackBarService.show(false, `Customer creation failed due to ${formatError(err)}.`);
        this.loadingSubject.next(false);
      }
    );
  }
}
