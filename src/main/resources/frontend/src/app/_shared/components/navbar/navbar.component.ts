import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/_services/authentication.service';
import { SnackBarService } from '@app/_services/snack-bar.service';

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
