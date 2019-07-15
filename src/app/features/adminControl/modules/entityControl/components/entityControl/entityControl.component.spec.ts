import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityControlComponent } from './entityControl.component';

describe('EntityControlComponent', () => {
  let component: EntityControlComponent;
  let fixture: ComponentFixture<EntityControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
