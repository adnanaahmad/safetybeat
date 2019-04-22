import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgRegistrationModalComponent } from './org-registration-modal.component';

describe('OrgRegistrationModalComponent', () => {
  let component: OrgRegistrationModalComponent;
  let fixture: ComponentFixture<OrgRegistrationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgRegistrationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgRegistrationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
