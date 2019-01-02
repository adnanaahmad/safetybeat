import { TestBed, async, inject } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreService } from 'src/app/core/services/authorization/core.service';
import { TokenInterceptorService } from './token-interceptor';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { Router } from '@angular/router';
import { ToastrManager, ToastrModule } from 'ng6-toastr-notifications';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { createTranslateLoader } from 'src/app/app.module';

describe('TokenInterceptorService', () => {
    const testData = { name: 'Test Data' };
    let toast: ToastrManager;
    let translate: TranslateService;
    let httpMock: HttpTestingController;
    let router: Router;
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

    it('should add a Authorization token to the authorization header', () => {
        const service = TestBed.get(CoreService);
        const httpRequest = httpMock.expectOne('/test');
        expect(httpRequest.request.headers.get('Token')).toBe(
            `Token ${this.service.getToken()}`);
    });
});
