import { Component, OnInit } from '@angular/core';
import { SnackBarService } from '@services/snack-bar.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(private snackBarService: SnackBarService, public authService: AuthenticationService) {
    this.authService = authService;
  }

  ngOnInit() {}
}
