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
        public toastProvider: ToastService,
        private translate: TranslateService) {
        this.translate.get(['AUTH', 'BUTTONS', 'MESSAGES']).subscribe((values) => {
            this.reset_success = values.MESSAGES.RESET_SUCCESS;
            this.reset_msg = values.MESSAGES.RESETMSG;
        });
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
    /**
     * in this function all the data that comes in the organization registration form is passed to this function
     * @param data
     * in this function all the data that comes in the organization registration form is passed to this function
     * and then it is sent to the related api to register the user with the organization,module and packages data.
     */
    registerUser(data: object) {
        return this.http.post(ConstantService.apiRoutes.registration, data);
    }
    /**
     *
     * @param data
     * in this function forgot passsowrd api is called in the parameter we have passed the data that comes from the
     * forgotpassword component and in that component the email is written and then we click on the reset button and
     * user gets an email to reset his/her password and that email comes backend api.
     */
    forgotPassword(data: ForgotPassword): Observable<ForgotPasswordResponse> {
        this.toastProvider.createCustomToaster(this.reset_success, this.reset_msg);
        return this.http.post<ForgotPasswordResponse>(ConstantService.apiRoutes.passwordReset, data);
    }
    /**
     * this function is used to set the Token key when the user logs in,
     * @param token #string
     */
    setToken(token: string) {
        localStorage.setItem(this.storageKey, token);
    }
}