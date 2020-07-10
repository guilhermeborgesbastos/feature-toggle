import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAddComponent } from './user-add/user-add.component';
import { UsersListComponent } from './users-list/users-list.component';
import { Role } from '@app/_models/user';
import { UserEditComponent } from '@app/user/user-edit/user-edit.component';

const routes: Routes = [
  {
    path: 'users',
    component: UsersListComponent,
    data: { roles: [Role.SUPER_ADMIN], title: 'Users list' },
  },
  {
    path: 'user/new',
    component: UserAddComponent,
    data: { roles: [Role.SUPER_ADMIN], title: 'Create user' },
  },
  {
    path: 'user/edit/:user_id',
    component: UserEditComponent,
    data: { roles: [Role.SUPER_ADMIN], title: 'Edit user' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
