import { NgModule } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { ApiFeaturesComponent } from './features/api-features.component';
import { ApiRoutingModule } from './api-routing.module';

import { FeaturesService } from '@services/index';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ApiRoutingModule,
    MatCardModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  providers: [FeaturesService],
  declarations: [ApiFeaturesComponent],
  entryComponents: [ApiFeaturesComponent],
})
export class ApiModule {}
