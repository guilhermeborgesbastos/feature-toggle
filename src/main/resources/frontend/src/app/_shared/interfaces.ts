import { Role } from '@app/_models/user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * A common 'contract' for all the resources (models).
 */
export interface AbstractResource {
  id: number;
}

// The resource models.
export interface IUser extends AbstractResource {
  role: Role;
  name: string;
  email: string;
  status: string;
}
export interface ICustomer extends AbstractResource {
  name: string;
  featureIds?: number[];
}

export interface IFeature extends AbstractResource {
  technicalName: string;
  displayName?: string;
  expiresOn?: Date;
  description?: string;
  inverted: boolean;
  customerIds?: number[];
}

export interface IPageParams {
  page: number; // The page number with default value as the first page (with index 0).
  size: number; // The maximun amount of enties to the pageable response. default value as 10 entries.
}

// The API REST response properties.
export interface IRestResponse<T extends AbstractResource> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sort: { sorted: boolean; unsorted: boolean; empty: boolean };
}

// The API Error properties.
export interface ApiError {
  debugMessage?: string;
  message: string;
  status: string;
  subErrors: [
    {
      field: string;
      message: string;
      object: string;
      rejectedValue: string;
    }
  ];
  timestamp: string;
}

export abstract class AbstractApiService<T extends AbstractResource> {
  protected constructor(protected http: HttpClient, protected readonly collectionUrl: string) {}

  private parseResponse(res: IRestResponse<T>): IRestResponse<T> {
    return res;
  }

  load(config: IPageParams): Observable<IRestResponse<T>> {
    let params = new HttpParams();
    if (config) {
      params = params.set('page', String(config.page));
      params = params.set('size', String(config.size));
    }
    return this.http
      .get<IRestResponse<T>>(this.collectionUrl, { params: params })
      .pipe(map((res) => this.parseResponse(res)));
  }
}
