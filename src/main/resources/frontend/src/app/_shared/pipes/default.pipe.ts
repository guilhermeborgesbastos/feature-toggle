import { Pipe } from '@angular/core';

@Pipe({ name: 'default', pure: true })
export class DefaultPipe {
  transform(value: any, defaultValue: any): any {
    return value || defaultValue;
  }
}
