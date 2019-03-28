import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {  BehaviorSubject } from 'rxjs';
import { Observable, forkJoin, throwError } from 'rxjs';
import {
  loginCredentials,
  LoginResponse,
  ForgotPassword,
  ForgotPasswordResponse,
  User,
  validateUser
} from 'src/app/models/user.model';
import { catchError } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/authorization/core.service';
import { HelperService } from 'src/app/shared/helperService/helper.service';


@Injectable({ providedIn: "root" })
export class LoginRegistrationService {
  storageKey: string;
  selected = true;
  reset_success: string;
  reset_msg: string;
  private userData = new BehaviorSubject<any>(1);
  profileData = this.userData.asObservable();
  apiRoutes: any;
  constructor(
    private http: HttpClient,
    public coreServices: CoreService,
    public helperService: HelperService) {
    this.apiRoutes = this.helperService.constants.apiRoutes;
    this.storageKey = this.helperService.constants.localStorageKeys.token;
  }
  /**
   * login user api is called here and api url comes from constant service and login data that comes from
   * login.component.html file is passed here with the apiUrl
   * @param data \
   */

  loginUser(data: loginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiRoutes.login, data).pipe(catchError(this.coreServices.handleError));
  }
  /**
   * in this function all the api calls related to organization registration data are called over here
   * and fork join is used when you have a group of observables and only care about the final emitted value of each.
   */
  registrationData(): Observable<any> {
    const companyTypes = this.http.get(this.apiRoutes.companyTypes).pipe(catchError(this.coreServices.handleError));
    const modules = "Safetybeat";
    const packages = this.http.get(this.apiRoutes.packages).pipe(catchError(this.coreServices.handleError));
    return forkJoin([companyTypes, modules, packages]);
  }

  checkUserName(username: object) {
    return this.http.post(this.apiRoutes.checkUsername, username).pipe(catchError(this.coreServices.handleError));
  }
  checkEmail(email: object) {
    return this.http.post(this.apiRoutes.checkEmail, email).pipe(catchError(this.coreServices.handleError));
  }
  checkOrgName(OrgName: object) {
    return this.http.post(this.apiRoutes.checkOrgName, OrgName).pipe(catchError(this.coreServices.handleError));
  }
  checkOrgBillingEmail(OrgBillingEmail: object) {
    return this.http.post(
      this.apiRoutes.checkBilling,
      OrgBillingEmail
    ).pipe(catchError(this.coreServices.handleError));
  }
  /**
   * in this function all the data that comes in the organization registration form is passed to this function
   * @param data
   * in this function all the data that comes in the organization registration form is passed to this function
   * and then it is sent to the related api to register the user with the organization,module and packages data.
   */
  registerUser(data: any) {
    return this.http.post(this.apiRoutes.signup, data).pipe(catchError(this.coreServices.handleError));
  }
  /**
   *
   * @param data
   * in this function forgot passsowrd api is called in the parameter we have passed the data that comes from the
   * forgotpassword component and in that component the email is written and then we click on the reset button and
   * user gets an email to reset his/her password and that email comes backend api.
   */
  forgotPassword(data: ForgotPassword): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(
      this.apiRoutes.passwordReset,
      data
    ).pipe(catchError(this.coreServices.handleError));
  }

  resendemail(data) {
    return this.http.post(this.apiRoutes.resendverification, data).pipe(catchError(this.coreServices.handleError));
  }

  changeEmail(data) {
    return this.http.put(this.apiRoutes.changeEmail, data).pipe(catchError(this.coreServices.handleError));
  }
  /**
   * this function is used to set the Token key when the user logs in,
   * @param token #string
   */
  setToken(token: string) {
    localStorage.setItem(this.storageKey, token);
  }
  setEntityData(data) {
    localStorage.setItem(this.helperService.constants.localStorageKeys.entityUserData, data);
  }
  /**
   * this function is used to get the token key that the user gets when he logs in.
   */
  getToken() {
    return localStorage.getItem(this.storageKey);
  }

  updateProfileData(data:any){
    this.userData.next(data);
  }

  validateUser(data:any){
    return this.http.post(this.apiRoutes.validateUser,data).pipe(catchError(this.coreServices.handleError));
  }

  verifyCode(data:any){
    return this.http.post(this.apiRoutes.verifyCode,data).pipe(catchError(this.coreServices.handleError));
  }
}
