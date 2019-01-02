import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
// service
import { CoreService } from '../authorization/core.service';
@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
    constructor(private auth: CoreService) {
    }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (this.auth.getToken()) {
            req = req.clone({
                setHeaders: {
                    authorization: `Token ${this.auth.getToken()}`
                }
            });
        }
        return next.handle(req);
    }
}
