import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HazardCenterComponent } from './hazardCenter.component';

describe('HazardCenterComponent', () => {
  let component: HazardCenterComponent;
  let fixture: ComponentFixture<HazardCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HazardCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HazardCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
