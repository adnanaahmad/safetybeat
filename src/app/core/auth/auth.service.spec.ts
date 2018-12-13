import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
describe('Service:Auth', () => {
    let service: AuthService;
    // tslint:disable-next-line:prefer-const
    let http: HttpClient;
    // tslint:disable-next-line:prefer-const
    let router: Router;
    beforeEach(() => {
        service = new AuthService(http, router);
    });

    afterEach(() => {
        service = null;
        localStorage.removeItem('token');
    });

    it('should return true from isAuthenticated when there is a token', () => {
        localStorage.getItem('token');
        expect(service.isAuthenticated()).toBeTruthy();
    });

    it('should return false from isAuthenticated when there is no token', () => {
        expect(service.isAuthenticated()).toBeFalsy();
    });
});
