import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { LoginService } from '../login/login.service';
@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

    constructor(private injector: Injector) {
    }
    intercept(req, next) {
        const authService = this.injector.get(LoginService);
        const tokenizedReq = req.clone({
            setHeaders: {
                Authorization: `Token ${authService.getToken()}`
            }
        }
        );
        return next.handle(tokenizedReq);
    }

}
