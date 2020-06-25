import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsersComponent } from './users.component';
import { UsersListComponent } from './users-list/users-list.component';
import { FilterTextboxComponent } from './users-list/filter-textbox.component';

import { SharedModule } from '@shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  imports: [CommonModule, FormsModule, UsersRoutingModule, SharedModule],
  declarations: [UsersComponent, UsersListComponent, FilterTextboxComponent],
  exports: [UsersComponent],
})
export class UsersModule {}
