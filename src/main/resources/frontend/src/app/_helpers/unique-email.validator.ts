import { AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '@services/user.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { formatError } from '@shared/interfaces';
import { SnackBarService } from '@app/_services/snack-bar.service';

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
    return userService.validateEmail(ctrl.value).pipe(
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
