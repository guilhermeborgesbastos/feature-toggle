import { Pipe } from '@angular/core';

@Pipe({
  name: 'empty',
})
export class EmptyPipe {
  transform(val: string, paceholder: string = '---') {
    if (!val || !val.trim()) {
      return paceholder;
    }
    return val;
  }
}
