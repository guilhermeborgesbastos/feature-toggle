import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@models/user';
import { Observable } from 'rxjs';

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

  getAll() {
    return this.http.get<User[]>(`${environment.API_URL}/${environment.API_VERSION}/user/list`);
  }
}
