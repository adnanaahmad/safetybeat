import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class CoreService {
    storageKey = 'token';
    logout_success: string;
    logout_msg: string;
    constructor(
        private router: Router,
        public toastProvider: ToastrManager,
        private translate: TranslateService
    ) {
        this.translate.get(['AUTH', 'BUTTONS', 'MESSAGES']).subscribe((values) => {
            this.logout_success = values.MESSAGES.LOGOUT_SUCCESS;
            this.logout_msg = values.MESSAGES.LOGOUT_MSG;
        });
    }
    /**
     * this function logs out the user and returns to login page
     */
    logoutUser() {
        this.removeToken();
        this.toastProvider.warningToastr(this.logout_success, this.logout_msg,
            [{ position: 'toast-top-left' }, { toastLife: 1000 }]);
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
}
