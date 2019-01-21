import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { ConstantService } from '../../../shared/constant/constant.service';
import { TranslateService } from '@ngx-translate/core';
import { loginCredentials, LoginResponse, ForgotPassword, ForgotPasswordResponse } from 'src/app/models/user.model';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Injectable({ providedIn: 'root' })
export class LoginRegistrationService {
    storageKey = 'token';
    selected = true;
    reset_success: string;
    reset_msg: string;
    constructor(private http: HttpClient,
        private translate: TranslateService) {
    }
    /**
     * login user api is called here and api url comes from constant service and login data that comes from
     * login.component.html file is passed here with the apiUrl
     * @param data \
     */
    loginUser(data: loginCredentials): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(ConstantService.apiRoutes.login, data);
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

    checkUserName(username: object) {
        return this.http.post(ConstantService.apiRoutes.checkUsername, username);
    }
    checkEmail(email: object) {
        return this.http.post(ConstantService.apiRoutes.checkEmail, email)
    }
    checkOrgName(OrgName: object) {
        return this.http.post(ConstantService.apiRoutes.checkOrgName, OrgName);
    }
    checkOrgBillingEmail(OrgBillingEmail: object) {
        return this.http.post(ConstantService.apiRoutes.checkBilling, OrgBillingEmail);
    }
    /**
     * in this function all the data that comes in the organization registration form is passed to this function
     * @param data
     * in this function all the data that comes in the organization registration form is passed to this function
     * and then it is sent to the related api to register the user with the organization,module and packages data.
     */
    registerUser(data: object) {
        return this.http.post(ConstantService.apiRoutes.signup, data);
    }
    /**
     *
     * @param data
     * in this function forgot passsowrd api is called in the parameter we have passed the data that comes from the
     * forgotpassword component and in that component the email is written and then we click on the reset button and
     * user gets an email to reset his/her password and that email comes backend api.
     */
    forgotPassword(data: ForgotPassword): Observable<ForgotPasswordResponse> {
        return this.http.post<ForgotPasswordResponse>(ConstantService.apiRoutes.passwordReset, data);
    }

    resendemail(data) {
        return this.http.post(ConstantService.apiRoutes.resendverification, data);
    }

    changeEmail(id, data) {
        return this.http.put(`${ConstantService.apiRoutes.changeEmail}/${id}/`, data)
    }
    /**
     * this function is used to set the Token key when the user logs in,
     * @param token #string
     */
    setToken(token: string) {
        localStorage.setItem(this.storageKey, token);
    }
    /**
    * this function is used to get the token key that the user gets when he logs in.
    */
    getToken() {
        return localStorage.getItem(this.storageKey);
    }
}
