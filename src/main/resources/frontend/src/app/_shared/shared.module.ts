import { NgModule, ModuleWithProviders } from '@angular/core';

import { CapitalizePipe } from './pipes/capitalize.pipe';
import { NormalizeEnumPipe } from './pipes/normalize-enum.pipe';

import { Title } from '@angular/platform-browser';
import { SnackBarService } from '@services/snack-bar.service';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EnumToArrayPipe } from './pipes/enum-to-array.pipe';

/**
 * It's a shared module that defines services, pipes and directives that feature modules and
 * lazy-loaded modules can use by defining a static forRoot method in the shared module that
 * returns a ModuleWithProviders object.
 */
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  declarations: [CapitalizePipe, NormalizeEnumPipe, EnumToArrayPipe],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CapitalizePipe,
    NormalizeEnumPipe,
    EnumToArrayPipe,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [Title, SnackBarService],
    };
  }
}
