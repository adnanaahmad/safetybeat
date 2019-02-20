import { TestBed } from '@angular/core/testing';

import { AdminControlService } from './adminControl.service';

describe('AdminControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminControlService = TestBed.get(AdminControlService);
    expect(service).toBeTruthy();
  });
});
