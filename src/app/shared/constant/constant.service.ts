import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {
  constructor(
  ) { }
  // environmentUrl = environment.apiUrl;

  static apiRoutes = {
    login: `${environment.apiUrl}/anonymous/login/`,
    companyTypes: `${environment.apiUrl}/anonymous/companyTypes/`,
    modules: `${environment.apiUrl}/anonymous/modules/`,
    packages: `${environment.apiUrl}/anonymous/packages/`,
    registration: '/ anonymous / registration/',
    passwordReset: '/anonymous/password/reset/'
  };
  // environmentUrl = environment.apiUrl;
}
