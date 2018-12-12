import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
describe('Service:Auth', () => {
    let service: AuthService;
    let http: HttpClient;
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
