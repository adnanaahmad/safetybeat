import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ParticleContainer2Component} from './particleContainer2.component';
import {NotifierModule} from 'angular-notifier';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'src/app/material.module';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {createTranslateLoader} from 'src/app/app.module';

describe('ParticleContainerComponent', () => {
  let component: ParticleContainer2Component;
  let fixture: ComponentFixture<ParticleContainer2Component>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticleContainer2Component],
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
    fixture = TestBed.createComponent(ParticleContainer2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
