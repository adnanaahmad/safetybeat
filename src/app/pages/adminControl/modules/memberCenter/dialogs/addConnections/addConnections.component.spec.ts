import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConnectionsComponent } from './addConnections.component';

describe('AddConnectionsComponent', () => {
  let component: AddConnectionsComponent;
  let fixture: ComponentFixture<AddConnectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddConnectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
