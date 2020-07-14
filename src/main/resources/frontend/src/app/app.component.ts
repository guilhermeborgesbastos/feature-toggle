import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { AuthenticationService } from '@services/authentication.service';
import { User } from '@models/user';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SnackBarService } from './_services/snack-bar.service';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { environment } from '../environments/environment';
import { MatDrawer } from '@angular/material/sidenav';
import { SidebarService } from './_services/sidebar.service';
import { AppTitle } from './_shared/interfaces';
import { camelCase } from './_helpers/utils';
import { Role } from '@app/_models/user';

export class AppTitleData implements AppTitle {
  navbarTitle: string;
  tabTitle: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  sidebarService: SidebarService;
  matDrawer: MatDrawer;
  roles = Role;

  @ViewChild(MatDrawer) set matDrawerView(matDrawer: MatDrawer) {
    if (matDrawer) {
      this.matDrawer = matDrawer;
      this.sidebarService.setMatDrawer(matDrawer);
    }
  }

  navbarTitle: string;
  appVersion: string;
  loggedUser$: Observable<User>;
  authService: AuthenticationService;
  isDrawerOpened: boolean;
  isToggleProfileOpened: boolean;

  constructor(
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBarService: SnackBarService,
    sidebarService: SidebarService,
    authService: AuthenticationService
  ) {
    this.authService = authService;
    this.appVersion = environment.APP_VERSION;
    this.sidebarService = sidebarService;
    this.isDrawerOpened = true;
    this.isToggleProfileOpened = false;
  }

  ngOnInit() {
    this.loggedUser$ = this.authService.loggedUser$;
    this.authService.logout$.subscribe((msg: string) => this.snackBarService.show(true, msg));
    this.sidebarService.isOpened.subscribe((isOpened: boolean) => (this.isDrawerOpened = isOpened));

    /*
     * It subscribe to router events and access the data with the help of ActivatedRoute and
     * set the title with Title service accordingly to the activatedRoute.
     */
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          const appTitle: AppTitle = new AppTitleData();
          let child = this.activatedRoute.firstChild;
          let nestedTitle: string = '';
          while (child.firstChild) {
            child = child.firstChild;
            nestedTitle = nestedTitle.concat(child.snapshot.data['title'], ' / ');
          }
          appTitle.navbarTitle = nestedTitle;
          appTitle.tabTitle = child.snapshot.data['title'];
          return appTitle;
        })
      )
      .subscribe((appTitle: AppTitle) => {
        this.navbarTitle = appTitle.navbarTitle;
        const tabTitle = `${appTitle.tabTitle} | Feature Toggle`;
        this.titleService.setTitle(camelCase(tabTitle));
      });
  }

  ngOnDestroy() {
    this.sidebarService.isOpened.unsubscribe();
  }

  toggleProfile() {
    this.isToggleProfileOpened = !this.isToggleProfileOpened;
  }

  logout() {
    this.authService.logout('The session has been completed');
  }
}
