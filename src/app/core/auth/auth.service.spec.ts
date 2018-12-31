import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { loginCredentials, LoginResponse, User } from '../../features/user/user.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastService } from 'src/app/shared/toast/toast.service';
describe('AuthService', () => {
    let service: AuthService;
    let http: HttpClient;
    let router: Router;
    let translate: TranslateService;
    let toastProvider: ToastService;
    let httpTestingController: HttpTestingController;
    let mockRouter;
    const storageKey = 'token';
    const tokenSecret = 'this-is-a-test-secret';
    beforeEach(() => {
        mockRouter = { navigate: jasmine.createSpy('navigate') };
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])]
        });
        service = new AuthService(http, router, toastProvider, translate);
        httpTestingController = TestBed.get(HttpTestingController);

    });

    afterEach(() => {
        service = null;
        localStorage.removeItem(storageKey);
    });

    it('shoud be created', () => {
        expect(service).toBeTruthy();
    });

    describe('Authorization Token', () => {
        it('should set the access token', () => {
            localStorage.removeItem(storageKey);
            const beforeSettingToken = localStorage.getItem(storageKey);
            expect(beforeSettingToken).toEqual(null);
            service.setToken(tokenSecret);
            const token = localStorage.getItem(storageKey);
            expect(token).toBeTruthy();
            expect(token).toEqual(tokenSecret);
        });
        it('should get the access token', () => {
            localStorage.setItem(storageKey, tokenSecret);
            const token = service.getToken();
            expect(token).toBeDefined();
            expect(token).toEqual(tokenSecret);
        });
        it('should remove the access token', () => {
            localStorage.setItem(storageKey, tokenSecret);
            const token = localStorage.getItem(storageKey);
            expect(token).toBeTruthy();
            service.removeToken();
            const afterRemoveToken = localStorage.getItem(storageKey);
            expect(afterRemoveToken).toEqual(null);
        });
    });

    describe('isAuthenticated', () => {
        it('should return true from isAuthenticated when there is a token', () => {
            localStorage.setItem(storageKey, tokenSecret);
            const isAuthenticated = service.isAuthenticated();
            expect(isAuthenticated).toBeTruthy();
        });
        it('should return false from isAuthenticated when there is no token', () => {
            localStorage.removeItem(storageKey);
            const token = localStorage.getItem(storageKey);
            expect(token).toEqual(null);
            const isAuthenticated = service.isAuthenticated();
            expect(isAuthenticated).toBeFalsy();
        });
    });
    // add unit test for loginUser(), registrationData(), registerUser() and logoutUser()

    describe('Login', () => {
        it('should make a http request with the login credentials', () => {
            const loginCredentials: loginCredentials = {
                username: 'admin',
                password: 'admin123'
            };

            const expectedResponse: LoginResponse = {
                user: {
                    username: 'admin',
                    email: 'email@test.com',
                    first_name: 'admin',
                    last_name: 'admin',
                    mobile_no: '12345678',
                    password: 'admin123',
                },
                token: 'this is my dummy token'
            };

            service.loginUser(loginCredentials).subscribe((data) => {
                expect(data).toEqual(expectedResponse);
            });

            const req = httpTestingController.expectOne(`${environment.serverUrl}/anonymous/login`);
            expect(req.request.method).toEqual('POST');
            req.flush(expectedResponse);
            httpTestingController.verify();
        });
    });

    describe('Logout', () => {
        it('should remove the access token', () => {
            localStorage.setItem(storageKey, tokenSecret);
            const token = localStorage.getItem(storageKey);
            expect(token).toBeTruthy();
            service.removeToken();
            const afterRemoveToken = localStorage.getItem(storageKey);
            expect(afterRemoveToken).toEqual(null);
        });
        it('navigate to "login" takes you to /login', fakeAsync(() => {
            router.navigate(['/login']);
            tick();
            expect(location.pathname).toBe('/login');
            // expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
        }));
    });
});
