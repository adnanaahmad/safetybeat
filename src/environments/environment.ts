// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

<<<<<<< HEAD
const serverUrl = 'http://192.168.69.70:8000';
=======
const serverUrl = 'http://192.168.69.38:8000';
>>>>>>> 700431b8f0b7caf99e1e40f6a6264bd60797aa19
export const environment = {
  production: false,
  apiUrl: `${serverUrl}/safetybeat`,
  serverUrl: `${serverUrl}`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
