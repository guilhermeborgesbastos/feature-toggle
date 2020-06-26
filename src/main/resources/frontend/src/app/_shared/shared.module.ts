import { NgModule } from '@angular/core';

import { CapitalizePipe } from './pipes/capitalize.pipe';
import { NormalizeEnumPipe } from './pipes/normalize-enum.pipe';

@NgModule({
  declarations: [CapitalizePipe, NormalizeEnumPipe],
  exports: [CapitalizePipe, NormalizeEnumPipe],
})
export class SharedModule {}
