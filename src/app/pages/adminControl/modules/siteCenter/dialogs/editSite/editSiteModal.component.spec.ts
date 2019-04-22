import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSiteModalComponent } from './editSiteModal.component';

describe('EditSiteModalComponent', () => {
  let component: EditSiteModalComponent;
  let fixture: ComponentFixture<EditSiteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSiteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSiteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
