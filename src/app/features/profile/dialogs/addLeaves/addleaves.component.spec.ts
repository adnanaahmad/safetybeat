import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddleavesComponent } from './addleaves.component';

describe('AddleavesComponent', () => {
  let component: AddleavesComponent;
  let fixture: ComponentFixture<AddleavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddleavesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddleavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
