import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map } from 'rxjs/operators';
import { Role, User } from '@models/user';

import { AuthenticationService } from '@services/authentication.service';
import { Observable } from 'rxjs';

/**
 * The auth guard is an angular route guard that's used to prevent unauthenticated users from accessing restricted routes,
 * it does this by implementing the CanActivate interface which allows the guard to decide if a route can be activated with
 * the canActivate() method. If the method returns true the route is activated (allowed to proceed), otherwise if the method
 * returns false the route is blocked.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authentication: AuthenticationService, private router: Router) {
    console.log('init guard');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log(`canActivate '${route.url}'`);
    return this.canActivateRoute(route, state);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(`canActivate child '${childRoute.url}'`);
    return this.canActivateRoute(childRoute, state);
  }

  private canActivateRoute(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authentication.loggedUser$.pipe(
      map((loggedUser) => {
        const res = this.checkRoute(route, state, loggedUser);
        console.log(`can activate route '${state.url}' '${route.url}' ${res}`);
        return res;
      })
    );
  }

  private checkRoute(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    user: User
  ): boolean {
    if (
      (!route.data.roles && user) ||
      (route.data.roles && !user) ||
      (user && route.data.roles && !route.data.roles.includes(user.role)) ||
      state.url === '/'
    ) {
      if (user) {
        if (user.role === Role.SUPER_ADMIN) {
          this.router.navigate(['/admin/users']);
        } else {
          this.router.navigate(['/404']);
        }
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    }
    return true;
  }
}
