import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FeatureService } from '@services/feature.service';
import { formatError } from '@helpers/utils';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { Feature } from '@app/_models/feature';
import { ICustomer } from '@app/_shared/interfaces';
import { ChipListComponent } from '@app/_shared/components/chip-list-component/chip-list.component';
import { CustomerService } from '@app/_services/customer.service';

@Component({
  selector: 'app-feature-edit',
  templateUrl: './feature-edit.component.html',
  styleUrls: ['./feature-edit.component.scss'],
})
export class FeatureEditComponent implements OnInit, OnDestroy {
  private loadingSubject$: BehaviorSubject<boolean>;
  private featureId: number;
  private selectedCustomers: ICustomer[];

  editForm: FormGroup;
  loading$: Observable<boolean>;
  paramsSubscription: Subscription;

  @ViewChild('description', { static: false }) description: ElementRef<HTMLInputElement>;
  @ViewChild('chipList', { static: true }) chipList: ChipListComponent<ICustomer>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private featureService: FeatureService,
    private customerService: CustomerService,
    private snackBarService: SnackBarService
  ) {
    this.loadingSubject$ = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loadingSubject$.asObservable();
    this.selectedCustomers = [];
  }

  ngOnInit() {
    this.editForm = new FormGroup({
      displayName: new FormControl(''),
      technicalName: new FormControl('', Validators.required),
      expiresOn: new FormControl(''),
      inverted: new FormControl(''),
    });
    this.chipList.init(this.customerService, 'name');
    this.loadFeatureData();
  }

  ngOnDestroy() {
    this.loadingSubject$.unsubscribe();
    this.paramsSubscription.unsubscribe();
  }

  private loadFeatureCustomers() {
    if (this.featureId) {
      this.loadingSubject$.next(true);
      this.featureService
        .findCustomersByFeatureId(this.featureId)
        .pipe(take(1))
        .subscribe(
          (customers) => {
            this.chipList.selectedEntries = customers;
            this.loadingSubject$.next(false);
          },
          (error) => this.loadingSubject$.next(false)
        );
    }
  }

  private loadFeatureData() {
    this.loadingSubject$.next(true);
    this.paramsSubscription = this.route.paramMap
      .pipe(
        switchMap((params) => {
          const FEATURE_ID: number = +params.get('feature_id');
          return this.featureService.findById(FEATURE_ID);
        })
      )
      .subscribe((feature) => {
        this.loadingSubject$.next(false);
        this.featureId = feature.id;
        this.editForm.get('displayName').setValue(feature.displayName);
        this.editForm.get('technicalName').setValue(feature.technicalName);
        this.editForm.get('expiresOn').setValue(new Date(feature.expiresOn));
        this.editForm.get('inverted').setValue(feature.inverted);
        this.description.nativeElement.value = feature.description;

        // It loads the customer(s) that have the edited feature assigned.
        this.loadFeatureCustomers();
      });
  }

  public edit() {
    this.loadingSubject$.next(true);

    const DATA = new Feature();
    DATA.id = this.featureId;
    DATA.displayName = this.editForm.get('displayName').value;
    DATA.technicalName = this.editForm.get('technicalName').value;
    DATA.expiresOn = this.editForm.get('expiresOn').value;
    DATA.inverted = this.editForm.get('inverted').value ? true : false;
    DATA.description = this.description.nativeElement.value;
    DATA.customerIds = this.chipList.retrieveEntrieIds();

    this.featureService.update(DATA).subscribe(
      (res) => {
        this.loadingSubject$.next(false);
        this.snackBarService.show(true, `Feature has been updated.`);
        this.router.navigate(['/features']);
      },
      (err) => {
        this.snackBarService.show(false, `Feature edition failed due to ${formatError(err)}.`);
        this.loadingSubject$.next(false);
      }
    );
  }
}
