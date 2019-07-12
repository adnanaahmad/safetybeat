import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageDailyActionsReportComponent } from './averageDailyActionsReport.component';

describe('AverageDailyActionsReportComponent', () => {
  let component: AverageDailyActionsReportComponent;
  let fixture: ComponentFixture<AverageDailyActionsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AverageDailyActionsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AverageDailyActionsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
