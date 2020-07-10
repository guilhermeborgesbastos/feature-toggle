import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FeatureService } from '@services/feature.service';
import { formatError } from '@helpers/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { Feature } from '@app/_models/feature';
import { ICustomer } from '@app/_shared/interfaces';
import { CustomerChipListComponent } from '@app/customer/customer-chip-list/customer-chip-list.component';

@Component({
  selector: 'app-feature-edit',
  templateUrl: './feature-edit.component.html',
  styleUrls: ['./feature-edit.component.scss'],
})
export class FeatureEditComponent implements OnInit {
  private loadingSubject: BehaviorSubject<boolean>;
  private featureId: number;

  editForm: FormGroup;
  loading$: Observable<boolean>;

  selectedCustomers: ICustomer[] = [];

  @ViewChild('description', { static: false }) description: ElementRef<HTMLInputElement>;
  @ViewChild('chipList') chipList: CustomerChipListComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private featureService: FeatureService,
    private snackBarService: SnackBarService
  ) {
    this.loadingSubject = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.editForm = new FormGroup({
      displayName: new FormControl(''),
      technicalName: new FormControl('', Validators.required),
      expiresOn: new FormControl(''),
      inverted: new FormControl(''),
    });

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

  edit() {
    this.loadingSubject.next(true);
    const data = new Feature();
    data.id = this.featureId;
    data.displayName = this.editForm.get('displayName').value;
    data.technicalName = this.editForm.get('technicalName').value;
    data.expiresOn = this.editForm.get('expiresOn').value;
    data.inverted = this.editForm.get('inverted').value ? true : false;
    data.description = this.description.nativeElement.value;
    data.customerIds = this.chipList.retrieveCustomerIds();

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
}
