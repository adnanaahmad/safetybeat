import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLeaveComponent } from './manageLeave.component';

describe('ManageLeaveComponent', () => {
  let component: ManageLeaveComponent;
  let fixture: ComponentFixture<ManageLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
