import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompilantCheckoutReportComponent } from './compilantCheckoutReport.component';

describe('CompilantCheckoutReportComponent', () => {
  let component: CompilantCheckoutReportComponent;
  let fixture: ComponentFixture<CompilantCheckoutReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompilantCheckoutReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompilantCheckoutReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
