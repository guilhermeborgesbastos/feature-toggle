import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User, Role } from '@models/user';
import { Observable } from 'rxjs';
import { IPageParams, IUser, IRestResponse } from '@app/_shared/interfaces';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  findByEmail(email: string): Observable<IUser> {
    return this.http.get<User>(
      `${environment.API_URL}/${environment.API_VERSION}/user/find-by-email`,
      {
        params: new HttpParams().set('email', email),
      }
    );
  }

  getAll(params: IPageParams): Observable<IRestResponse<IUser>> {
    return this.http.get<IRestResponse<IUser>>(
      `${environment.API_URL}/${environment.API_VERSION}/user/list`,
      {
        params: new HttpParams()
          .set('page', params.page.toString())
          .set('size', params.size.toString()),
      }
    );
  }

  enable(userId: number): Promise<any> {
    return this.http
      .put(`${environment.API_URL}/${environment.API_VERSION}/user/${userId}/enable`, {})
      .toPromise();
  }

  disable(userId: number): Promise<any> {
    return this.http
      .put(`${environment.API_URL}/${environment.API_VERSION}/user/${userId}/disable`, {})
      .toPromise();
  }

  signin(
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

  validateEmail(email: string): Observable<boolean> {
    console.log(`validateEmail ${email}`);
    return this.http.post<boolean>(
      `${environment.API_URL}/${environment.API_VERSION}/user/validate-email`,
      new HttpParams().set('user-email', email)
    );
  }
}
