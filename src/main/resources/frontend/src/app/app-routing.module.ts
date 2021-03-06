import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Role } from '@models/index';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from '@guards/index';

// The routes are secured by passing the AuthGuard to the canActivate and canActivateChild properties of each route.
const ROUTES: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    canActivate: [AuthGuard],
    data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER, Role.CLIENT], title: 'Dashboard' },
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER, Role.CLIENT], title: 'Usage' },
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
    data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER, Role.CLIENT], title: 'API' },
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

  // otherwise, it redirect to login page.
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
