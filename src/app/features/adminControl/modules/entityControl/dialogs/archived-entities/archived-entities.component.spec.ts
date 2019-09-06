import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedEntitiesComponent } from './archived-entities.component';

describe('ArchivedEntitiesComponent', () => {
  let component: ArchivedEntitiesComponent;
  let fixture: ComponentFixture<ArchivedEntitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivedEntitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
