import { AbstractControl, ValidationErrors } from '@angular/forms';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { formatError } from '@helpers/utils';
import { UserService, SnackBarService } from '@services/index';

export function createUniqueEmailValidator(
  userService: UserService,
  snackBarService?: SnackBarService,
  defaultEmail?: string
) {
  return (
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if (defaultEmail && ctrl.value === defaultEmail) {
      return of(null);
    }
    return userService.existsEmail(ctrl.value).pipe(
      map(
        (res) => (res ? { emailTaken: true } : null),
        catchError((err) => {
          snackBarService.show(false, `validation failed due to ${formatError(err)}`);
          return null;
        })
      )
    );
  };
}
