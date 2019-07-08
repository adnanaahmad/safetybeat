import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDocumentsComponent } from './showDocuments.component';

describe('ShowDocumentsComponent', () => {
  let component: ShowDocumentsComponent;
  let fixture: ComponentFixture<ShowDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
