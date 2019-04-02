import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Translation } from 'src/app/models/translate.model';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { ConstantService } from 'src/app/shared/constant/constant.service'
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Injectable({ providedIn: 'root' })
export class CoreService {
    storageKey = ConstantService.localStorageKeys.token;
    logout_success: string;
    logout_msg: string;
    translated: Translation;
    constructor(
        private router: Router,
        public helperService: HelperService,
        private translate: TranslateService,
        private cookies: CookieService
    ) {
        this.translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'STATUS']).subscribe((values) => {
            this.translated = values;
            this.logout_success = values.MESSAGES.LOGOUT_SUCCESS;
            this.logout_msg = values.MESSAGES.LOGOUT_MSG;
        });
    }
    /**
     * this function logs out the user and returns to login page
     */
    logoutUser() {
        this.removeToken();
        sessionStorage.clear();
        this.cookies.delete('sessionid');
        this.cookies.deleteAll();
        this.helperService.creactSnack(this.translated.MESSAGES.LOGOUT_SUCCESS,null);
        this.router.navigate(['/login']);
    }
    /**
     * this function is used to get the token key that the user gets when he logs in.
     */
    getToken() {
        return localStorage.getItem(this.storageKey);
    }
    /**
     * this function is used to set the Token key when the user logs in,
     * @param token #string
     */
    setToken(token: string) {
        localStorage.setItem(this.storageKey, token);
    }
    /**
     * this function removes the token from the localstorage
     */
    removeToken() {
        localStorage.removeItem(ConstantService.localStorageKeys.entityUserData);
        localStorage.removeItem(this.storageKey);
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

    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.message}`);
        }
        // return an observable with a user-facing error message
        return throwError({ error: "Something bad happened; please try again later.", status: error.status })
    };
}
