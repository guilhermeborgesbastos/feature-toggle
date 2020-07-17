import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpRequest, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, EMPTY } from 'rxjs';
import { catchError, map, skipWhile, switchMap, tap } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User, Role } from '@models/user';
import { UserService } from './user.service';
import { BasicAuthInterceptor } from '@app/_helpers/basic-auth.interceptor';
import { ErrorInterceptor } from '@app/_helpers/error.interceptor';

const accessTokenKey = 'access_token';
const refreshTokenKey = 'refresh_token';

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
  private loggedUserSubject: BehaviorSubject<User>;
  private accessTokenSubject: BehaviorSubject<string>;

  private jwtHelper: JwtHelperService;
  private logoutSubject: Subject<string>;
  private userLoading = false;

  // It allows other components to subscribe to the auth's Observables.
  logout$: Observable<string>;
  accessToken$: Observable<string>;
  loggedUser$: Observable<User>;

  constructor(private router: Router, private http: HttpClient, private userService: UserService) {
    // Initialises the loggedUserSubject with the user object from localStorage which enables the user to stay
    // logged in between page refreshes or after the browser is closed.
    this.jwtHelper = new JwtHelperService();
    // Static initializers in order to avoid cyclic dependency issues.
    BasicAuthInterceptor.init(this);
    ErrorInterceptor.init(this);
    this.initAccessTokenPipe();
    this.initLoggedUserPipe();
    this.logoutSubject = new Subject<string>();
    this.logout$ = this.logoutSubject.asObservable();
  }

  // The getters for easier accessing
  get userValue(): User {
    return this.loggedUserSubject.value;
  }

  get loggedUser(): User {
    return this.loggedUserSubject.value;
  }

  private get accessToken(): string {
    const token = this.getToken(accessTokenKey);
    return token && !this.jwtHelper.isTokenExpired(token) ? token : null;
  }

  /**
   * It sends the user credentials to the API via an HTTP POST request for authentication. If successful, the user's basic
   * authentication JWT Tokens (access and refresh tokens) are stored in localStorage to keep the user logged in between
   * page refreshes.
   *
   * @param username
   * @param password
   */
  public login(username: string, password: string): Promise<string> {
    return this.loadAccessToken(true, null, username, password).toPromise();
  }

  /**
   * It fetches the API requesting for basic Authentication using the username and password. In case
   * of successful operation, the JTW tokens are stored on local storage. In case of error using a
   * refresh token, the logout is executed.
   *
   * @param retrieveAccessToken true in case of requesting a new authentication, false for using refresh token.
   * @param refreshToken
   * @param username
   * @param password
   */
  private loadAccessToken(
    retrieveAccessToken: boolean,
    refreshToken?: string,
    username?: string,
    password?: string
  ): Observable<string> {
    console.log(retrieveAccessToken ? 'login' : 'refresh_token');
    const params = retrieveAccessToken
      ? new HttpParams()
          .set('username', username)
          .set('password', password)
          .set('grant_type', 'password')
      : new HttpParams().set(refreshTokenKey, refreshToken).set('grant_type', refreshTokenKey);
    return this.http
      .post<any>(environment.API_LOGIN_URL, params, {
        headers: new HttpHeaders().append(
          'Authorization',
          'Basic ' + btoa(`${environment.JWT_CLIENT_ID}:${environment.JWT_CLIENT_SECRET}`)
        ),
      })
      .pipe(
        map((jwt) => {
          console.log('load token response');
          console.log(jwt);
          return this.saveToken(jwt);
        }),
        catchError((error) => {
          console.error(error);
          if (refreshToken) {
            this.logout('Error loading access token, force logout.');
          }
          throw error;
        })
      );
  }

  /**
   * It saves the access and refresh tokens into the local storage. Emitting events for the access Token
   * Subject's subscribers.
   *
   * @param jwt
   */
  private saveToken(jwt: any): string {
    console.log(`store token`);
    if (jwt && jwt[accessTokenKey]) {
      const accessToken = jwt[accessTokenKey];
      if (jwt[refreshTokenKey]) {
        this.setToken(refreshTokenKey, jwt[refreshTokenKey]);
      }
      this.setToken(accessTokenKey, accessToken);
      this.accessTokenSubject.next(accessToken);
      return accessToken;
    }
    console.log('token invalid');
    return null;
  }

  /**
   * It does the necessary token verifications, such as experiation period.
   */
  private initAccessTokenPipe() {
    this.accessTokenSubject = new BehaviorSubject(this.accessToken);
    this.accessToken$ = this.accessTokenSubject.asObservable().pipe(
      switchMap((token) => {
        if (token && this.jwtHelper.isTokenExpired(token)) {
          console.log('access token expired');
          // It blocks loggedUser to emit until currrent user is loaded
          this.userLoading = true;
          return this.loadAccessTokenUsingRefreshToken();
        }
        console.log(`access token available ${!!token}`);
        return token ? of(token) : EMPTY;
      })
    );
  }

  private initLoggedUserPipe() {
    this.userLoading = true;
    this.loggedUserSubject = new BehaviorSubject<User>(null);
    this.loggedUser$ = this.loggedUserSubject.asObservable().pipe(
      skipWhile(() => {
        // this stops loggedUser subject to emit when the current user is being loaded
        // it's mainly used inside auth guard, in order to make it waits for current user
        // to be loaded before checking next url.
        return this.userLoading;
      })
    );
    this.accessTokenSubject
      .asObservable()
      .pipe(
        // blocks loggedUser to emit until currrent user is loaded
        tap(() => (this.userLoading = true)),
        switchMap((token) => this.extractLoggedUser(token))
      )
      .subscribe((user) => {
        console.log(`logged user change ${user ? user.email : null}`);
        // permits loggedUser to emit new values
        this.userLoading = false;
        this.loggedUserSubject.next(user);
      });
  }

  private loadAccessTokenUsingRefreshToken(): Observable<string> {
    const token = this.getToken(refreshTokenKey);
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      this.logout('The refresh token has expired.');
      return EMPTY;
    }
    return this.loadAccessToken(false, token);
  }

  public getToken(key: string): string {
    return localStorage.getItem(key);
  }

  private setToken(key: string, token: string) {
    localStorage.setItem(key, token);
  }

  /**
   * It deletes access and refresh tokens from local storaget, publishes the logou message
   * to the logoutSubject to notify all subscribers that the user has logged out and navigates
   * to the /login page.
   *
   * @param msg The logout reason message.
   */
  public logout(msg: string): Promise<boolean> {
    console.log('logging out...');
    this.clearToken();
    this.logoutSubject.next(msg);
    return this.router.navigate(['/login']);
  }

  public interceptUrl(req: HttpRequest<any>): boolean {
    return (
      req.url.startsWith(environment.API_URL) &&
      !req.url.startsWith(environment.API_SIGNIN_URL) &&
      !req.headers.get('Authorization')
    );
  }

  public hasRole(role: string): Observable<boolean> {
    return this.loggedUser$.pipe(
      map((loggedUser) => loggedUser && loggedUser.role['id'] === Role[role])
    );
  }

  private clearToken() {
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(refreshTokenKey);
    this.accessTokenSubject.next(null);
  }

  private extractLoggedUser(accessToken: string): Observable<User> {
    if (accessToken) {
      const data = this.jwtHelper.decodeToken(accessToken);
      console.log(`User's data: ${data}`);
      if (data) {
        return this.userService.findByEmail(data.user_name);
      }
    }
    return of(null);
  }
}
