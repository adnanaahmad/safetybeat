import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {
  constructor(
  ) { }

  static apiRoutes = {
    login: `${environment.apiUrl}/anonymous/login/`,
    signup: `${environment.apiUrl}/anonymous/signup/`,
    companyTypes: `${environment.apiUrl}/anonymous/companyTypes/`,
    modules: `${environment.apiUrl}/anonymous/modules/`,
    packages: `${environment.apiUrl}/anonymous/packages/`,
    passwordReset: `${environment.apiUrl}/anonymous/password/reset/`,
    organization: `${environment.apiUrl}/anonymous/organization/`,
    user: `${environment.apiUrl}/anonymous/userDetails`,
    checkUsername: `${environment.apiUrl}/anonymous/username/`,
    checkEmail: `${environment.apiUrl}/anonymous/email/`,
    checkOrgName: `${environment.apiUrl}/anonymous/orgName/`,
    checkBilling: `${environment.apiUrl}/anonymous/billingEmail/`,
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
