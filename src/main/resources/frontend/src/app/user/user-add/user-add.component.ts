import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@services/user.service';
import { createUniqueEmailValidator } from '@helpers/unique-email.validator';
import { formatError } from '@helpers/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { Role } from '@app/_models/user';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
})
export class UserAddComponent implements OnInit, OnDestroy {
  roles = Role;
  addForm: FormGroup;
  loading$: Observable<boolean>;
  private loadingSubject$: BehaviorSubject<boolean>;

  constructor(
    private router: Router,
    private userService: UserService,
    private snackBarService: SnackBarService
  ) {
    this.loadingSubject$ = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loadingSubject$.asObservable();
  }

  ngOnInit() {
    this.addForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        asyncValidators: createUniqueEmailValidator(this.userService, this.snackBarService),
        updateOn: 'blur',
      }),
      password: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
    });
  }

  ngOnDestroy() {
    this.loadingSubject$.unsubscribe();
  }

  public add() {
    this.userService
      .signin(
        this.addForm.get('name').value,
        this.addForm.get('email').value,
        this.addForm.get('password').value,
        this.addForm.get('role').value
      )
      .then(
        (user) => {
          this.snackBarService.show(true, `User has been successfully created.`);
          this.router.navigate(['/users']);
        },
        (error) =>
          this.snackBarService.show(false, `User creation failed due to ${formatError(error)}.`)
      )
      .finally(() => this.loadingSubject$.next(false));
  }

  public cancel() {
    this.router.navigate(['/users']);
  }
}
