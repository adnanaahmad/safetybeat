import { AuthGuard } from './auth.guard';
import { TestBed, async, inject } from '@angular/core/testing';
import { CoreService } from 'src/app/services/core/authorization/core.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ConstantService } from 'src/app/services/common/constant/constant.service'

describe('AuthGuard', () => {
    const storageKey = ConstantService.localStorageKeys.token;
    const tokenSecret = 'this-is-a-test-secret';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthGuard
            ],
            imports: [RouterTestingModule]
        });
    });
    afterEach(() => {
        localStorage.removeItem(storageKey);
    });
    it('shoud be created', () => {
        async(inject([AuthGuard, Router, CoreService], (authGuard, router, authServiceSpy) => {
            spyOn(router, 'navigate');
            spyOn(authGuard, 'canActivate');
            spyOn(authServiceSpy, 'getToken');
            expect(authGuard).toBeTruthy();
        }));
    });
    describe('canActivate', () => {
        it('should return true from isAuthenticated when there is a token', () => {
            async(inject([AuthGuard, Router, CoreService], (authGuard, router, authServiceSpy) => {
                spyOn(router, 'navigate');
                spyOn(authGuard, 'canActivate');
                spyOn(authServiceSpy, 'getToken');
                localStorage.setItem(storageKey, tokenSecret);
                const canActivateReturn = authGuard.canActivate();
                const token = authServiceSpy.getToken();
                expect(authServiceSpy.getToken()).toBeDefined();
                expect(token).toBeDefined();
                expect(canActivateReturn).toBeTruthy();
            }));

        });
        it('should return false from isAuthenticated when there is no token', () => {
            async(inject([AuthGuard, Router, CoreService], (authGuard, router, authServiceSpy) => {
                spyOn(router, 'navigate');
                spyOn(authGuard, 'canActivate');
                spyOn(authServiceSpy, 'getToken');
                localStorage.removeItem(storageKey);
                const token = localStorage.getItem(storageKey);
                expect(token).toEqual(null);
                const canActivateReturn = authGuard.canActivate();
                const getToken = authServiceSpy.getToken();
                expect(authServiceSpy.getToken()).toBeDefined();
                expect(router.navigate).toHaveBeenCalledWith(['/login']);
                expect(getToken).toBeUndefined();
                expect(canActivateReturn).toBeFalsy();
            }));

        });
    });

});
