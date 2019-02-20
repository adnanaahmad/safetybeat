import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HazardReportComponent } from './hazardReport.component';

describe('HazardReportComponent', () => {
  let component: HazardReportComponent;
  let fixture: ComponentFixture<HazardReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HazardReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HazardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
