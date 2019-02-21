import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInActivityReportComponent } from './checkinActivityReport.component';

describe('CheckInActivityReportComponent', () => {
  let component: CheckInActivityReportComponent;
  let fixture: ComponentFixture<CheckInActivityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckInActivityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInActivityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
