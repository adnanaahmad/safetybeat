import {TestBed, async, inject, getTestBed} from '@angular/core/testing';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpTestingController, HttpClientTestingModule} from '@angular/common/http/testing';
import {CoreService} from 'src/app/services/core/authorization/core.service';
import {TokenInterceptorService} from './tokenInterceptor';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {AppRoutingModule} from 'src/app/app-routing.module';
import {createTranslateLoader} from 'src/app/app.module';
import {ProfileService} from 'src/app/features/profile/services/profile.service';
import {environment} from 'src/environments/environment';
import {RouterModule, Router} from '@angular/router';
import {ConstantService} from 'src/app/services/common/constant/constant.service';
import {Platform} from '@angular/cdk/platform';
import {APP_BASE_HREF} from '@angular/common';

describe('TokenInterceptorService', () => {
  let injector;
  let httpTestingController: HttpTestingController;
  let tokenService: TokenInterceptorService;
  let coreService: CoreService;
  let http: HttpClient;
  let platform: Platform;
  let coreSpy = jasmine.createSpyObj('coreService', ['getToken']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        RouterModule.forRoot([{path: '', component: TokenInterceptorService}]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        ProfileService,
        {provide: APP_BASE_HREF, useValue: '/'}
        // TokenInterceptorService,
        // {
        //     provide: HTTP_INTERCEPTORS,
        //     useClass: TokenInterceptorService,
        //     multi: true,
        // }
      ],
    });
    injector = getTestBed();
    coreService = injector.get(CoreService);
    platform = TestBed.get(Platform);
    httpTestingController = injector.get(HttpTestingController);
    http = injector.get(HttpClient);
    coreSpy = TestBed.get(CoreService);
  });

  it('should add a Authorization token to the authorization header', () => {
    coreService.setToken('this is my dummy token');
    const token = coreService.getToken();
    const spy = coreSpy.getToken();
    const someData = {data: 'someData '};
    http.get('localhost:3000/anonymous/user').subscribe((data) => {
      expect(data).toEqual(someData);
    });
    const httpReq = httpTestingController.expectOne('localhost:3000/anonymous/user');
    expect(httpReq.request.method).toBe('GET');
    expect(httpReq.request.headers.get('authorization')).toBeTruthy();
    expect(httpReq.request.headers.get('authorization')).toBe(`Token ${token}`);
    httpReq.flush(someData);
    httpTestingController.verify();
  });
});
