import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';
import { ToastrModule } from 'ng6-toastr-notifications';

describe('ToastService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      ToastrModule.forRoot(),
    ]
  }));

  it('should be created', () => {
    const service: ToastService = TestBed.get(ToastService);
    expect(service).toBeTruthy();
  });
});
