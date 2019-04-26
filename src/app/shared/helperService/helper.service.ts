import {Injectable, ElementRef} from '@angular/core';
import {forEach, findIndex} from 'lodash';
import {TranslateService} from '@ngx-translate/core';
import {Translation} from 'src/app/models/translate.model';
import {MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar} from '@angular/material';
import {ConstantService} from 'src/app/shared/constant/constant.service';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, throwError} from 'rxjs';
import {ToasterComponent} from 'src/app/common/toaster/toaster.component';
import {PhoneNumberUtil} from 'google-libphonenumber';
import {FormErrorHandler} from '../FormErrorHandler/FormErrorHandler';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  iterations: any;
  findIndex: any;
  translated: Translation;
  constants: typeof ConstantService;
  displayButton: boolean = false;
  public displayLoader = new BehaviorSubject<boolean>(true);
  loader = this.displayLoader.asObservable();
  address: string = '';
  public dialogRef: MatDialogRef<any>;
  formErrorMatcher: any;


  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public translate: TranslateService,
    public dialog: MatDialog,
    private cookies: CookieService,
    private router: Router,
    private notifier: NotifierService
  ) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER', 'STRINGS', 'ICONS', 'SITETITLE',
      'STATUS', 'TABLEHEADINGS', 'CONFIRMATION']).subscribe((values) => {
      this.translated = values;
    });
    this.constants = ConstantService;
    this.iterations = forEach;
    this.findIndex = findIndex;
    this.address = '';
    this.displayButton = false;
    this.formErrorMatcher = new FormErrorHandler();
  }

  /**
   * this function is used to return the validity of the phone number.
   */
  static getPhoneNumberUtil() {
    return PhoneNumberUtil.getInstance();
  }

  /**
   * this function is used for creating snack
   * @params message
   * @params title
   * @params type
   */
  createSnack(message, type) {
    this.snackBar.openFromComponent(ToasterComponent, {
      data: {message: message, type: type},
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }

  /**
   * this function is used to enable and disable the loader.
   * @params res
   */

  toggleLoader(res): void {
    this.displayLoader.next(res);
  }

  /**
   * this function is used to hide the debugging messages.
   */

  hideLoggers(): void {
    this.notifier.hideAll();
  }

  /**
   * this function is used for showing the debugging messages for the users.
   * @params type
   * @params message
   */

  appLogger(type: string, message: any): void {
    this.notifier.notify(type, message);
  }

  /**
   * this function is used for showing the debugging messages for the developer.
   * @params type
   * @params message
   */

  appLoggerDev(type: string, message: any): void {
    if (this.constants.config.devMode) {
      this.notifier.notify(type, message);
    }
  }

  /**
   * this function is used for creating the modal dialog.
   * @params component
   * @params params
   */

  createDialog(component, params?: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = params && params.disableClose ? params.disableClose : false;
    dialogConfig.autoFocus = params && params.autoFocus ? params.autoFocus : true;
    dialogConfig.closeOnNavigation = params && params.closeOnNavigation ? params.closeOnNavigation : false;
    dialogConfig.data = params && params.data ? params.data : null;
    this.dialogRef = this.dialog.open(component, dialogConfig);
  }

  /**
   * this function is used for removing the token.
   */

  removeToken() {
    localStorage.removeItem(this.constants.localStorageKeys.entityUserData);
    localStorage.removeItem(this.constants.localStorageKeys.token);
  }

  /**
   * this function is used for logging out the user.
   */

  logoutUser() {
    this.removeToken();
    sessionStorage.clear();
    this.cookies.delete('sessionid');
    this.cookies.deleteAll();
    this.createSnack(this.translated.MESSAGES.LOGOUT_SUCCESS,  this.constants.status.WARNING);
    this.navigateTo([this.appConstants.paths.login]);
  }

  /**
   * this function is used when any of the error occurs in the api response. and then it logs out the user.
   * @params status
   */

  logoutError(status) {
    if (status === 401 || status === 0) {
      this.logoutUser();
    }
  }

  /**
   * this function is a generic function used for making api calls and when we have to call any api
   * we give the api method, api router and if we have to send data we insert that also and call the api.
   * @params method
   * @params api
   * @params data
   */

  requestCall(method, api, data?: any) {
    let response;
    switch (method) {
      case this.constants.apiMethod.post:
        response = this.http.post(api, data).pipe(catchError(this.handleError));
        break;
      case this.constants.apiMethod.get:
        response = this.http.get(api).pipe(catchError(this.handleError));
        break;
      case this.constants.apiMethod.put:
        response = this.http.put(api, data).pipe(catchError(this.handleError));
        break;
      case this.constants.apiMethod.delete:
        response = this.http.delete(api).pipe(catchError(this.handleError));
        break;
      default:
        break;
    }
    return response;
  }

  /**
   * this function is used to handle the error that we get when we call any api.
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
    let msg = error.error.email ? error.error.email[0] : 'Something bad happened, Please try again later.';
    return throwError({error: msg, status: error.status});
  };

  /**
   * It will create a map on required element with specific map configuration
   * @params gmapElement
   * @params mapConfig
   */
  createMap(gmapElement: ElementRef, mapConfig?: any) {
    mapConfig = (mapConfig) ? mapConfig : this.constants.defaultMapConfig;
    return new google.maps.Map(gmapElement.nativeElement, mapConfig);
  }

  /**
   * Set map location according to given address and on mapProp element
   * @params address
   * @params mapProp
   */
  setLocationGeocode(address, mapProp) {
    let geoCoder = new google.maps.Geocoder();
    let self = this;
    let promise = new Promise((resolve, reject) => {
      geoCoder.geocode({'address': address}, function (results, status) {
        if (status.toString() === self.constants.status.OK) {
          mapProp.setCenter(results[0].geometry.location);
          let marker = new google.maps.Marker({
            map: mapProp,
            position: results[0].geometry.location
          });
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
    return promise;
  }

  /**
   *  Return true if a object is empty
   */
  isEmpty(myObj) {
    return Object.keys(myObj).length === 0;
  }

  /**
   * Router navigation through out the code will go through this function
   * @params path
   */
  navigateTo(path: any[]) {
    this.router.navigate(path).then(res => {
    }).catch(err => {
    });
  }

  /**
   * Set map location according to address in organization form
   */
  setAddress(addrObj, gMapElement: ElementRef, formControl) {
    let onSelect: boolean = false;
    this.displayButton = true;
    if (!this.isEmpty(addrObj)) {
      this.address = addrObj.formatted_address;
      onSelect = true;
    } else {
      this.address = formControl.value;
    }
    this.displayButton = onSelect;
    this.setLocationGeocode(this.address, this.createMap(gMapElement)).then(res => {
      this.displayButton = true;
      return formControl.setErrors(null);
    }).catch(err => {
      this.displayButton = false;
      return formControl.setErrors({invalid: true});
    });
  }

  /**
   * this function is used to enable and disable any button according to the condition.
   * @params event
   */
  setFalse(event) {
    if (event.which !== this.constants.appConstant.enterKey) {
      this.displayButton = false;
    }
  }

  /**
   * Getter for app constants through helper services
   */

  get appConstants() {
    return this.constants.appConstant;
  }

  /**
   * this function returns the appIcons from constantService.
   */
  get appIcons() {
    return this.constants.appIcons;
  }

  /**
   * Encrypt through Crypto JS
   * param data
   * param key
   */
  encrypt(data: string, key: string): string {
    return CryptoJS.AES.encrypt(data, key).toString();
  }

  /**
   * this function is used for descrpting the data using crypto JS.
   * @params data
   * @params key
   */

  decrypt(data: string, key: string): string {
    return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
  }

}
