import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Observable, forkJoin} from 'rxjs';
import {
  loginCredentials,
  LoginResponse,
  ForgotPassword,
  ForgotPasswordResponse
} from 'src/app/models/user.model';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {resetPassword} from 'src/app/models/profile.model';
import {ConstantService} from 'src/app/shared/constant/constant.service';


@Injectable({providedIn: 'root'})
export class LoginRegistrationService {
  storageKey: string;
  selected = true;
  reset_success: string;
  reset_msg: string;
  private userData = new BehaviorSubject<any>(1);
  profileData = this.userData.asObservable();
  apiRoutes: any;
  method: { get: string; post: string; put: string; delete: string; };
  public ForgotPassword$: Observable<ForgotPasswordResponse>
  public Login$: Observable<LoginResponse>

  constructor(public helperService: HelperService) {
    this.apiRoutes = this.helperService.constants.apiRoutes;
    this.storageKey = this.helperService.constants.localStorageKeys.token;
    this.method = this.helperService.constants.apiMethod
  }

  /**
   * login user api is called here and api url comes from constant service and login data that comes from
   * login.component.html file is passed here with the apiUrl
   * @param data \
   */

  loginUser(data: loginCredentials): Observable<LoginResponse> {

    this.Login$ = this.helperService.requestCall(this.method.post, this.apiRoutes.login, data);
    return this.Login$;
  }

  /**
   * in this function all the api calls related to organization registration data are called over here
   * and fork join is used when you have a group of observables and only care about the final emitted value of each.
   */
  registrationData(): Observable<any> {
    const companyTypes = this.helperService.requestCall(this.method.get, this.apiRoutes.companyTypes);
    const modules = 'Safetybeat';
    const packages = this.helperService.requestCall(this.method.get, this.apiRoutes.packages);
    return forkJoin([companyTypes, modules, packages]);
  }

  checkUserName(username: object) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.checkUsername, username);
  }

  checkEmail(email: object) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.checkEmail, email);
  }

  checkOrgName(OrgName: object) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.checkOrgName, OrgName);
  }

  checkOrgBillingEmail(OrgBillingEmail: object) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.checkBilling, OrgBillingEmail);
  }

  /**
   * in this function all the data that comes in the organization registration form is passed to this function
   * @param data
   * in this function all the data that comes in the organization registration form is passed to this function
   * and then it is sent to the related api to register the user with the organization,module and packages data.
   */
  registerUser(data: any) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.signup, data);
  }

  /**
   *
   * @param data
   * in this function forgot passsowrd api is called in the parameter we have passed the data that comes from the
   * forgotpassword component and in that component the email is written and then we click on the reset button and
   * user gets an email to reset his/her password and that email comes backend api.
   */
  forgotPassword(data: ForgotPassword): Observable<ForgotPasswordResponse> {
    this.ForgotPassword$ = this.helperService.requestCall(this.method.post, this.apiRoutes.passwordReset, data);
    return this.ForgotPassword$;
  }

  resetPassword(data: resetPassword) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.forgotPassword, data);
  }

  resendemail(data) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.resendverification, data);
  }

  changeEmail(data) {
    return this.helperService.requestCall(this.method.put, this.apiRoutes.changeEmail, data);
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

  updateProfileData(data: any) {
    this.userData.next(data);
  }

  validateUser(data: any) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.validateUser, data);
  }

  verifyCode(data: any) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.verifyCode, data);
  }
}
