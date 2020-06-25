import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User, Role } from '@models/user';
import { Observable } from 'rxjs';
import { IPageParams } from '@app/_shared/interfaces';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  findByEmail(email: string): Observable<User> {
    return this.http.get<User>(
      `${environment.API_URL}/${environment.API_VERSION}/user/find-by-email`,
      {
        params: new HttpParams().set('email', email),
      }
    );
  }

  getAll(params: IPageParams) {
    return this.http.get<User[]>(`${environment.API_URL}/${environment.API_VERSION}/user/list`, {
      params: new HttpParams()
        .set('page', params.page.toString())
        .set('size', params.size.toString()),
    });
  }

  signIn(
    name: string,
    email: string,
    password: string,
    role: Role = Role.PRODUCT_OWNER
  ): Promise<any> {
    const data = {
      name: name,
      email: email,
      password: password,
      roleId: role === Role.PRODUCT_OWNER ? '2' : '1',
    };

    return this.http
      .post(`${environment.API_URL}/${environment.API_VERSION}/signin`, data)
      .toPromise();
  }
}
