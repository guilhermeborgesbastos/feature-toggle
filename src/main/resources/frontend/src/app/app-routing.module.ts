import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@helpers/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { Role } from './_models/user';

// The home route is secured by passing the AuthGuard to the canActivate property of the route.
const routes: Routes = [
  {
    path: '',
    data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER] },
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: HomeComponent,
  },
  { path: 'login', component: LoginComponent },

  // otherwise redirect to 404
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
