import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSearchComponent } from './advanceSearch.component';

describe('AdvanceSearchComponent', () => {
  let component: AdvanceSearchComponent;
  let fixture: ComponentFixture<AdvanceSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
