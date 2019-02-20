import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCenterComponent } from './siteCenter.component';

describe('SiteCenterComponent', () => {
  let component: SiteCenterComponent;
  let fixture: ComponentFixture<SiteCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
