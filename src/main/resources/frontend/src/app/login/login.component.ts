import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@services/authentication.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.userValue) {
      this.router.navigate(['/']);
    }
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
    console.log('onLoginFormSubmit...');
    this.loading = true;
    this.authenticationService.login(this.senderLoginEmail.value, this.senderLoginPassword.value);
  }

  onSigninFormSubmit() {
    if (this.signinForm.invalid) {
      return;
    }
    let name: string = this.senderSigninName.value;
    let email: string = this.senderSigninEmail.value;
    let password: string = this.senderSigninPassword.value;
    console.log(`name: ${name}, email ${email}, password: ${password}`);
  }
}
