import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatepackgaeComponent } from './updatepackgae.component';

describe('UpdatepackgaeComponent', () => {
  let component: UpdatepackgaeComponent;
  let fixture: ComponentFixture<UpdatepackgaeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatepackgaeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatepackgaeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
