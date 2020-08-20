import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { MatDrawer } from '@angular/material/sidenav';

import { SnackBarService } from '@services/snack-bar.service';
import { AuthenticationService } from '@services/authentication.service';

import { User, Role } from '@models/index';
import { camelCase } from '@helpers/index';
import { AppTitle } from '@shared/interfaces';

export class AppTitleData implements AppTitle {
  sidebarTitle: string;
  tabTitle: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  roles = Role;
  appVersion: string;
  sidebarTitle: string;
  loggedUser$: Observable<User>;

  @ViewChild(MatDrawer) drawer: MatDrawer;

  constructor(
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private snackBarService: SnackBarService,
    private authService: AuthenticationService
  ) {
    this.authService = authService;
    this.appVersion = environment.APP_VERSION;
    this.loggedUser$ = this.authService.loggedUser$;
  }

  ngOnInit() {
    const TITLE: string = 'title';
    this.authService.logout$.subscribe((msg: string) => this.snackBarService.show(true, msg));

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
            nestedTitle = nestedTitle.concat(child.snapshot.data[TITLE], ' / ');
          }
          appTitle.sidebarTitle = nestedTitle;
          appTitle.tabTitle = child.snapshot.data[TITLE];
          return appTitle;
        })
      )
      .subscribe((appTitle: AppTitle) => {
        this.sidebarTitle = appTitle.sidebarTitle;
        const tabTitle = `${appTitle.tabTitle} | Feature Toggle`;
        this.titleService.setTitle(camelCase(tabTitle));
      });
  }

  public logout() {
    this.authService.logout('The session has been completed');
  }
}
