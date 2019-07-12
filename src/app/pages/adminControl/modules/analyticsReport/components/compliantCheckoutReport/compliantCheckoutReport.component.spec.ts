import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {CompliantCheckoutReportComponent} from './compliantCheckoutReport.component';

describe('CompliantCheckoutReportComponent', () => {
  let component: CompliantCheckoutReportComponent;
  let fixture: ComponentFixture<CompliantCheckoutReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompliantCheckoutReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompliantCheckoutReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
