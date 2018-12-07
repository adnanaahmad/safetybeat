import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { TokenInterceptorService } from '../auth/token-interceptor';
@Injectable({ providedIn: 'root' })
export class OrganizationService {
    constructor(private http: HttpClient, public auth: AuthService) {
    }

    companyType() {
        return this.http.get(`${environment.apiUrl}/anonymous/companyTypes/`);
    }
}
