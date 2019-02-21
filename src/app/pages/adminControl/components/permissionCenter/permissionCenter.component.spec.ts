import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionCenterComponent } from './permissionCenter.component';

describe('PermissionCenterComponent', () => {
  let component: PermissionCenterComponent;
  let fixture: ComponentFixture<PermissionCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
