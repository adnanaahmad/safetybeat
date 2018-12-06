import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const currentUser = JSON.parse(localStorage.getItem('token'));
        if (currentUser) {
            request = request.clone({
                setHeaders: {
                    'content-type': 'application/json',
                    'Authorization': `Token ${currentUser}`
                }
            });
        }
        console.log(request);
        return next.handle(request);
    }
}
