import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {
  constructor(
  ) { }

  static apiRoutes = {
    login: `${environment.apiUrl}/login/`,
    signup: `${environment.apiUrl}/registration/`,
    companyTypes: `${environment.apiUrl}/companyTypes/`,
    modules: `${environment.apiUrl}/modules/`,
    packages: `${environment.apiUrl}/packages/`,
    passwordReset: `${environment.apiUrl}/password/reset/`,
    organization: `${environment.apiUrl}/organization/`,
    user: `${environment.apiUrl}/userDetails`,
    checkUsername: `${environment.apiUrl}/username/`,
    checkEmail: `${environment.apiUrl}/email/`,
    checkOrgName: `${environment.apiUrl}/orgName/`,
    checkBilling: `${environment.apiUrl}/billingEmail/`,
    resendverification: `${environment.apiUrl}/account/resend-verification/`,
    changeEmail: `${environment.apiUrl}/editEmail`,
    editProfile: `${environment.apiUrl}/editProfile`,
    changePassword: `${environment.apiUrl}/password/change/`
  };
  static toast = {
    location: 'toast-top-left',
    time: 1500,
    time1: 3000,
  };
  static config = {
    devMode: true,
    theme: {
      dark: 'dark-theme',
      light: 'light-theme',
      background: 'body-bg'
    }
  };
}
