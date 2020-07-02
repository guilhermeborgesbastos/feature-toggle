import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@services/user.service';
import { createUniqueEmailValidator } from '@helpers/unique-email.validator';
import { formatError } from '@helpers/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { Role } from '@app/_models/user';

@Component({
  selector: 'app-user-signin',
  templateUrl: './user-signin.component.html',
})
export class UserSigninComponent implements OnInit {
  roles = Role;
  signinForm: FormGroup;
  loading$: Observable<boolean>;
  private loadingSubject: BehaviorSubject<boolean>;

  constructor(
    private router: Router,
    private userService: UserService,
    private snackBarService: SnackBarService
  ) {
    this.loadingSubject = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.signinForm = new FormGroup({
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

  signin() {
    this.userService
      .signin(
        this.signinForm.get('name').value,
        this.signinForm.get('email').value,
        this.signinForm.get('password').value,
        this.signinForm.get('role').value
      )
      .then(
        (newUser) => {
          this.loadingSubject.next(false);
          if (newUser) {
            this.snackBarService.show(true, `User has been successfully created.`);
            this.router.navigate(['/users']);
          }
        },
        (error) => {
          this.snackBarService.show(false, `User creation failed due to ${formatError(error)}.`);
          this.loadingSubject.next(false);
        }
      );
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}
