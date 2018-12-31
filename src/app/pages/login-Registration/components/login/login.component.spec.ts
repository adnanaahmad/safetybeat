import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/app.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrManager, ToastrModule } from 'ng6-toastr-notifications';
import { AuthService } from 'src/app/core/auth/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: AuthService;
  let debugEl: DebugElement;
  let nativeEl: HTMLElement;
  let fixture: ComponentFixture<LoginComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
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
    authService = TestBed.get(AuthService);
  }));
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule, FormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, },
      ]
    }).compileComponents();

    authService = TestBed.get(AuthService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    nativeEl = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
