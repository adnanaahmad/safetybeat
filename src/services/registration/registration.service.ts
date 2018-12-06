import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginService } from '../login/login.service';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { TokenInterceptorService } from '../auth/token-interceptor';
@Injectable({ providedIn: 'root' })
export class RegistrationService {
    token = this.login.getToken();
    cokie = this.cookie.getAll();
    auth: any;
    constructor(private http: HttpClient, public login: LoginService, public cookie: CookieService, public toke: TokenInterceptorService) {
        console.log('this is my cookie', JSON.stringify(this.cokie));
    }

    registerUser(data) {
        return this.http.post(`${environment.apiUrl}/anonymous/registration/`, data);
    }

    companyType() {
        debugger
        console.log('this is my token', this.token);
        this.auth = { 'Authorization': `Token ${this.token}` };
        return this.http.get(`${environment.apiUrl}/anonymous/otherRegistrationInfo/`);
    }
}
