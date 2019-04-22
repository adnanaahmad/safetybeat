import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAccessLevelComponent } from './changeAccessLevel.component';

describe('ChangeAccessLevelComponent', () => {
  let component: ChangeAccessLevelComponent;
  let fixture: ComponentFixture<ChangeAccessLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeAccessLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeAccessLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
