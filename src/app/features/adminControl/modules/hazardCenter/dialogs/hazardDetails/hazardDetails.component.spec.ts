import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HazardDetailsComponent } from './hazardDetails.component';

describe('HazardDetailsComponent', () => {
  let component: HazardDetailsComponent;
  let fixture: ComponentFixture<HazardDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HazardDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HazardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
