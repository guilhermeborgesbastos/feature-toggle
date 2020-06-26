import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { UsersComponent } from './users.component';
import { UsersListComponent } from './users-list/users-list.component';
import { FilterTextboxComponent } from './users-list/filter-textbox.component';

import { SharedModule } from '@shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UsersRoutingModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule,
  ],
  declarations: [UsersComponent, UsersListComponent, FilterTextboxComponent],
  exports: [UsersComponent],
})
export class UsersModule {}
