import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, pipe, throwError } from 'rxjs';
import { filter, retryWhen, switchMap, take, delay } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { AuthenticationService } from '@services/authentication.service';

/**
 * The Basic Authentication Interceptor intercepts HTTP requests from the application to add basic
 * authentication credentials to the Authorization header if the user is logged in and the request
 * is to the application API URL.
 */
@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  private static authService: AuthenticationService = null;
  static init(authService: AuthenticationService) {
    console.log(`BasicAuthInterceptor interceptor initialized`);
    this.authService = authService;
  }

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (BasicAuthInterceptor === null || !BasicAuthInterceptor.authService.interceptUrl(request)) {
      console.log(`skip token interceptor for ${request.urlWithParams}`);
      return next.handle(request);
    }
    console.log(`intercept ${request.urlWithParams}`);
    let retryCount = 0;
    return BasicAuthInterceptor.authService.accessToken$.pipe(
      filter((token) => !!token), // Skip null tokens
      take(1),
      // delay(3000),
      switchMap((token: string) => {
        console.log(`add access token to ${request.urlWithParams}`);
        return next.handle(this.addToken(request, token));
      }),
      // retry 1 time in case of 401 errors, in case the token expires between the expiration check and the http call
      retryWhen(
        pipe(
          switchMap((err) =>
            err instanceof HttpErrorResponse &&
            (<HttpErrorResponse>err).status === 401 &&
            retryCount++ < 2
              ? of(err)
              : throwError(err)
          )
        )
      )
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
}
