import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Observable} from 'rxjs';
import {loginCredentials, LoginResponse, ForgotPassword, ForgotPasswordResponse} from 'src/app/models/user.model';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {resetPassword} from 'src/app/models/profile.model';
import {OrganizationType, RegistrationResponseObject, RegUserData} from 'src/app/models/loginRegistration/registration.model';


@Injectable({providedIn: 'root'})
export class LoginRegistrationService {
  storageKey: string;
  public userData = new BehaviorSubject<any>(1);
  profileData = this.userData.asObservable();
  apiRoutes: any;
  method: { get: string; post: string; put: string; delete: string; };
  public ForgotPassword$: Observable<ForgotPasswordResponse>;
  public Login$: Observable<LoginResponse>;

  constructor(public helperService: HelperService) {
    this.apiRoutes = this.helperService.constants.apiRoutes;
    this.storageKey = this.helperService.constants.localStorageKeys.token;
    this.method = this.helperService.constants.apiMethod;
  }

  /**
   * login user api is called here and api url comes from constant services and login data that comes from
   * login.component.html file is passed here with the apiUrl
   * @param data \
   */

  loginUser(data: loginCredentials): Observable<LoginResponse> {

    this.Login$ = this.helperService.requestCall(this.method.post, this.apiRoutes.login, data);
    return this.Login$;
  }

  updateAmount(data) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.charge, data);
  }

  getPackagesData() {
    return this.helperService.requestCall(this.method.get, this.apiRoutes.packages);
  }

  /**
   * in this function all the api calls related to organization registration data are called over here
   * and fork join is used when you have a group of observables and only care about the final emitted value of each.
   */
  registrationData(): Observable<Array<OrganizationType>> {
    return this.helperService.requestCall(this.method.get, this.apiRoutes.companyTypes);
  }

  /**
   * this function is used for checking the username whether it already exits or not but this api is no more usable due
   * to change in the scenario.
   * @params username
   */
  checkUserName(username: object) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.checkUsername, username);
  }

  /**
   * this function is used for checking the validity of email whether the email is already registered or not. if the email
   * is not registered then user would not be able to sign up with the same email. For checking the validity of email, this api is
   * called.
   * @params email
   */
  checkEmail(email: object) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.checkEmail, email);
  }

  /**
   * this function is used for checking the validity of organization name whether the entered name of organization
   * already exists or not. this api is used for that.
   * @params OrgName
   */

  checkOrgName(OrgName: object) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.checkOrgName, OrgName);
  }

  /**
   * this function is used for checking the validity of billing email whether it exits already or not. but no need of
   * this now.
   * @params OrgBillingEmail
   */

  checkOrgBillingEmail(OrgBillingEmail: object) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.checkBilling, OrgBillingEmail);
  }

  /**
   * in this function all the data that comes in the organization registration form is passed to this function
   * @param data
   * in this function all the data that comes in the organization registration form is passed to this function
   * and then it is sent to the related api to register the user with the organization,module and packages data.
   */
  registerUser(data: RegUserData): Observable<RegistrationResponseObject> {
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
    return this.helperService.requestCall(this.method.post, this.apiRoutes.passwordReset, data);
  }

  /**
   * this function is used for resetting the password of the user.
   * @params data
   */

  resetPassword(data: resetPassword): Observable<ForgotPasswordResponse> {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.forgotPassword, data);
  }

  /**
   * this function is used for sending the email again if the user didn't get the email for the first time
   * @params data
   */

  resendemail(data) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.resendverification, data);
  }

  /**
   * this api function is used for changing the email of the user if he/she has enetered the incorrect email
   * for the first time.
   * @params data
   */

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

  /**
   * this function is used to get the token key that the user gets when he logs in.
   */
  getToken() {
    return localStorage.getItem(this.storageKey);
  }

  /**
   * this function is used for updating the profile data whenever the getting userData api is called.
   * @params data
   */

  updateProfileData(data: any) {
    this.userData.next(data);
  }

  /**
   * this function is used for checking the validity of the user whether the user is registered or valid or not.
   * @params data
   */

  validateUser(data: any) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.validateUser, data);
  }

  /**
   * this function is used for verifying the code that user gets after validating his/her email.
   * @params data
   */

  verifyCode(data: any) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.verifyCode, data);
  }

  updatePackage(data: any) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.updatePackage, data);
  }

  updateProfile(id: number, data: any) {
    return this.helperService.requestCall(this.method.post, `${this.helperService.constants.apiRoutes.updateProfile}${id}/`, data);
  }
}
