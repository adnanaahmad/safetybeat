import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class LoginService {
    selected = true;
    private loggedIn = new BehaviorSubject<boolean>(false);
    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }
    constructor(
        private http: HttpClient,
        private router: Router,
    ) { }

    authenticateUser(data) {
        this.selected = false;
        this.loggedIn.next(true);
        return this.http.post(`${environment.apiUrl}/anonymous/login/`, data);
    }
    logoutUser() {
        this.selected = true;
        localStorage.removeItem('token');
        this.loggedIn.next(false);
        this.router.navigate(['/login']);
    }
    getToken() {
        return localStorage.getItem('token');
    }
    forgotPassword(data) {
        return this.http.post(`${environment.apiUrl}/anonymous/password/reset/`, data);
    }
}
