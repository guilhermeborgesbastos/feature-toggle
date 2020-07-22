import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { IFeatureToggle, IFeaturesRequest } from '@app/_shared/interfaces';

@Injectable({ providedIn: 'root' })
export class FeaturesService {
  private resourceUrl: string;

  constructor(private http: HttpClient) {
    this.resourceUrl = `${environment.API_URL}/${environment.API_VERSION}/features`;
  }

  findFeatures(data: IFeaturesRequest): Observable<IFeatureToggle> {
    return this.http.post<IFeatureToggle>(`${this.resourceUrl}/`, data);
  }
}
