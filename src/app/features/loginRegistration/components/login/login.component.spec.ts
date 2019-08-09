// import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { LoginComponent } from './login.component';
// import { RouterTestingModule } from '@angular/router/testing';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { ReactiveFormsModule } from '@angular/forms';
// import { MaterialModule } from 'src/app/shared/material/material.module';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { createTranslateLoader } from 'src/app/app.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { LoginRegistrationService } from 'src/app/features/loginRegistration/services/LoginRegistrationService';
// import { DebugElement } from '@angular/core';
// import { NotifierModule } from 'angular-notifier';
// import { ParticleContainerComponent } from '../particleContainer/particleContainer.component';
// import { By } from '@angular/platform-browser';
// import { Router } from '@angular/router';
// import { Location } from '@angular/common';
// import { PageNotFoundComponent } from 'src/app/core/components/pageNotFound/pageNotFound.component';
//
// describe('LoginComponent', () => {
//   let component: LoginComponent;
//   let authService: LoginRegistrationService;
//   let debugEl: DebugElement;
//   let nativeEl: HTMLElement;
//   let fixture: ComponentFixture<LoginComponent>;
//   let errors = {};
//   let location: Location;
//   let router: Router;
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [LoginComponent, ParticleContainerComponent, PageNotFoundComponent],
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
//       schemas: [CUSTOM_ELEMENTS_SCHEMA]
//     })
//       .compileComponents();
//     authService = TestBed.get(LoginRegistrationService);
//     router = TestBed.get(Router);
//     location = TestBed.get(Location);
//     router.initialNavigation();
//     fixture = TestBed.createComponent(LoginComponent);
//     component = fixture.componentInstance;
//     debugEl = fixture.debugElement;
//     nativeEl = fixture.nativeElement;
//     component.ngOnInit();
//   });
//
//   // beforeEach(() => {
//   // });
//
//   it('should create', () => {
//     const fixture = TestBed.createComponent(LoginComponent);
//     const component = fixture.debugElement.componentInstance;
//     expect(component).toBeTruthy();
//   });
//   describe('check form validation', () => {
//     it('form invalid when its empty', () => {
//       expect(component.loginForm.valid).toBeFalsy();
//     });
//     it('email field validity false', () => {
//       let email = component.loginForm.controls['email'];
//       expect(email.valid).toBeTruthy();
//
//       email.setValue('test');
//       errors = email.errors || {};
//       expect(errors['email']).toBeTruthy();
//     });
//     it('email field validity true', () => {
//       let email = component.loginForm.controls['email'];
//       errors = email.errors || {};
//       expect(email.valid).toBeTruthy();
//
//       email.setValue('test@test.com');
//       errors = email.errors || {};
//       expect(errors['email']).toBeFalsy();
//     });
//     it('check password validity false or undefined', () => {
//       let password = component.loginForm.controls['password'];
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
//       expect(errors['password']).toBeUndefined();
//
//     });
//   });
//   describe('user should login', () => {
//     it('login form must be intialized', () => {
//       let loginElement: DebugElement;
//       authService = debugEl.injector.get(LoginRegistrationService);
//       let form = {
//         value: {
//           username: 'admin',
//           password: 'admin123'
//         },
//         valid: true
//       };
//       expect(component.loginForm.valid).toBeFalsy();
//       component.loginForm.controls['username'].setValue('test');
//       component.loginForm.controls['password'].setValue('test1234');
//       expect(component.loginForm.valid).toBeTruthy();
//       spyOn(component, 'onSubmit').and.returnValue(form);
//       component.onSubmit(form);
//
//       loginElement = fixture.debugElement.query(By.css('form'));
//       loginElement.triggerEventHandler('ngSubmit', null);
//
//       spyOn(authService, 'loginUser').and.callThrough();
//       authService.loginUser(form.value);
//       expect(authService.loginUser).toHaveBeenCalledWith(form.value);
//       expect(component.onSubmit).toHaveBeenCalled();
//
//       spyOn(component.router, 'navigate').and.callFake(() => {
//         router.navigate(['/home']);
//         expect(component.router.navigate).toHaveBeenCalledWith(['/home']);
//       });
//
//     });
//   });
// });
