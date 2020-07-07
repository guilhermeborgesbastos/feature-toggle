import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FeatureService } from '@services/feature.service';
import { formatError } from '@helpers/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { CustomerChipListComponent } from '@app/customer/customer-chip-list/customer-chip-list.component';

@Component({
  selector: 'app-feature-add',
  templateUrl: './feature-add.component.html',
  styleUrls: ['./feature-add.component.scss'],
})
export class FeatureAddComponent implements OnInit {
  private loadingSubject: BehaviorSubject<boolean>;

  loading$: Observable<boolean>;
  createForm: FormGroup;

  @ViewChild('description', { static: false }) description: ElementRef<HTMLInputElement>;
  @ViewChild('chipList') chipList: CustomerChipListComponent;

  constructor(
    private router: Router,
    private featureService: FeatureService,
    private snackBarService: SnackBarService
  ) {
    this.loadingSubject = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.createForm = new FormGroup({
      displayName: new FormControl(''),
      technicalName: new FormControl('', Validators.required),
      expiresOn: new FormControl(''),
      inverted: new FormControl(''),
    });
  }

  create() {
    this.featureService
      .create(
        this.createForm.get('displayName').value,
        this.createForm.get('technicalName').value,
        this.description.nativeElement.value,
        this.createForm.get('inverted').value,
        this.createForm.get('expiresOn').value,
        this.chipList.retrieveCustomerIds()
      )
      .then(
        (feature) => {
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
