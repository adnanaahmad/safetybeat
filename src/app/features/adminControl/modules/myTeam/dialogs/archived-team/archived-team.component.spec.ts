import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedTeamComponent } from './archived-team.component';

describe('ArchivedTeamComponent', () => {
  let component: ArchivedTeamComponent;
  let fixture: ComponentFixture<ArchivedTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivedTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
