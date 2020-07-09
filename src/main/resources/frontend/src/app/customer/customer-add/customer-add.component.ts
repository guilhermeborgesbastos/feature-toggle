import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '@services/customer.service';
import { ICustomer, IFeature } from '@shared/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { Customer } from '@app/_models/customer';
import { formatError } from '@app/_helpers/utils';
import { ChipListComponent } from '@app/_shared/components/chip-list-component/chip-list.component';
import { FeatureService } from '@app/_services/feature.service';

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
})
export class CustomerAddComponent implements OnInit {
  createForm: FormGroup;
  loading$: Observable<boolean>;
  private loadingSubject: BehaviorSubject<boolean>;

  @ViewChild('appChipList', { static: true }) appChipList: ChipListComponent<IFeature>;

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private featureService: FeatureService,
    private snackBarService: SnackBarService
  ) {
    this.loadingSubject = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.createForm = new FormGroup({
      name: new FormControl('', Validators.required),
    });
    this.appChipList.init(this.featureService, 'technicalName');
  }

  create() {
    const customer: ICustomer = new Customer();
    customer.name = this.createForm.get('name').value;
    customer.featureIds = this.appChipList.retrieveEntrieIds();
    this.customerService.create(customer).then(
      (resp) => {
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
