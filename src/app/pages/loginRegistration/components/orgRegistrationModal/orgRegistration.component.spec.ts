import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgRegistrationComponent } from './orgRegistration.component';

describe('OrgRegistrationComponent', () => {
  let component: OrgRegistrationComponent;
  let fixture: ComponentFixture<OrgRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
