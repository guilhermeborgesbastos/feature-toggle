import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Role } from '@models/index';
import { CustomerAddComponent } from './customer-add/customer-add.component';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';

const ROUTES: Routes = [
  {
    path: 'customers',
    component: CustomersListComponent,
    data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER], title: 'list' },
  },
  {
    path: 'customer/new',
    component: CustomerAddComponent,
    data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER], title: 'create' },
  },
  {
    path: 'customer/edit/:customer_id',
    component: CustomerEditComponent,
    data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER], title: 'edit' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
