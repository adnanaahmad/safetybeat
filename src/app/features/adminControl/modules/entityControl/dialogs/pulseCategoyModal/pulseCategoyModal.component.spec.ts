import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PulseCategoyModalComponent } from './pulseCategoyModal.component';

describe('PulseCategoyModalComponent', () => {
  let component: PulseCategoyModalComponent;
  let fixture: ComponentFixture<PulseCategoyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PulseCategoyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PulseCategoyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
