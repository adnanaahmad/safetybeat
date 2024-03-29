import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationInfoComponent } from './organizationInfo.component';

describe('OrganizationInfoComponent', () => {
  let component: OrganizationInfoComponent;
  let fixture: ComponentFixture<OrganizationInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
