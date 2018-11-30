import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { LoginService } from '../login/login.service';
@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

    constructor(private injector: Injector,
        authService: LoginService) {
    }
    intercept(req, next) {
        const authService = this.injector.get(LoginService);
        const tokenizedReq = req.clone(
            {
                headers: req.headers.set('Authorization', 'bearer ' + authService.getToken())
            }
        );
        return next.handle(tokenizedReq);
    }

}
