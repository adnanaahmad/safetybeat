import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, EmailValidator } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/app.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrManager, ToastrModule } from 'ng6-toastr-notifications';
import { LoginRegistrationService } from 'src/app/pages/login-Registration/services/LoginRegistrationService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { NotifierModule } from 'angular-notifier';
import { LoginResponse, loginCredentials } from 'src/app/models/user.model';
import { getTypeNameForDebugging } from '@angular/common/src/directives/ng_for_of';
import { ParticleContainerComponent } from '../particle-container/particle-container.component';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { routes } from 'src/app/app-routing.module';
import { Location } from '@angular/common';
import { PageNotFoundComponent } from 'src/app/core/components/page-not-found/page-not-found.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: LoginRegistrationService;
  let debugEl: DebugElement;
  let nativeEl: HTMLElement;
  let fixture: ComponentFixture<LoginComponent>;
  let errors = {};
  let location: Location;
  let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent, ParticleContainerComponent, PageNotFoundComponent],
      imports: [
        NotifierModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientModule,
        ReactiveFormsModule,
        MaterialModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
          }
        })
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
    authService = TestBed.get(LoginRegistrationService);
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    router.initialNavigation();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    nativeEl = fixture.nativeElement;
    component.ngOnInit();
  });

  // beforeEach(() => {
  // });

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });
  describe('check form validation', () => {
    it('form invalid when its empty', () => {
      expect(component.loginForm.valid).toBeFalsy();
    });
    it('email field validity false', () => {
      let email = component.loginForm.controls['email'];
      expect(email.valid).toBeTruthy();

      email.setValue('test');
      errors = email.errors || {};
      expect(errors['email']).toBeTruthy();
    });
    it('email field validity true', () => {
      let email = component.loginForm.controls['email'];
      errors = email.errors || {};
      expect(email.valid).toBeTruthy();

      email.setValue('test@test.com');
      errors = email.errors || {};
      expect(errors['email']).toBeFalsy();
    });
    it('check password validity false or undefined', () => {
      let password = component.loginForm.controls['password'];
      let errors = {};
      // errors = password.errors || {};
      expect(errors['password']).toBeFalsy();

      password.setValue('');
      errors = password.errors || {};
      expect(errors['password']).toBeUndefined();
      expect(errors['required']).toBeTruthy();

      password.setValue('admin123');
      errors = password.errors || {};
      expect(errors['password']).toBeFalsy();

    });
  });
  describe('user should login', () => {
    it('login form must be intialized', async(() => {
      let loginElement: DebugElement;
      authService = debugEl.injector.get(LoginRegistrationService);
      let form = {
        value: {
          username: 'admin',
          password: 'admin123'
        },
        valid: true
      };
      expect(component.loginForm.valid).toBeFalsy();
      component.loginForm.controls['username'].setValue('test');
      component.loginForm.controls['password'].setValue('test1234');
      expect(component.loginForm.valid).toBeTruthy();
      spyOn(authService, 'loginUser').and.callThrough();
      loginElement = fixture.debugElement.query(By.css('form'));
      loginElement.triggerEventHandler('ngSubmit', null);
      authService.loginUser(form.value);
      expect(authService.loginUser).toHaveBeenCalledWith(form.value);
      spyOn(component, 'onSubmit').and.returnValue(form);
      component.onSubmit(form);
      expect(component.onSubmit).toHaveBeenCalled();
      spyOn(component.router, 'navigate').and.returnValue(true);
      router.navigate(['/home']);
      expect(component.router.navigate).toHaveBeenCalledWith(['/home']);
    }));
  });
});
