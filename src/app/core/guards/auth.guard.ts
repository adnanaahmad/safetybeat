import { Injectable } from '@angular/core';
import {
    CanActivate,
    Router,
} from '@angular/router';
// services
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }
    canActivate(): boolean {
        if (this.authService.getToken()) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
