import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'enumToArray' })
export class EnumToArrayPipe implements PipeTransform {
  transform(value, args?: string[]): any {
    const result = Object.keys(value)
      .filter((e) => !isNaN(+e))
      .map((o) => {
        return { key: +o, value: value[o] };
      });
    return result.sort((a, b) => (a.value < b.value ? -1 : 1));
  }
}
