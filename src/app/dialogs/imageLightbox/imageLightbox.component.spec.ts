import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageLightboxComponent } from './imageLightbox.component';

describe('ImageLightboxComponent', () => {
  let component: ImageLightboxComponent;
  let fixture: ComponentFixture<ImageLightboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageLightboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageLightboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
