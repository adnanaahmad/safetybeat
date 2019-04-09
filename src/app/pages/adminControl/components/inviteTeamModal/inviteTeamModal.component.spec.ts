import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteTeamModalComponent } from './inviteTeamModal.component';

describe('InviteTeamModalComponent', () => {
  let component: InviteTeamModalComponent;
  let fixture: ComponentFixture<InviteTeamModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteTeamModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteTeamModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
