import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ErrorInterceptor } from '@helpers/error.interceptor';
import { BasicAuthInterceptor } from '@helpers/basic-auth.interceptor';
import { SharedModule } from './_shared/shared.module';
import { UserModule } from './user/user.molule';
import { CustomerModule } from './customer/customer.molule';
import { LoginModule } from './login/login.module';
import { FeatureModule } from './feature/feature.molule';
import { ApiModule } from './api/api.molule';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    UserModule,
    LoginModule,
    CustomerModule,
    FeatureModule,
    ApiModule,
  ],
  declarations: [AppComponent],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } },
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
