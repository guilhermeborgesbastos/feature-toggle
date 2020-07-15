import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Role } from '@app/_models/user';
import { ApiFeaturesComponent } from './features/api-features.component';

const routes: Routes = [
  {
    path: 'api/features',
    component: ApiFeaturesComponent,
    data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER], title: 'Features' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApiRoutingModule {}
