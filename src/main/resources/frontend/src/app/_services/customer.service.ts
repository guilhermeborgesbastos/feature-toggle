import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';

import { AbstractApiService } from '@shared/interfaces';
import { ICustomer, IFeature } from '@models/index';

@Injectable({ providedIn: 'root' })
export class CustomerService extends AbstractApiService<ICustomer> {
  private resourceUrl: string;

  constructor(http: HttpClient) {
    super(http, `${environment.API_URL}/${environment.API_VERSION}/customer/list`);
    this.resourceUrl = `${environment.API_URL}/${environment.API_VERSION}/customer`;
  }

  findFeaturesByCustomerId(customerId: number): Observable<IFeature[]> {
    return this.http.get<IFeature[]>(`${this.resourceUrl}/${customerId}/features`);
  }

  create(customer: ICustomer): Promise<any> {
    return this.http.post(this.resourceUrl, customer).toPromise();
  }

  update(customer: ICustomer): Observable<any> {
    return this.http.put(`${this.resourceUrl}/${customer.id}`, customer);
  }

  findById(customerId: number): Observable<ICustomer> {
    return this.http.get<ICustomer>(`${this.resourceUrl}/${customerId}`);
  }

  delete(customerId: number): Promise<any> {
    return this.http.delete<any>(`${this.resourceUrl}/${customerId}`).toPromise();
  }
}
