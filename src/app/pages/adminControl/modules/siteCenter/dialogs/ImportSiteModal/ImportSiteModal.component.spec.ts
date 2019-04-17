import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSiteModalComponent } from './ImportSiteModal.component';

describe('ImportSiteModalComponent', () => {
  let component: ImportSiteModalComponent;
  let fixture: ComponentFixture<ImportSiteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportSiteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportSiteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
