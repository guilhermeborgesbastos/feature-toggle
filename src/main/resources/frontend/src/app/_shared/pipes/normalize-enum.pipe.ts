import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'normalizeEnum' })
export class NormalizeEnumPipe implements PipeTransform {
  transform(value: any) {
    if (value) {
      return value.replace(/_/g, ' ');
    }
    return value;
  }
}
