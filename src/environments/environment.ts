// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


const serverUrl = 'http://192.168.69.50:8000';

export const environment = {
  production: false,
  apiUrl: `${serverUrl}/safetybeat`,
  serverUrl: `${serverUrl}`,
  firebaseConfig: {
    apiKey: 'AIzaSyA5fX1GOd488hjQnYnih4aFLmJhoRBBiMs',
    authDomain: 'safetybeat-12abc.firebaseapp.com',
    databaseURL: 'https://safetybeat-12abc.firebaseio.com',
    projectId: 'safetybeat-12abc',
    storageBucket: '',
    messagingSenderId: '907574511477',
    appId: '1:907574511477:web:73c22bb0597786f6'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
