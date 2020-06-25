import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthenticationService } from '@services/authentication.service';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '@app/_services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  signinForm: FormGroup;

  hide: boolean = true;
  loading: boolean = false;
  returnUrl: string;
  error = '';

  private loadingSubject: BehaviorSubject<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private userService: UserService
  ) {
    this.loadingSubject = new BehaviorSubject<boolean>(false);
  }

  // Convenience getter for easy access to form fields
  get senderLoginEmail() {
    return this.loginForm.get('email');
  }

  get senderLoginPassword() {
    return this.loginForm.get('password');
  }

  get senderSigninName() {
    return this.signinForm.get('name');
  }

  get senderSigninEmail() {
    return this.signinForm.get('email');
  }

  get senderSigninPassword() {
    return this.signinForm.get('password');
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
    this.loadingSubject.next(true);
    this.loading = true;
    this.authService.login(this.senderLoginEmail.value, this.senderLoginPassword.value).then(
      () => {
        this.loadingSubject.next(false);
        this.router.navigate(['/home']);
      },
      (error) => {
        this.snackBar.open('Authentication has failed.', 'Error', {
          panelClass: 'error-dialog',
        });
        this.loadingSubject.next(false);
      }
    );
  }

  onSigninFormSubmit() {
    if (this.signinForm.invalid) {
      return;
    }
    const name: string = this.senderSigninName.value;
    const email: string = this.senderSigninEmail.value;
    const password: string = this.senderSigninPassword.value;

    this.userService.signIn(name, email, password).then(
      () => {
        this.snackBar.open(
          'Signed-in successfully. Wait for the admin enable your account, after that, you can login.',
          'Info',
          { duration: 8000, panelClass: 'success-dialog' }
        );
        this.signinForm.reset();
      },
      (error) => {
        this.snackBar.open('Signed-in failed.');
      }
    );
  }
}
