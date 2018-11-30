import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class LoginService {


    private loggedIn = new BehaviorSubject<boolean>(false);
    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }
    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    authenticateUser(data) {
        debugger
        this.loggedIn.next(true);
        console.log(this.http.post(`${environment.apiUrl}/anonymous/login/`, data));
        return this.http.post(`${environment.apiUrl}/anonymous/login/`, data);
    }
    logoutUser() {
        localStorage.removeItem('token');
        this.loggedIn.next(false);
        this.router.navigate(['/login']);
    }
    getToken() {
        return localStorage.getItem('token');
    }
}
