import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { ConstantService } from '../../../shared/constant/constant.service';
@Injectable({ providedIn: 'root' })
export class AuthService {
    Headers = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'noToken': 'noToken'
        })
    };
    selected = true;
    constructor(
        private http: HttpClient,
        private router: Router,
    ) { }

    loginUser(data) {
        this.selected = false;
        return this.http.post(ConstantService.apiRoutes.login, data, this.Headers);
    }
    registrationData(): Observable<any> {
        const companyTypes = this.http.get(ConstantService.apiRoutes.companyTypes);
        const modules = this.http.get(ConstantService.apiRoutes.modules);
        const packages = this.http.get(ConstantService.apiRoutes.packages);
        return forkJoin([companyTypes, modules, packages]);
    }
    registerUser(data) {
        return this.http.post(ConstantService.apiRoutes.registration, data, this.Headers);
    }
    logoutUser() {
        this.selected = true;
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
    getToken() {
        return localStorage.getItem('token');
    }
    loggedIn() {
        return localStorage.getItem('token');
    }
    forgotPassword(data) {
        return this.http.post(ConstantService.apiRoutes.passwordReset, data, this.Headers);
    }

    isAuthenticated(): boolean {
        if (this.getToken()) {
            return true;
        }
        return false;
    }
}
