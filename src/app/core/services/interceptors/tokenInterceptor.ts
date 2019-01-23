import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { CoreService } from '../authorization/core.service';
import { CookieService } from 'ngx-cookie-service';
@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
    constructor(private auth: CoreService,
        private cookieService: CookieService) {
    }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (this.auth.getToken()) {
            req = req.clone({
                setHeaders: {
                    authorization: `Token ${this.auth.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
        }
        return next.handle(req);
    }
}
