import { TestBed, getTestBed } from '@angular/core/testing';
import { LoginRegistrationService } from './LoginRegistrationService';
import { environment } from 'src/environments/environment';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/app.module';

describe('LoginRegistrationService', () => {
  let injector;
  let httpTestingController: HttpTestingController;
  let loginRegService: LoginRegistrationService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
          }
        })
      ],
      providers: [LoginRegistrationService],
    });
    injector = getTestBed();
    loginRegService = TestBed.get(LoginRegistrationService);
    httpTestingController = injector.get(HttpTestingController);
    http = injector.get(HttpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(loginRegService).toBeTruthy();
  });

  describe('User Regisration', () => {
    it('Should require registration data', () => {
      let companyType: any = [
        {
          'name': 'business',
          'id': 1
        },
        {
          'name': 'Information Technology',
          'id': 2
        }
      ];
      let modules: any = [
        {
          'id': 1,
          'name': 'Safety Beat'
        },
        {
          'id': 2,
          'name': 'Field Communication'
        }
      ];
      let packages: any = [
        {
          'packageName': 'Gold',
          'cost': '$1000',
          'noOfUsers': '500',
          'id': 1
        },
        {
          'packageName': 'Silver',
          'cost': '$500',
          'noOfUsers': '250',
          'id': 2
        },
        {
          'packageName': 'Browns',
          'cost': '$250',
          'noOfUsers': '100',
          'id': 3
        }
      ];
      let regData = [companyType, modules, packages];
      loginRegService.registrationData().subscribe((data) => {
        expect(data).toEqual(regData);
      });
      const reqCompany = httpTestingController.expectOne(`${environment.apiUrl}/anonymous/companyTypes/`);
      const reqModule = httpTestingController.expectOne(`${environment.apiUrl}/anonymous/modules/`);
      const reqPackage = httpTestingController.expectOne(`${environment.apiUrl}/anonymous/packages/`);
      expect(reqCompany.request.method).toBe('GET');
      expect(reqModule.request.method).toBe('GET');
      expect(reqPackage.request.method).toBe('GET');
      reqCompany.flush(companyType);
      reqModule.flush(modules);
      reqPackage.flush(packages);
    });
    it('Should Register user', () => {
      let registrationData = [
        {
          'user': {
            'username': 'asad',
            'email': 'taqi.muttaqeen@gmail.com',
            'first_name': 'ali',
            'last_name': 'raza',
            'mobile_no': '094753452',
            'password': 'Lahore123',
            'password2': 'Lahore123'
          },
          'organization': {
            'name': 'pakwheels',
            'type': 'type.id',
            'address': '126 karachi',
            'zipCode': '54000',
            'city': 'karachi',
            'country': 'pakistan',
            'fax': '043 7441571',
            'billingEmail': 'taqi.muttaqeen@gmail.com',
            'accountNo': '965265823',
            'phoneNo': '03320745617'
          },
          'module_pkg': [
            {
              'name': 'Safety Beat',
              'package': {
                'packageName': 'Silver',
                'cost': '$500',
                'noOfUsers': '250',
                'id': 2
              }
            },
            {
              'name': 'Field Communication',
              'package': {
                'packageName': 'Gold',
                'cost': '$1000',
                'noOfUsers': '500',
                'id': 1
              }
            }
          ]
        }
      ];
      // loginRegService.registerUser(registrationData).subscribe((data) => {
      //   expect(data).toEqual(registrationData);
      // });
      // const req = httpTestingController.expectOne(`${environment.apiUrl}/anonymous/registration/`);
      // expect(req.request.method).toBe('POST');
      // req.flush(registrationData);
    });
  });

  // describe('get Users data', () => {
  //   let user: LoginResponse = {
  //     'token': 'this is my dummy token',
  //     'user': {
  //       'username': 'admin',
  //       'email': 'email@test.com',
  //       'first_name': 'admin',
  //       'last_name': 'admin',
  //       'mobile_no': '12345678',
  //       'password': 'admin123'
  //     }
  //   };
  //   const loginCredentials: loginCredentials = {
  //     username: 'admin',
  //     password: 'admin123'
  //   };
  //   it('should return an observable <LoginResponse[]>', () => {
  //     loginRegService.loginUser(loginCredentials).subscribe((data) => {
  //       expect(data).toEqual(user);
  //     });
  //     const req = httpTestingController.expectOne(`${environment.apiUrl}/anonymous/login/`);
  //     expect(req.request.method).toBe('POST');
  //     req.flush(user);
  //   });
  // });


});
