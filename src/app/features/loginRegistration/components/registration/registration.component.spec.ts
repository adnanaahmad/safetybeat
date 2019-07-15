// import {async, ComponentFixture, TestBed} from '@angular/core/testing';
//
// import {RegistrationComponent} from './registration.component';
// import {RouterTestingModule} from '@angular/router/testing';
// import {HttpClientModule, HttpClient} from '@angular/common/http';
// import {ReactiveFormsModule, FormsModule} from '@angular/forms';
// import {MaterialModule} from 'src/app/shared/material/material.module';
// import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
// import {createTranslateLoader} from 'src/app/app.module';
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import {NotifierModule} from 'angular-notifier';
// import {ParticleContainerComponent} from '../particleContainer/particleContainer.component';
// import {Router} from '@angular/router';
// import {LoginRegistrationService} from 'src/app/features/loginRegistration/services/LoginRegistrationService';
// import {DebugElement, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
// import {Location} from '@angular/common';
// import {PageNotFoundComponent} from 'src/app/core/components/pageNotFound/pageNotFound.component';
//
// describe('RegistrationComponent', () => {
//   let component: RegistrationComponent;
//   let authService: LoginRegistrationService;
//   let debugEl: DebugElement;
//   let nativeEl: HTMLElement;
//   let translate: TranslateService;
//   let fixture: ComponentFixture<RegistrationComponent>;
//   let errors = {};
//   let location: Location;
//   let router: Router;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [RegistrationComponent, PageNotFoundComponent],
//       imports: [
//         NotifierModule,
//         BrowserAnimationsModule,
//         RouterTestingModule,
//         HttpClientModule,
//         ReactiveFormsModule,
//         MaterialModule,
//         TranslateModule.forRoot({
//           loader: {
//             provide: TranslateLoader,
//             useFactory: (createTranslateLoader),
//             deps: [HttpClient]
//           }
//         })
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       providers: []
//     })
//       .compileComponents();
//     authService = TestBed.get(LoginRegistrationService);
//     router = TestBed.get(Router);
//     location = TestBed.get(Location);
//     translate = TestBed.get(TranslateService);
//     router.initialNavigation();
//     fixture = TestBed.createComponent(RegistrationComponent);
//     component = fixture.componentInstance;
//
//     debugEl = fixture.debugElement;
//     nativeEl = fixture.nativeElement;
//     component.ngOnInit();
//   });
//
//   it('should create', () => {
//     fixture = TestBed.createComponent(RegistrationComponent);
//     component = fixture.debugElement.componentInstance;
//     expect(component).toBeTruthy();
//   });
//   describe('check user form validation', () => {
//     it('form invalid when its empty', () => {
//       expect(component.userForm.valid).toBeFalsy();
//     });
//     it('check username validation when its empty', () => {
//       let username = component.userForm.controls['username'];
//       expect(username.valid).toBeFalsy();
//
//       username.setValue('');
//       errors = username.errors || {};
//       expect(errors['required']).toBeTruthy();
//     });
//     it('check username when its valid and will be true and no erros', () => {
//       let username = component.userForm.controls['username'];
//       username.setValue('taqi');
//       errors = username.errors || {};
//       expect(username.valid).toBeTruthy();
//       expect(errors['required']).toBeFalsy();
//     });
//
//
//     it('check firstname validation when its empty', () => {
//       let firstname = component.userForm.controls['first_name'];
//       expect(firstname.valid).toBeFalsy();
//
//       firstname.setValue('');
//       errors = firstname.errors || {};
//       expect(errors['required']).toBeTruthy();
//     });
//     it('check firstname when its valid and will be true and no erros', () => {
//       let firstname = component.userForm.controls['first_name'];
//       firstname.setValue('taqi');
//       errors = firstname.errors || {};
//       expect(firstname.valid).toBeTruthy();
//       expect(errors['required']).toBeFalsy();
//     });
//
//
//     it('check lastname validation when its empty', () => {
//       let lastname = component.userForm.controls['last_name'];
//       expect(lastname.valid).toBeFalsy();
//     });
//     it('check last name validation when its false', () => {
//       let lastname = component.userForm.controls['last_name'];
//       lastname.setValue('');
//       errors = lastname.errors || {};
//       expect(errors['required']).toBeTruthy();
//     });
//     it('check lastname when its valid and will be true and no erros', () => {
//       let lastname = component.userForm.controls['last_name'];
//       lastname.setValue('taqi');
//       errors = lastname.errors || {};
//       expect(lastname.valid).toBeTruthy();
//       expect(errors['required']).toBeFalsy();
//     });
//
//     it('email field validity false', () => {
//       let email = component.userForm.controls['email'];
//       expect(email.valid).toBeFalsy();
//
//       email.setValue('test');
//       errors = email.errors || {};
//       expect(errors['email']).toBeTruthy();
//     });
//     it('email field validity true', () => {
//       let email = component.userForm.controls['email'];
//       errors = email.errors || {};
//       expect(email.valid).toBeFalsy();
//
//       email.setValue('test@test.com');
//       errors = email.errors || {};
//       expect(errors['email']).toBeFalsy();
//     });
//     it('check password validity false or undefined', () => {
//       let password = component.userForm.controls['password'];
//       errors = password.errors || {};
//       expect(errors['required']).toBeTruthy();
//
//       password.setValue('');
//       errors = password.errors || {};
//       expect(errors['password']).toBeUndefined();
//       expect(errors['required']).toBeTruthy();
//
//       password.setValue('admin123');
//       errors = password.errors || {};
//       expect(errors['required']).toBeFalsy();
//       expect(errors['minlength']).toBeFalsy();
//     });
//     it('check confirm password validity false or undefined or true', () => {
//       let password2 = component.userForm.controls['password2'];
//
//       password2.setValue('');
//       errors = password2.errors || {};
//       expect(errors['password']).toBeUndefined();
//       expect(errors['required']).toBeTruthy();
//
//       password2.setValue('admin123');
//       errors = password2.errors || {};
//       expect(errors['required']).toBeFalsy();
//       expect(errors['minlength']).toBeFalsy();
//     });
//   });
//   describe('check organization form validation', () => {
//     it('form invalid when its empty', () => {
//       expect(component.organizationForm.valid).toBeFalsy();
//     });
//
//     it('check name validity', () => {
//       let name = component.organizationForm.controls['name'];
//       name.setValue('');
//       errors = name.errors || {};
//       expect(errors['name']).toBeUndefined();
//       expect(errors['required']).toBeTruthy();
//       name.setValue('admin123');
//       errors = name.errors || {};
//       expect(errors['required']).toBeFalsy();
//     });
//     it('check type validity', () => {
//       let type = component.organizationForm.controls['type'];
//       type.setValue('');
//       errors = type.errors || {};
//       expect(errors['type']).toBeUndefined();
//       expect(errors['required']).toBeTruthy();
//       type.setValue('business');
//       errors = type.errors || {};
//       expect(errors['required']).toBeFalsy();
//     });
//     it('check address validity', () => {
//       let address = component.organizationForm.controls['address'];
//       address.setValue('');
//       errors = address.errors || {};
//       expect(errors['address']).toBeUndefined();
//       expect(errors['required']).toBeTruthy();
//       address.setValue('admin123');
//       errors = address.errors || {};
//       expect(errors['required']).toBeFalsy();
//     });
//     it('check zipCode validity', () => {
//       let zipCode = component.organizationForm.controls['zipCode'];
//       zipCode.setValue('');
//       errors = zipCode.errors || {};
//       expect(errors['zipCode']).toBeUndefined();
//       expect(errors['required']).toBeTruthy();
//       zipCode.setValue('54000');
//       errors = zipCode.errors || {};
//       expect(errors['required']).toBeFalsy();
//     });
//     it('check city validity', () => {
//       let city = component.organizationForm.controls['city'];
//       city.setValue('');
//       errors = city.errors || {};
//       expect(errors['city']).toBeUndefined();
//       expect(errors['required']).toBeTruthy();
//       city.setValue('admin123');
//       errors = city.errors || {};
//       expect(errors['required']).toBeFalsy();
//     });
//     it('check country validity', () => {
//       let country = component.organizationForm.controls['country'];
//       country.setValue('');
//       errors = country.errors || {};
//       expect(errors['country']).toBeUndefined();
//       expect(errors['required']).toBeTruthy();
//       country.setValue('admin123');
//       errors = country.errors || {};
//       expect(errors['required']).toBeFalsy();
//       expect(errors['minlength']).toBeFalsy();
//     });
//     it('check fax validity', () => {
//       let fax = component.organizationForm.controls['fax'];
//       fax.setValue('');
//       errors = fax.errors || {};
//       expect(errors['fax']).toBeUndefined();
//       expect(errors['required']).toBeTruthy();
//       fax.setValue('123445');
//       errors = fax.errors || {};
//       expect(errors['required']).toBeFalsy();
//     });
//     it('check billingEmail validity', () => {
//       let billingEmail = component.organizationForm.controls['billingEmail'];
//       billingEmail.setValue('');
//       errors = billingEmail.errors || {};
//       expect(errors['billingEmail']).toBeUndefined();
//       expect(errors['required']).toBeTruthy();
//
//       billingEmail.setValue('admin123');
//       errors = billingEmail.errors || {};
//       expect(errors['email']).toBeTruthy();
//
//       billingEmail.setValue('test@test.com');
//       errors = billingEmail.errors || {};
//       expect(errors['required']).toBeFalsy();
//       expect(errors['email']).toBeFalsy();
//     });
//     it('check accountNo validity', () => {
//       let accountNo = component.organizationForm.controls['accountNo'];
//       accountNo.setValue('');
//       errors = accountNo.errors || {};
//       expect(errors['accountNo']).toBeUndefined();
//       expect(errors['required']).toBeTruthy();
//       accountNo.setValue('987654321');
//       errors = accountNo.errors || {};
//       expect(errors['required']).toBeFalsy();
//     });
//     it('check phoneNo validity', () => {
//       let phoneNo = component.organizationForm.controls['phoneNo'];
//       phoneNo.setValue('');
//       errors = phoneNo.errors || {};
//       expect(errors['phoneNo']).toBeUndefined();
//       expect(errors['required']).toBeTruthy();
//       phoneNo.setValue('65748390');
//       errors = phoneNo.errors || {};
//       expect(errors['required']).toBeFalsy();
//     });
//   });
//   describe('check module form validation', () => {
//     it('moduleform invalid when its empty', () => {
//       expect(component.moduleForm.valid).toBeFalsy();
//     });
//     it('check phoneNo validity', () => {
//       let name = component.organizationForm.controls['name'];
//       name.setValue('');
//       errors = name.errors || {};
//       expect(errors['name']).toBeUndefined();
//       expect(errors['required']).toBeTruthy();
//       name.setValue('Field Communication');
//       errors = name.errors || {};
//       expect(errors['required']).toBeFalsy();
//     });
//   });
// });
