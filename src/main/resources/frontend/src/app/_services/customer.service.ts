import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { ICustomer, AbstractApiService } from '@app/_shared/interfaces';

@Injectable({ providedIn: 'root' })
export class CustomerService extends AbstractApiService<ICustomer> {
  private resourceUrl: string;

  constructor(http: HttpClient) {
    super(http, `${environment.API_URL}/${environment.API_VERSION}/customer/list`);
    this.resourceUrl = `${environment.API_URL}/${environment.API_VERSION}/customer`;
  }

  create(customer: ICustomer): Promise<any> {
    return this.http
      .post(this.resourceUrl, {
        name: customer.name,
      })
      .toPromise();
  }

  update(customer: ICustomer): Observable<any> {
    return this.http.put(`${this.resourceUrl}/${customer.id}`, { name: customer.name });
  }

  findById(customerId: number): Observable<ICustomer> {
    return this.http.get<ICustomer>(`${this.resourceUrl}/${customerId}`);
  }

  delete(customerId: number): Promise<any> {
    return this.http.delete<any>(`${this.resourceUrl}/${customerId}`).toPromise();
  }
}
