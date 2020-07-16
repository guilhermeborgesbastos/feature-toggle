import { Component, OnInit, ViewChild } from '@angular/core';

import { AuthenticationService } from '@services/authentication.service';
import { User } from '@models/user';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SnackBarService } from './_services/snack-bar.service';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { environment } from '../environments/environment';
import { AppTitle } from './_shared/interfaces';
import { camelCase } from './_helpers/utils';
import { Role } from '@app/_models/user';
import { MatDrawer } from '@angular/material/sidenav';

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
  }

  ngOnInit() {
    this.loggedUser$ = this.authService.loggedUser$;
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
            nestedTitle = nestedTitle.concat(child.snapshot.data['title'], ' / ');
          }
          appTitle.sidebarTitle = nestedTitle;
          appTitle.tabTitle = child.snapshot.data['title'];
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
