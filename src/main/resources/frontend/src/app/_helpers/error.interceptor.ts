import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '@services/authentication.service';

/**
 * The Error Interceptor intercepts HTTP responses from the API to check if there were any errors.
 * If there is a 401 Unauthorized response, the user is automatically logged out of the application.
 * All other errors are re-thrown up to the calling service so an warning with the error can be
 * displayed on the screen.
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          // auto logout if 401 response returned from API
          this.authenticationService.logout();
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}