import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInCategoryModalComponent } from './checkInCategoryModal.component';

describe('CheckInCategoryModalComponent', () => {
  let component: CheckInCategoryModalComponent;
  let fixture: ComponentFixture<CheckInCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckInCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
