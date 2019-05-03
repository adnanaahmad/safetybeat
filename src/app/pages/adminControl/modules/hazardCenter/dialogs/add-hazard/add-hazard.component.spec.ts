import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHazardComponent } from './add-hazard.component';

describe('AddHazardComponent', () => {
  let component: AddHazardComponent;
  let fixture: ComponentFixture<AddHazardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHazardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHazardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
