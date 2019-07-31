import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActionsComponent } from './addActions.component';

describe('AddActionsComponent', () => {
  let component: AddActionsComponent;
  let fixture: ComponentFixture<AddActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
