import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureAddComponent } from './feature-add/feature-add.component';
import { FeaturesListComponent } from './features-list/features-list.component';
import { FeatureEditComponent } from '@app/feature/feature-edit/feature-edit.component';

import { Role } from '@models/index';

const ROUTES: Routes = [
  {
    path: 'features',
    component: FeaturesListComponent,
    data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER], title: 'list' },
  },
  {
    path: 'feature/new',
    component: FeatureAddComponent,
    data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER], title: 'create' },
  },
  {
    path: 'feature/edit/:feature_id',
    component: FeatureEditComponent,
    data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER], title: 'edit' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class FeatureRoutingModule {}
