import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonPulseReportComponent } from './personPulseReport.component';

describe('PersonPulseReportComponent', () => {
  let component: PersonPulseReportComponent;
  let fixture: ComponentFixture<PersonPulseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonPulseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonPulseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
