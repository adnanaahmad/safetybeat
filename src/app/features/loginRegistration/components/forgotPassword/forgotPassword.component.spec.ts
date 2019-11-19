import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MaterialModule} from 'src/app/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {createTranslateLoader} from 'src/app/app.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NotifierModule} from 'angular-notifier';
import {ForgotPasswordComponent} from './forgotPassword.component';
import {ParticleContainerComponent} from '../particleContainer/particleContainer.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ForgotPasswordComponent,
        ParticleContainerComponent
      ],
      imports: [
        NotifierModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientModule,
        ReactiveFormsModule,
        MaterialModule,
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ForgotPasswordComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });
});
