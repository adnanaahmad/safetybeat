import { TestBed, async, inject } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../auth/auth.service';
import { TokenInterceptorService } from './token-interceptor';
import { ConstantService } from '../../shared/constant/constant.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TranslateService } from '@ngx-translate/core';

describe('TokenInterceptorService', () => {
    let service: AuthService;
    const testData = { name: 'Test Data' };
    let http: HttpClient;
    let toast: ToastrManager;
    let translate: TranslateService;
    let httpMock: HttpTestingController;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthService,
                { provide: Router, useValue: router },
                { provide: ToastrManager, useValue: toast },
                {
                    provide: TranslateService, useValue: translate
                },
                ConstantService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useclass: TokenInterceptorService,
                    multi: true
                },
            ]
        });
        service = TestBed.get(AuthService);
        httpMock = TestBed.get(HttpTestingController);
    });

    it('should add a Authorization token to the authorization header', () => {
        const httpRequest = httpMock.expectOne('/test');
        expect(httpRequest.request.headers.get('Token')).toBe(
            `Token ${this.auth.getToken()}`);
    });
});
