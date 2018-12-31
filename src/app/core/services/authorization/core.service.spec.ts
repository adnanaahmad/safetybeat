import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CoreService } from './core.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TranslateService } from '@ngx-translate/core';
describe('CoreService', () => {
    let service: CoreService;
    let http: HttpClient;
    let router: Router;
    let toastProvider: ToastrManager;
    let translate: TranslateService
    const storageKey = 'token'
    const tokenSecret = 'this-is-a-test-secret'
    beforeEach(() => {
        service = new CoreService(router, toastProvider, translate);
    });

    afterEach(() => {
        service = null;
        localStorage.removeItem(storageKey);
    });

    it('shoud be created', () => {
        expect(service).toBeTruthy()
    })

    describe('Authorization Token', () => {
        it('should set the access token', () => {
            localStorage.removeItem(storageKey);
            const beforeSettingToken = localStorage.getItem(storageKey)
            expect(beforeSettingToken).toEqual(null)
            service.setToken(tokenSecret)
            const token = localStorage.getItem(storageKey)
            expect(token).toBeTruthy();
            expect(token).toEqual(tokenSecret);
        })
        it('should get the access token', () => {
            localStorage.setItem(storageKey, tokenSecret);
            const token = service.getToken();
            expect(token).toBeDefined();
            expect(token).toEqual(tokenSecret);
        })
        it('should remove the access token', () => {
            localStorage.setItem(storageKey, tokenSecret);
            const token = localStorage.getItem(storageKey);
            expect(token).toBeTruthy();
            service.removeToken();
            const afterRemoveToken = localStorage.getItem(storageKey);
            expect(afterRemoveToken).toEqual(null);
        })
    })

    describe('isAuthenticated', () => {
        it('should return true from isAuthenticated when there is a token', () => {
            localStorage.setItem(storageKey, tokenSecret);
            const isAuthenticated = service.isAuthenticated()
            expect(isAuthenticated).toBeTruthy()
        })
        it('should return false from isAuthenticated when there is no token', () => {
            localStorage.removeItem(storageKey);
            const token = localStorage.getItem(storageKey)
            expect(token).toEqual(null)
            const isAuthenticated = service.isAuthenticated()
            expect(isAuthenticated).toBeFalsy()
        })
    })
    // add unit test for loginUser(), registrationData(), registerUser() and logoutUser()
});
