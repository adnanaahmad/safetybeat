import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { ConstantService } from '../../shared/constant/constant.service';
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
    /**
     * login user api is called here and api url comes from constant service and login data that comes from
     * login.component.html file is passed here with the apiUrl
     * @param data \
     */

    loginUser(data) {
        return this.http.post(ConstantService.apiRoutes.login, data);
    }
    /**
     * in this function all the api calls related to organization registration data are called over here
     * and fork join is used when you have a group of observables and only care about the final emitted value of each.
     */
    registrationData(): Observable<any> {
        const companyTypes = this.http.get(ConstantService.apiRoutes.companyTypes);
        const modules = this.http.get(ConstantService.apiRoutes.modules);
        const packages = this.http.get(ConstantService.apiRoutes.packages);
        return forkJoin([companyTypes, modules, packages]);
    }
    /**
     * in this function all the data that comes in the organization registration form is passed to this function
     * @param data
     * in this function all the data that comes in the organization registration form is passed to this function
     * and then it is sent to the related api to register the user with the organization,module and packages data.
     */
    registerUser(data) {
        return this.http.post(ConstantService.apiRoutes.registration, data, this.Headers);
    }
    /**
     * in this function when the user clicks on the logout button it removes the token from the localstorage and makes
     * the user logged out and returns to the login page.
     */
    logoutUser() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
    /**
     * this function is used to get the token key that the user gets when he logs in.
     */
    getToken() {
        return localStorage.getItem('token');
    }
    /**
     *
     * @param data
     * in this function forgot passsowrd api is called in the parameter we have passed the data that comes from the
     * forgotpassword component and in that component the email is written and then we click on the reset button and
     * user gets an email to reset his/her password and that email comes backend api.
     */
    forgotPassword(data) {
        return this.http.post(ConstantService.apiRoutes.passwordReset, data);
    }
    /**
     * this fucntion only tells that if the user has been assigned any token then return true other wise return false
     * this function was using for header to change the login button to logout because we applied *ngIf there that checks
     * that if this function return true thrn logout will be shown on the header otherwise login and register buttons will
     * be shown.
     */
    isAuthenticated(): boolean {
        if (this.getToken()) {
            return true;
        }
        return false;
    }
}
