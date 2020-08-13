import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AuthenticationService } from '@app/_services/authentication.service';
import { SidebarService } from '@app/_services/sidebar.service';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { IUser } from '@app/_shared/interfaces';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  loggedUser$: Observable<IUser>;

  isDrawerOpened: boolean;
  isProfileOpened: boolean;

  @Input() sidebarTitle: string;

  @Input()
  set drawer(drawer: MatDrawer) {
    this.sidebarService.setMatDrawer(drawer);
  }

  constructor(public authService: AuthenticationService, public sidebarService: SidebarService) {
    this.sidebarService = sidebarService;
    this.authService = authService;
    this.isDrawerOpened = true;
  }

  ngOnInit() {
    this.loggedUser$ = this.authService.loggedUser$;
    this.sidebarService.isOpened$.subscribe(
      (isOpened: boolean) => (this.isDrawerOpened = isOpened)
    );
  }

  ngOnDestroy() {
    this.sidebarService.isOpened$.unsubscribe();
  }

  public logout(): void {
    this.authService.logout('The session has been completed');
  }

  public toggleProfile(): void {
    this.isProfileOpened = !this.isProfileOpened;
  }
}
