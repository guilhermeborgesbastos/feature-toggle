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

  findFeatures(customerId: number, featureIds?: number[]): Observable<IFeatureToggle> {
    const DATA = { customerId, featureIds };
    return this.http.post<IFeatureToggle>(`${this.resourceUrl}/`, DATA);
  }
}
