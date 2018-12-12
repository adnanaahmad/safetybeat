import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
// services
import { AuthService } from './auth.service';

@Injectable()
/**
 * injectable is used to get the services og thr authservice because without this we can not get the functionalities of any
 * other service
 */
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }
    /**
     * this is the bool type function that will return true if the user has any token otherwise it will return false and will
     * navigate to the login page. this function is used when we have to apply the condition that the particular page will be
     * shown when this function return true for example the dashboard page will be shown when the user is logged in.
     */
    canActivate(): boolean {
        if (this.authService.getToken()) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
