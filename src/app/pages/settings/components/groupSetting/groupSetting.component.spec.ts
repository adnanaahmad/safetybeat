import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSettingComponent } from './groupSetting.component';

describe('GroupSettingComponent', () => {
  let component: GroupSettingComponent;
  let fixture: ComponentFixture<GroupSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
