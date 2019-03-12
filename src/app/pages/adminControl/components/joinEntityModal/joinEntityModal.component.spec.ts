import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinEntityModalComponent } from './joinEntityModal.component';

describe('JoinEntityModalComponent', () => {
  let component: JoinEntityModalComponent;
  let fixture: ComponentFixture<JoinEntityModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinEntityModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinEntityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
