import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendSiteCodeComponent } from './sendSiteCode.component';

describe('SendSiteCodeComponent', () => {
  let component: SendSiteCodeComponent;
  let fixture: ComponentFixture<SendSiteCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendSiteCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendSiteCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
