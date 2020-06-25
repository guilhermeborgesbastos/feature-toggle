import { Component, OnInit, ViewChild } from '@angular/core';

import { AuthenticationService } from '@services/authentication.service';
import { User } from '@models/user';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Feature Toggle';
  loggedUser$: Observable<User>;

  authService: AuthenticationService;
  @ViewChild('drawer') drawer;

  constructor(authService: AuthenticationService, private snackBar: MatSnackBar) {
    this.authService = authService;
  }

  ngOnInit() {
    console.log('init navbar');
    this.loggedUser$ = this.authService.loggedUser$;
    this.authService.logout$.subscribe((msg) => this.snackBar.open(msg));
  }

  logout() {
    this.authService.logout('The session has been completed');
  }
}
