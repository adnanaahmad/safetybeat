import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityPulseReportComponent } from './entityPulseReport.component';

describe('EntityPulseReportComponent', () => {
  let component: EntityPulseReportComponent;
  let fixture: ComponentFixture<EntityPulseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityPulseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityPulseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
