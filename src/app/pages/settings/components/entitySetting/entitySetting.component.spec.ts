import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitySettingComponent } from './entitySetting.component';

describe('EntitySettingComponent', () => {
  let component: EntitySettingComponent;
  let fixture: ComponentFixture<EntitySettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntitySettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
