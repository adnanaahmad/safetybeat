import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationComponent } from './registration.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/app.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrManager, ToastrModule } from 'ng6-toastr-notifications';
import { NotifierModule } from 'angular-notifier';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { ParticleContainerComponent } from '../particle-container/particle-container.component';
import { Router } from '@angular/router';
import { LoginRegistrationService } from 'src/app/pages/login-registration/services/LoginRegistrationService';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { PageNotFoundComponent } from 'src/app/core/components/page-not-found/page-not-found.component';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let authService: LoginRegistrationService;
  let debugEl: DebugElement;
  let nativeEl: HTMLElement;
  let translate: TranslateService;
  let fixture: ComponentFixture<RegistrationComponent>;
  let errors = {};
  let location: Location;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationComponent, ParticleContainerComponent, PageNotFoundComponent],
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
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        LoggingService
      ]
    })
      .compileComponents();
    authService = TestBed.get(LoginRegistrationService);
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    translate = TestBed.get(TranslateService);
    router.initialNavigation();
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;

    debugEl = fixture.debugElement;
    nativeEl = fixture.nativeElement;
    component.ngOnInit();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });
  describe('check form validation', () => {
    it('form invalid when its empty', () => {
      expect(component.userForm.valid).toBeFalsy();
    });
    it('check username validation when its empty', () => {
      let username = component.userForm.controls['username'];
      expect(username.valid).toBeFalsy();

      username.setValue('');
      errors = username.errors || {};
      expect(errors['required']).toBeTruthy();
    });
    it('check username when its valid and will be true and no erros', () => {
      let username = component.userForm.controls['username'];
      username.setValue('taqi');
      errors = username.errors || {};
      expect(username.valid).toBeTruthy();
      expect(errors['required']).toBeFalsy();
    });


    it('check firstname validation when its empty', () => {
      let firstname = component.userForm.controls['first_name'];
      expect(firstname.valid).toBeFalsy();

      firstname.setValue('');
      errors = firstname.errors || {};
      expect(errors['required']).toBeTruthy();
    });
    it('check firstname when its valid and will be true and no erros', () => {
      let firstname = component.userForm.controls['first_name'];
      firstname.setValue('taqi');
      errors = firstname.errors || {};
      expect(firstname.valid).toBeTruthy();
      expect(errors['required']).toBeFalsy();
    });


    it('check lastname validation when its empty', () => {
      let lastname = component.userForm.controls['last_name'];
      expect(lastname.valid).toBeFalsy();
    });
    it('check last name validation when its false', () => {
      let lastname = component.userForm.controls['last_name'];
      lastname.setValue('');
      errors = lastname.errors || {};
      expect(errors['required']).toBeTruthy();
    });
    it('check lastname when its valid and will be true and no erros', () => {
      let lastname = component.userForm.controls['last_name'];
      lastname.setValue('taqi');
      errors = lastname.errors || {};
      expect(lastname.valid).toBeTruthy();
      expect(errors['required']).toBeFalsy();
    });

    it('email field validity false', () => {
      let email = component.userForm.controls['email'];
      expect(email.valid).toBeFalsy();

      email.setValue('test');
      errors = email.errors || {};
      expect(errors['email']).toBeTruthy();
    });
    it('email field validity true', () => {
      let email = component.userForm.controls['email'];
      errors = email.errors || {};
      expect(email.valid).toBeFalsy();

      email.setValue('test@test.com');
      errors = email.errors || {};
      expect(errors['email']).toBeFalsy();
    });
    // it('check password validity false or undefined', () => {
    //   let password = component.userForm.controls['password'];
    //   errors = password.errors || {};
    //   expect(errors['password']).toBeFalsy();

    //   password.setValue('');
    //   errors = password.errors || {};
    //   expect(errors['password']).toBeUndefined();
    //   expect(errors['required']).toBeTruthy();

    //   password.setValue('admin123');
    //   errors = password.errors || {};
    //   expect(errors['password']).toBeFalsy();
    // });
    // it('check first_name validity', () => {
    //   expect(component.userForm.valid).toBeFalsy();
    // });
  });
});
