import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
  }
  // return an observable with a customer-facing error message
  return throwError('Something bad happened; please try again later.');
}

export function formatError(httpError: any): string {
  if (httpError && httpError.error && httpError.error.apierror) {
    const error = httpError.error.apierror;
    console.log(error);
    let msg = error.message;
    for (let i = 0; i < error.subErrors.length; i++) {
      const e = error.subErrors[i];
      msg += `: ${e.message} on ${e.field}\n`;
    }
    return msg;
  }
  return httpError.message ? httpError.message : 'connection problem with server.';
}

export function camelCase(str: string): string {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}
