import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@helpers/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { Role } from './_models/user';
import { UsersComponent } from './users/users.component';

// The home route is secured by passing the AuthGuard to the canActivate property of the route.
const routes: Routes = [
  {
    path: 'home',
    data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER] },
    canActivate: [AuthGuard],
    component: HomeComponent,
  },
  {
    path: 'users',
    data: { roles: [Role.SUPER_ADMIN] },
    canActivate: [AuthGuard],
    component: UsersComponent,
  },
  {
    path: 'login',
    canActivate: [AuthGuard],
    component: LoginComponent,
  },

  // otherwise redirect to login page
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
