import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSiteModalComponent } from './addSiteModal.component';

describe('AddSiteModalComponent', () => {
  let component: AddSiteModalComponent;
  let fixture: ComponentFixture<AddSiteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSiteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSiteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
