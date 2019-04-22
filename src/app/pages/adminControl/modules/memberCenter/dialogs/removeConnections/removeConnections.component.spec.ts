import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveConnectionsComponent } from './removeConnections.component';

describe('RemoveConnectionsComponent', () => {
  let component: RemoveConnectionsComponent;
  let fixture: ComponentFixture<RemoveConnectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveConnectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
