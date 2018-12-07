import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
// services
import { AuthService } from './auth.service';
@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

    constructor(private injector: Injector) {
    }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authService = this.injector.get(AuthService);
        let headers = req.headers.set('Content-Type', 'application/json');
        if (headers.get('notoken') !== 'noToken') {
            req = req.clone({
                setHeaders: {
                    authorization: `Token ${authService.getToken()}`
                }
            });
        } else {
            headers = headers.delete('Authorization').delete('noToken');
            req = req.clone({
                headers
            });
        }
        return next.handle(req);
    }

}
