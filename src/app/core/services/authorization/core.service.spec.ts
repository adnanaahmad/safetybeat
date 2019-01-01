import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CoreService } from './core.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ng6-toastr-notifications';
import { createTranslateLoader } from 'src/app/app.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
describe('CoreService', () => {
    let router: Router;
    const storageKey = 'token';
    const tokenSecret = 'this-is-a-test-secret';
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientModule,
            AppRoutingModule,
            ToastrModule.forRoot(),
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: (createTranslateLoader),
                    deps: [HttpClient]
                }
            })
        ]
    }));

    it('should be created', () => {
        const service = TestBed.get(CoreService);
        expect(service).toBeTruthy();
    });

    describe('Authorization Token', () => {
        const service = TestBed.get(CoreService);
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
        const service = TestBed.get(CoreService);
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
    describe('Logout', () => {
        const service = TestBed.get(CoreService);
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
            // tick();
            expect(location.pathname).toBe('/login');
            // expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
        }));
    });
});
