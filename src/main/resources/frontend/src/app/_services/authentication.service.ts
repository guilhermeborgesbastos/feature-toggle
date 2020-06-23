import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@models/user';

/**
 * The authentication service is used to login & logout of the Angular app, it notifies other components when the user logs in & out,
 * and allows access the currently logged in user.
 */
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  /*
   * BehaviorSubject is a special type of Subject that keeps hold of the current value and emits it to any new subscribers
   * as soon as they subscribe, while regular Subjects don't store the current value and only emit values that are published
   * after a subscription is created.
   */
  private userSubject: BehaviorSubject<User>;

  // It allows other components to subscribe to the user Observable.
  public user: Observable<User>;

  constructor(private router: Router, private http: HttpClient) {
    // Initialises the userSubject with the user object from localStorage which enables the user to stay logged in between
    // page refreshes or after the browser is closed.
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  /**
   * It sends the user credentials to the API via an HTTP POST request for authentication. If successful, the user's basic
   * authentication data (base64 encoded username and password) is added to the user object and stored in localStorage to
   * keep the user logged in between page refreshes.
   *
   * @param username
   * @param password
   */
  public login(username: string, password: string) {
    let params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    params.append('grant_type', 'password');
    params.append('client_id', environment.JWT_CLIENT_ID);

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set(
      'Authorization',
      'Basic ' + btoa(`${environment.JWT_CLIENT_ID}:${environment.JWT_CLIENT_SECRET}`)
    );

    console.log(params.toString());

    this.http
      .post(`${environment.API_URL}/oauth/token?${params}`, headers)
      .pipe(map((res) => res))
      .subscribe(
        (data) => this.saveToken(data),
        (err) => alert('Invalid Credentials')
      );
  }

  /**
   * It saves the our access token in a cookie using ng2-cookies library.
   *
   * @param token
   */
  saveToken(token) {
    var expireDate = new Date().getTime() + 1000 * token.expires_in;
    Cookie.set('access_token', token.access_token, expireDate);
    this.router.navigate(['/']);
  }

  /**
   * It checks if user is logged in or not.
   */
  checkCredentials() {
    return Cookie.check('access_token');
  }

  /**
   * It deletes access token cookie and log the user out, publishes null to the userSubject to notify all subscribers
   * that the user has logged out and navigates to the /login page.
   */
  public logout() {
    Cookie.delete('access_token');
    Cookie.delete('id_token');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
