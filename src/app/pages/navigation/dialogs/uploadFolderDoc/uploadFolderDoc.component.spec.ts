import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFolderDocComponent } from './uploadFolderDoc.component';

describe('UploadFolderDocComponent', () => {
  let component: UploadFolderDocComponent;
  let fixture: ComponentFixture<UploadFolderDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFolderDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFolderDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
