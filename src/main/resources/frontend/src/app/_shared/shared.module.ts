import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import {
  CapitalizePipe,
  NormalizeEnumPipe,
  EnumToArrayPipe,
  EllipsisPipe,
  EmptyPipe,
  DefaultPipe,
  LoadingPipe,
} from '@pipes/index';
import { SnackBarService, SidebarService } from '@services/index';

import { NavbarComponent, SidebarComponent, ChipListComponent } from '@common-components/index';

/**
 * It's a shared module that defines services, pipes and directives that feature modules and
 * lazy-loaded modules can use by defining a static forRoot method in the shared module that
 * returns a ModuleWithProviders object.
 */
@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
  ],
  declarations: [
    CapitalizePipe,
    NormalizeEnumPipe,
    EnumToArrayPipe,
    EllipsisPipe,
    EmptyPipe,
    DefaultPipe,
    LoadingPipe,
    ChipListComponent,
    NavbarComponent,
    SidebarComponent,
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
    DefaultPipe,
    LoadingPipe,
    ChipListComponent,
    NavbarComponent,
    SidebarComponent,
    MatSidenavModule,
  ],
  providers: [SidebarService],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [Title, SnackBarService],
    };
  }
}
