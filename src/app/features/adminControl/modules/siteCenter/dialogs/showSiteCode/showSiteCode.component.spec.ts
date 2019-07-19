import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSiteCodeComponent } from './showSiteCode.component';

describe('ShowSiteCodeComponent', () => {
  let component: ShowSiteCodeComponent;
  let fixture: ComponentFixture<ShowSiteCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowSiteCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSiteCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
