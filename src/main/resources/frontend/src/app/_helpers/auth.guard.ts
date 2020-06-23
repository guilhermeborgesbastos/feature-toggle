import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '@services/authentication.service';

/**
 * The auth guard is an angular route guard that's used to prevent unauthenticated users from accessing restricted routes,
 * it does this by implementing the CanActivate interface which allows the guard to decide if a route can be activated with
 * the canActivate() method. If the method returns true the route is activated (allowed to proceed), otherwise if the method
 * returns false the route is blocked.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authenticationService.userValue;
    if (user) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
