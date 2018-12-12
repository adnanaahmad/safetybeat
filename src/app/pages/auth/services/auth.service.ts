import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs'

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
        return this.http.post(`${environment.apiUrl}/anonymous/login/`, data, this.Headers);
    }

    /**
     * api calls to recieve data from db of companyTypes, modules and packages for signup form
     */
    registrationData(): Observable<any> {
        let companyTypes = this.http.get(`${environment.apiUrl}/anonymous/companyTypes/`)
        let modules = this.http.get(`${environment.apiUrl}/anonymous/modules/`)
        let packages = this.http.get(`${environment.apiUrl}/anonymous/packages/`)
        return forkJoin([companyTypes, modules, packages])
    }
    /**
     * api call to register new user 
     * @param data complete data of user with organization details and packages
     */
    registerUser(data: object) {
        return this.http.post(`${environment.apiUrl}/anonymous/registration/`, data)
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
        return this.http.post(`${environment.apiUrl}/anonymous/password/reset/`, data, this.Headers);
    }
}
