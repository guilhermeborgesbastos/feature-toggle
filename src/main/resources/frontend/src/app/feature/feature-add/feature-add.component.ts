import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { FeatureService, CustomerService, SnackBarService } from '@services/index';
import { ICustomer } from '@models/index';
import { formatError } from '@helpers/index';

import { ChipListComponent } from '@common-components/chip-list-component/chip-list.component';

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
  @ViewChild('chipList', { static: true }) chipList: ChipListComponent<ICustomer>;

  constructor(
    private router: Router,
    private featureService: FeatureService,
    private customerService: CustomerService,
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
    this.chipList.init(this.customerService, 'name');
  }

  public create() {
    this.featureService
      .create(
        this.createForm.get('displayName').value,
        this.createForm.get('technicalName').value,
        this.description.nativeElement.value,
        this.createForm.get('inverted').value,
        this.createForm.get('expiresOn').value,
        this.chipList.retrieveEntrieIds()
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
}
