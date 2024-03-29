import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocComponent } from './uploadDoc.component';

describe('UploadDocComponent', () => {
  let component: UploadDocComponent;
  let fixture: ComponentFixture<UploadDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
