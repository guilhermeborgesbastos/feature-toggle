import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { IFeatureToggle } from '@app/_shared/interfaces';

@Injectable({ providedIn: 'root' })
export class FeaturesService {
  private resourceUrl: string;

  constructor(private http: HttpClient) {
    this.resourceUrl = `${environment.API_URL}/${environment.API_VERSION}/features`;
  }

  findFeaturesByCustomerId(customerId: number): Observable<IFeatureToggle> {
    return this.http.get<IFeatureToggle>(`${this.resourceUrl}/customer/${customerId}`);
  }
}
