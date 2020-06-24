// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_VERSION: 'v1',
  JWT_CLIENT_ID: 'gbastos-feature-toggle',
  JWT_CLIENT_SECRET: 'secret',
  API_URL: 'http://localhost:8080/api',
  LOGIN_URL: 'http://localhost:8080/api/oauth/token',
  API_SIGNIN_URL: 'http://localhost:8080/api/v1/signin',
  LOGIN_REDIRECT_URL: 'http://localhost:4200/home',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
