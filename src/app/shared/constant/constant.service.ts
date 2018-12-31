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
    companyTypes: `${environment.apiUrl}/anonymous/companyTypes/`,
    modules: `${environment.apiUrl}/anonymous/modules/`,
    packages: `${environment.apiUrl}/anonymous/packages/`,
    registration: `${environment.apiUrl}/anonymous/registration/`,
    passwordReset: `${environment.apiUrl}/anonymous/password/reset/`,
    organization: `${environment.apiUrl}/anonymous/organization/`,
    user: `${environment.apiUrl}/anonymous/user`
  };
  static toast = {
    location: 'toast-top-left',
    time: 1500,
    time1: 3000,
  };
}
