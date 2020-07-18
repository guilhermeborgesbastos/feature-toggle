import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '@services/authentication.service';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '@app/_services/user.service';
import { SnackBarService } from '@app/_services/snack-bar.service';

const EMAIL = 'email';
const NAME = 'name';
const PASSWORD = 'password';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  signinForm: FormGroup;

  hide: boolean;
  loading: boolean;
  returnUrl: string;
  error: string;

  private loadingSubject$: BehaviorSubject<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBarService: SnackBarService,
    private authService: AuthenticationService,
    private userService: UserService
  ) {
    this.loadingSubject$ = new BehaviorSubject<boolean>(false);
    this.loading = false;
    this.hide = true;
    this.error = '';
  }

  // Convenience getter for easy access to form fields
  get senderLoginEmail() {
    return this.loginForm.get(EMAIL);
  }

  get senderLoginPassword() {
    return this.loginForm.get(PASSWORD);
  }

  get senderSigninName() {
    return this.signinForm.get(NAME);
  }

  get senderSigninEmail() {
    return this.signinForm.get(EMAIL);
  }

  get senderSigninPassword() {
    return this.signinForm.get(PASSWORD);
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });

    this.signinForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
        ),
      ]),
    });

    // It gets the return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onLoginFormSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.loadingSubject$.next(true);
    this.loading = true;
    this.authService
      .login(this.senderLoginEmail.value, this.senderLoginPassword.value)
      .then(
        (resp) => this.router.navigate(['/home']),
        (error) => this.snackBarService.show(false, 'Authentication has failed.', 'Error')
      )
      .finally(() => this.loadingSubject$.next(false));
  }

  onSigninFormSubmit() {
    if (this.signinForm.invalid) {
      return;
    }

    this.loadingSubject$.next(true);
    this.userService
      .signin(
        this.senderSigninName.value,
        this.senderSigninEmail.value,
        this.senderSigninPassword.value
      )
      .then(
        (resp) => {
          this.snackBarService.show(
            true,
            'Signed-in successfully. Wait for the admin enable your account, after that, you can login.',
            'Info',
            8000
          );
          this.signinForm.reset();
        },
        (error) => this.snackBarService.show(false, 'Signed-in failed.')
      )
      .finally(() => this.loadingSubject$.next(false));
  }
}
