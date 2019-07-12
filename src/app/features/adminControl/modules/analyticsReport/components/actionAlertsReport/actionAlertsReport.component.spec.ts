import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionAlertsReportsComponent } from './actionAlertsReport.component';

describe('ActionAlertsReportsComponent', () => {
  let component: ActionAlertsReportsComponent;
  let fixture: ComponentFixture<ActionAlertsReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionAlertsReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionAlertsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
