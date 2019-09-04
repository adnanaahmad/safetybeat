import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedSitesComponent } from './archivedSites.component';

describe('ArchivedSitesComponent', () => {
  let component: ArchivedSitesComponent;
  let fixture: ComponentFixture<ArchivedSitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivedSitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
