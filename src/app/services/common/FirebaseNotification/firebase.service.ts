import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireMessaging} from '@angular/fire/messaging';
import {catchError, take} from 'rxjs/operators';
import {BehaviorSubject, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ConstantService} from '../constant/constant.service';
import {HelperService} from '../helperService/helper.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  currentMessage = new BehaviorSubject(null);
  myMessage;

  constructor(
    private angularFireDB: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging,
    private http: HttpClient,
    public helperService: HelperService
  ) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    );
  }

  /**
   * Send data to server
   * @params data
   */
  saveToken(data) {
    return this.http.post(ConstantService.apiRoutes.saveFirebaseToken, data).pipe(catchError(this.handleError));
  }

  /**
   * update token in firebase database
   *
   * @param userId userId as a key
   * @param token token as a value
   */
  updateToken(token) {
    // we can change this function to request our backend service
    this.angularFireAuth.authState.pipe(take(1)).subscribe(
      () => {
        const data = {};
        data['firebaseToken'] = token;
        this.saveToken(data).subscribe((res) => {
          // Do what you want to do when token is saved
        });
      });
  }

  /**
   * request permission for notification from firebase cloud messaging
   *
   * @params userId userId
   */
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log('Firebase token: ' + token);
        this.updateToken(token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        this.myMessage = payload;
        //console.log(this.myMessage);
        this.helperService.createSnackNotify(
          this.myMessage.notification.title + ' ' + this.myMessage.notification.body, this.helperService.constants.status.INFO);
        this.currentMessage.next(payload);
      });
  }

  /**
   * this function is used for handling errors when the api call doesn't return any response due to
   * no internet or when the backend is stopped
   * and the this function returns an error and logs out the user.
   * @params error
   */
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.message}`);
    }
    // return an observable with a user-facing error message
    return throwError({error: 'Something bad happened; please try again later.', status: error.status});
  };
}
