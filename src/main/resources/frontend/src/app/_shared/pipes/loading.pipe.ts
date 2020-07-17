import { Pipe, PipeTransform } from '@angular/core';
import { isObservable, of } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';

/**
 * It provides statuses for async operations.
 */
@Pipe({
  name: 'loading',
})
export class LoadingPipe implements PipeTransform {
  transform(val, args?: string[]): any {
    return isObservable(val)
      ? val.pipe(
          map((value: any) => ({ loading: false, value })),
          startWith({ loading: true }),
          catchError((error) => of({ loading: false, error }))
        )
      : val;
  }
}
