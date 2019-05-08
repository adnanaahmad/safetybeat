import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHazardComponent } from './editHazard.component';

describe('EditHazardComponent', () => {
  let component: EditHazardComponent;
  let fixture: ComponentFixture<EditHazardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHazardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHazardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
