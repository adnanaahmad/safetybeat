import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowFolderDocumentsComponent } from './showFolderDocuments.component';

describe('showFolderDocumentsComponent', () => {
  let component: ShowFolderDocumentsComponent;
  let fixture: ComponentFixture<ShowFolderDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowFolderDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowFolderDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
