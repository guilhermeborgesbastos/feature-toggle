import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { IFeature, ICustomer } from '@models/index';
import { AbstractApiService } from '@app/_shared/interfaces';

@Injectable({ providedIn: 'root' })
export class FeatureService extends AbstractApiService<IFeature> {
  private resourceUrl: string;

  constructor(http: HttpClient) {
    super(http, `${environment.API_URL}/${environment.API_VERSION}/feature/list`);
    this.resourceUrl = `${environment.API_URL}/${environment.API_VERSION}/feature`;
  }

  enable(featureId: number): Promise<any> {
    return this.http.put(`${this.resourceUrl}/${featureId}/enable`, {}).toPromise();
  }

  archive(featureId: number, customerId: number): Promise<any> {
    return this.http
      .put(`${this.resourceUrl}/archive/${featureId}/customer/${customerId}`, {})
      .toPromise();
  }

  findCustomersByFeatureId(featureId: number): Observable<ICustomer[]> {
    return this.http.get<ICustomer[]>(`${this.resourceUrl}/${featureId}/customers`);
  }

  create(
    displayName: string,
    technicalName: string,
    description: string,
    inverted: boolean = false,
    expiresOn?: string,
    customerIds?: number[]
  ): Promise<any> {
    let data = {
      displayName,
      technicalName,
      description,
      inverted: inverted ? true : false,
      expiresOn,
      customerIds,
    };
    return this.http
      .post(`${environment.API_URL}/${environment.API_VERSION}/feature`, data)
      .toPromise();
  }

  update(feature: IFeature): Observable<any> {
    return this.http.put(`${this.resourceUrl}/${feature.id}`, feature);
  }

  findById(featureId: number): Observable<IFeature> {
    return this.http.get<IFeature>(`${this.resourceUrl}/${featureId}`);
  }

  delete(featureId: number): Promise<any> {
    return this.http.delete<any>(`${this.resourceUrl}/${featureId}`).toPromise();
  }
}
