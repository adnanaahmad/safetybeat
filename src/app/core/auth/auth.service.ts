import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { ConstantService } from '../../shared/constant/constant.service';
@Injectable({ providedIn: 'root' })
export class AuthService {
    selected = true;
    constructor(
        private http: HttpClient,
        private router: Router,
    ) { }

    loginUser(data) {
        this.selected = false;
        return this.http.post(ConstantService.apiRoutes.login, data);
    }

    /**
     * api calls to recieve data from db of companyTypes, modules and packages for signup form
     */
    registrationData(): Observable<any> {
        const companyTypes = this.http.get(ConstantService.apiRoutes.companyTypes);
        const modules = this.http.get(ConstantService.apiRoutes.modules);
        const packages = this.http.get(ConstantService.apiRoutes.packages);
        return forkJoin([companyTypes, modules, packages]);
    }
    /**
     * api call to register new user 
     * @param data complete data of user with organization details and packages
     */
    registerUser(data: object) {
        return this.http.post(ConstantService.apiRoutes.registration, data)
    }
    logoutUser() {
        this.selected = true;
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
    getToken() {
        return localStorage.getItem('token');
    }
    forgotPassword(data) {
        return this.http.post(ConstantService.apiRoutes.passwordReset, data);
    }

    isAuthenticated(): boolean {
        if (this.getToken()) {
            return true;
        }
        return false;
    }
}
