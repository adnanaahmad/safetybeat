import { TestBed } from '@angular/core/testing';
import { LoginRegistrationService } from './LoginRegistrationService';
import { loginCredentials, LoginResponse } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/app.module';
import { ToastrModule } from 'ng6-toastr-notifications';

describe('LoginRegistrationService', () => {
  // let service: LoginRegistrationService;

  let httpTestingController: HttpTestingController;
  const tokenSecret = 'this-is-a-test-secret';
  const storageKey = 'token';

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
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
    const service = TestBed.get(LoginRegistrationService);
    expect(service).toBeTruthy();
  });

  describe('Login', () => {
    it('should make a http request with the login credentials', () => {
      const service = TestBed.get(LoginRegistrationService);
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

      // const req = httpTestingController.expectOne(`${environment.serverUrl}/anonymous/login`);
      // expect(req.request.method).toEqual('POST');
      // req.flush(expectedResponse);
      // httpTestingController.verify();
    });
  });
});
