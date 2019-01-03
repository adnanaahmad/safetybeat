import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl } from '@angular/forms';
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

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: LoginRegistrationService;
  let debugEl: DebugElement;
  let nativeEl: HTMLElement;
  let fixture: ComponentFixture<LoginComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
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
      ]
    })
      .compileComponents();
    authService = TestBed.get(LoginRegistrationService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    nativeEl = fixture.nativeElement;
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });
  describe('user should login', () => {
    let user: LoginResponse = {
      'token': 'this is my dummy token',
      'user': {
        'username': 'admin',
        'email': 'email@test.com',
        'first_name': 'admin',
        'last_name': 'admin',
        'mobile_no': '12345678',
        'password': 'admin123'
      }
    };
    let valid: boolean;
    const loginCredentials = {
      username: 'admin',
      password: 'admin123'
    };
    it('login form must be intialized', () => {
      // let form = {
      //   value: {
      //     username: 'admin',
      //     password: 'admin123'
      //   },
      //   valid: true
      // };
      component.ngOnInit();
      // component.onSubmit(form);
      expect(component.loginForm instanceof FormGroup).toBe(true);
    });
    it('should return true if the form control is valid', () => {
      const formControl = new FormControl('test');
      component.control = formControl;
      expect(component.formValidation).toBe(true);
    });
  });
});
