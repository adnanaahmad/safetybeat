import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
// services
import { AuthService } from './auth.service';
@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

    constructor(private injector: Injector) {
    }
    /**
     * in this interception function we pass the http request and the the httphandler to this fucntion because
     * interceptors will transform the outgoing request before passing it to the next interceptor in the chain,
     *  by calling next.handle(transformedReq).
     * particularly in this function we first check that if the header is notoken then headers will be content-type
     * and application/json and if this is not equal to noToken then the header is changed. noToken comes when the user is
     * not logged in and doesn't have any token but if he has token then this if condition will be true.
     */
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
