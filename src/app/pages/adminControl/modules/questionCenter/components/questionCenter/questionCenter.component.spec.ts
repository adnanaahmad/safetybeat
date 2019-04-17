import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCenterComponent } from './questionCenter.component';

describe('QuestionCenterComponent', () => {
  let component: QuestionCenterComponent;
  let fixture: ComponentFixture<QuestionCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
