import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedHazardsComponent } from './archived-hazards.component';

describe('ArchivedHazardsComponent', () => {
  let component: ArchivedHazardsComponent;
  let fixture: ComponentFixture<ArchivedHazardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivedHazardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedHazardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
