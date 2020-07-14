import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@helpers/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { Role } from './_models/user';

// The home route is secured by passing the AuthGuard to the canActivate and canActivateChild properties of the route.
const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    canActivate: [AuthGuard],
    data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER], title: 'Dashboard' },
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER], title: 'Usage' },
      },
    ],
  },
  {
    path: '',
    canActivateChild: [AuthGuard],
    canActivate: [AuthGuard],
    data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER], title: 'Customer' },
    children: [
      {
        path: '',
        loadChildren: () => import('./customer/customer.molule').then((mod) => mod.CustomerModule),
      },
    ],
  },
  {
    path: '',
    data: { roles: [Role.SUPER_ADMIN], title: 'User' },
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: '', loadChildren: () => import('./user/user.molule').then((mod) => mod.UserModule) },
    ],
  },
  {
    path: '',
    data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER], title: 'Feature' },
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./feature/feature.molule').then((mod) => mod.FeatureModule),
      },
    ],
  },
  {
    path: '',
    data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER], title: 'API' },
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./api/api.molule').then((mod) => mod.ApiModule),
      },
    ],
  },
  {
    path: 'login',
    data: { title: 'Login' },
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
