import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { CustomerAddComponent } from './customer-add/customer-add.component';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';

import { SharedModule } from '@shared/shared.module';
import { CustomerRoutingModule } from './customer-routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CustomerChipListComponent } from './customer-chip-list/customer-chip-list.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    CommonModule,
    FormsModule,
    CustomerRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
  ],
  declarations: [
    CustomersListComponent,
    CustomerAddComponent,
    CustomerEditComponent,
    CustomerChipListComponent,
  ],
  entryComponents: [CustomersListComponent],
  exports: [CustomerChipListComponent],
})
export class CustomerModule {}
