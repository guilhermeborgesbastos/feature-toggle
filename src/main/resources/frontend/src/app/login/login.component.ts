import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  signinForm: FormGroup;

  hide: boolean = true;

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
      ]),
    });

    this.signinForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$'),
      ]),
    });
  }

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
  }
}
