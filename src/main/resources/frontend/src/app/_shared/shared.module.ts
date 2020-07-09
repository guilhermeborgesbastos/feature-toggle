import { NgModule, ModuleWithProviders } from '@angular/core';

import { CapitalizePipe } from './pipes/capitalize.pipe';
import { NormalizeEnumPipe } from './pipes/normalize-enum.pipe';

import { Title } from '@angular/platform-browser';
import { SnackBarService } from '@services/snack-bar.service';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EnumToArrayPipe } from './pipes/enum-to-array.pipe';
import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { EmptyPipe } from './pipes/empty.pipe';
import { ChipListComponent } from './components/chip-list-component/chip-list.component';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

/**
 * It's a shared module that defines services, pipes and directives that feature modules and
 * lazy-loaded modules can use by defining a static forRoot method in the shared module that
 * returns a ModuleWithProviders object.
 */
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    CapitalizePipe,
    NormalizeEnumPipe,
    EnumToArrayPipe,
    EllipsisPipe,
    EmptyPipe,
    ChipListComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CapitalizePipe,
    NormalizeEnumPipe,
    EnumToArrayPipe,
    EllipsisPipe,
    EmptyPipe,
    ChipListComponent,
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
