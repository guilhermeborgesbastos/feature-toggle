import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureAddComponent } from './feature-add/feature-add.component';
import { FeaturesListComponent } from './features-list/features-list.component';
import { Role } from '@app/_models/user';
import { FeatureEditComponent } from '@app/feature/feature-edit/feature-edit.component';

const routes: Routes = [
  {
    path: 'features',
    component: FeaturesListComponent,
    data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER], title: 'Features list' },
  },
  {
    path: 'feature/new',
    component: FeatureAddComponent,
    data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER], title: 'Create feature' },
  },
  {
    path: 'feature/edit/:feature_id',
    component: FeatureEditComponent,
    data: { roles: [Role.SUPER_ADMIN, Role.PRODUCT_OWNER], title: 'Edit feature' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureRoutingModule {}
