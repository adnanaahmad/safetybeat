import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EntityCodeModalComponent } from './entityCodeModal.component';

describe('AlertModalComponent', () => {
  let component: EntityCodeModalComponent;
  let fixture: ComponentFixture<EntityCodeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityCodeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityCodeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
