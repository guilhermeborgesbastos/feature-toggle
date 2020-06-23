import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AuthenticationService } from '@services/authentication.service';

/**
 * The Basic Authentication Interceptor intercepts HTTP requests from the application to add basic
 * authentication credentials to the Authorization header if the user is logged in and the request
 * is to the application API URL.
 */
@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add header with basic auth credentials if user is logged in and request is to the api url
    const user = this.authenticationService.userValue;
    const isLoggedIn = user && user.authdata;
    const isApiUrl = request.url.startsWith(environment.API_URL);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${user.authdata}`,
        },
      });
    }

    return next.handle(request);
  }
}
