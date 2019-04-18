import {Injectable, ElementRef} from '@angular/core';
import {
  forEach,
  findIndex
} from 'lodash';
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
      'STATUS', 'TABLEHEADINGS']).subscribe((values) => {
      this.translated = values;
    });
    this.constants = ConstantService;
    this.iterations = forEach;
    this.findIndex = findIndex;
    this.address = '';
    this.displayButton = false;
    this.formErrorMatcher = new FormErrorHandler();
  }

  static getPhoneNumberUtil() {
    return PhoneNumberUtil.getInstance();
  }

  createSnack(message, title, type) {
    this.snackBar.openFromComponent(ToasterComponent, {
      data: {message: message, title: title, type: type},
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }

  toggleLoader(res): void {
    this.displayLoader.next(res);
  }

  hideLoggers(): void {
    this.notifier.hideAll();
  }

  appLogger(type: string, message: any): void {
    this.notifier.notify(type, message);
  }

  appLoggerDev(type: string, message: any): void {
    if (this.constants.config.devMode) {
      this.notifier.notify(type, message);
    }
  }

  createDialog(component, params?: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = params && params.disableClose ? params.disableClose : false;
    dialogConfig.autoFocus = params && params.autoFocus ? params.autoFocus : true;
    dialogConfig.closeOnNavigation = params && params.closeOnNavigation ? params.closeOnNavigation : false;
    dialogConfig.data = params && params.data ? params.data : null;
    this.dialogRef = this.dialog.open(component, dialogConfig);
  }

  removeToken() {
    localStorage.removeItem(this.constants.localStorageKeys.entityUserData);
    localStorage.removeItem(this.constants.localStorageKeys.token);
  }

  logoutUser() {
    this.removeToken();
    sessionStorage.clear();
    this.cookies.delete('sessionid');
    this.cookies.deleteAll();
    this.createSnack(this.translated.MESSAGES.LOGOUT_SUCCESS, this.translated.MESSAGES.LOGOUT_MSG, this.constants.status.WARNING);
    this.navigateTo([this.appConstants.paths.login]);
  }

  logoutError(status) {
    if (status === 401 || status === 0) {
      this.logoutUser();
    }
  }

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

  requestCallWithHeaders(method, api, headers: any, data?: any) {
    let response;
    switch (method) {
      case this.constants.apiMethod.post:
        response = this.http.post(api, data, {headers: headers}).pipe(catchError(this.handleError));
        break;
      case this.constants.apiMethod.get:
        response = this.http.get(api, {headers: headers}).pipe(catchError(this.handleError));
        break;
      case this.constants.apiMethod.put:
        response = this.http.put(api, data, {headers: headers}).pipe(catchError(this.handleError));
        break;
      case this.constants.apiMethod.delete:
        response = this.http.delete(api, {headers: headers}).pipe(catchError(this.handleError));
        break;
      default:
        break;
    }
    return response;
  }

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
          let markqer = new google.maps.Marker({
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

  setFalse(event) {
    if (event.which !== this.constants.appConstant.enterKey) {
      this.displayButton = false;
    }
  }

  /**
   * Getter for app constants through helper service
   */

  get appConstants() {
    return this.constants.appConstant;
  }

  get appIcons() {
    return this.constants.appIcons;
  }

}
