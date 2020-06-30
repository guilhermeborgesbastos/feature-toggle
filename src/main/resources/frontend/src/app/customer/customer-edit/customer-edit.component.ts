import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '@services/customer.service';
import { formatError } from '@helpers/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { Customer } from '@app/_models/customer';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
})
export class CustomerEditComponent implements OnInit {
  editForm: FormGroup;
  loading$: Observable<boolean>;
  private loadingSubject: BehaviorSubject<boolean>;
  private customerId: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private snackBarService: SnackBarService
  ) {
    this.loadingSubject = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.editForm = new FormGroup({
      name: new FormControl('', Validators.required),
    });
    this.loadCustomerData();
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
      .subscribe((user) => {
        this.loadingSubject.next(false);
        this.customerId = user.id;
        this.editForm.get('name').setValue(user.name);
      });
  }

  edit() {
    this.loadingSubject.next(true);
    const data = new Customer();
    data.id = this.customerId;
    data.name = this.editForm.get('name').value;
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
