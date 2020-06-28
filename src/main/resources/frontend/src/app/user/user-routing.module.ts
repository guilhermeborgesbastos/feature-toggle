import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSigninComponent } from './user-signin/user-signin.component';
import { UsersListComponent } from './users-list/users-list.component';
import { Role } from '@app/_models/user';

const routes: Routes = [
  {
    path: 'users',
    component: UsersListComponent,
    data: { roles: [Role.SUPER_ADMIN], title: 'Users list' },
  },
  {
    path: 'users/new',
    component: UserSigninComponent,
    data: { roles: [Role.SUPER_ADMIN], title: 'Create user' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
