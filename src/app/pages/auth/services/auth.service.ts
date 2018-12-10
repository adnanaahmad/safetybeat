import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

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
        debugger;
        this.selected = false;
        return this.http.post(`${environment.apiUrl}/anonymous/login/`, data, this.Headers);
    }
    registerUser(data) {

        return this.http.post(`${environment.apiUrl}/anonymous/registration/`, data, this.Headers);
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
        return !!localStorage.getItem('token');
    }
    forgotPassword(data) {
        return this.http.post(`${environment.apiUrl}/anonymous/password/reset/`, data, this.Headers);
    }
}
