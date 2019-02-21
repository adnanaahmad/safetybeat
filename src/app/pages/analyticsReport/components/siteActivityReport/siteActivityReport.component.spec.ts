import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteActivityReportComponent } from './siteActivityReport.component';


describe('SiteActivityReportComponent', () => {
  let component: SiteActivityReportComponent;
  let fixture: ComponentFixture<SiteActivityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteActivityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteActivityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
