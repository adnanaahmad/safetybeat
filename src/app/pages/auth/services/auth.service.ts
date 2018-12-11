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
    registrationData(): Observable<any> {
        let companyTypes = this.http.get(`${environment.apiUrl}/anonymous/companyTypes/`)
        let modules = this.http.get(`${environment.apiUrl}/anonymous/modules/`)
        let packages = this.http.get(`${environment.apiUrl}/anonymous/packages/`)
        return forkJoin([companyTypes, modules, packages])
    }
    registerUser(data) {
        return this.http.post(`${environment.apiUrl}/anonymous/registration/`, data, this.Headers)
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

    isAuthenticated(): boolean {
        if (this.getToken()) {
            return true;
        }
        return false;
    }
}
