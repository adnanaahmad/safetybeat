import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedEntityComponent } from './archived-entity.component';

describe('ArchivedEntityComponent', () => {
  let component: ArchivedEntityComponent;
  let fixture: ComponentFixture<ArchivedEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivedEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
