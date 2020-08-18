import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';

import { IUser, Role } from '@models/index';
import { AbstractApiService } from '@shared/interfaces';

@Injectable({ providedIn: 'root' })
export class UserService extends AbstractApiService<IUser> {
  private resourceUrl: string;

  constructor(http: HttpClient) {
    super(http, `${environment.API_URL}/${environment.API_VERSION}/user/list`);
    this.resourceUrl = `${environment.API_URL}/${environment.API_VERSION}/user`;
  }

  findByEmail(email: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.resourceUrl}/find-by-email`, {
      params: new HttpParams().set('email', email),
    });
  }

  enable(userId: number): Promise<any> {
    return this.http.put(`${this.resourceUrl}/${userId}/enable`, {}).toPromise();
  }

  disable(userId: number): Promise<any> {
    return this.http.put(`${this.resourceUrl}/${userId}/disable`, {}).toPromise();
  }

  signin(
    name: string,
    email: string,
    password: string,
    role: Role = Role.PRODUCT_OWNER
  ): Promise<any> {
    let data = {
      name: name,
      email: email,
      password: password,
      roleId: role === Role.PRODUCT_OWNER ? '2' : '1',
    };

    return this.http
      .post(`${environment.API_URL}/${environment.API_VERSION}/signin`, data)
      .toPromise();
  }

  existsEmail(email: string): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.resourceUrl}/exists-email`,
      new HttpParams().set('user-email', email)
    );
  }

  update(user: IUser): Observable<any> {
    return this.http.put(`${this.resourceUrl}/${user.id}`, user);
  }

  findById(userId: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.resourceUrl}/${userId}`);
  }

  delete(userId: number): Promise<any> {
    return this.http.delete<any>(`${this.resourceUrl}/${userId}`).toPromise();
  }
}
