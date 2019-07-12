import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsPersonReportComponent } from './alertsPersonReport.component';

describe('AlertsPersonReportComponent', () => {
  let component: AlertsPersonReportComponent;
  let fixture: ComponentFixture<AlertsPersonReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertsPersonReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsPersonReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
