import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationPackageComponent } from './organizationPackage.component';

describe('OrganizationPackageComponent', () => {
  let component: OrganizationPackageComponent;
  let fixture: ComponentFixture<OrganizationPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
