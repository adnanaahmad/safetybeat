import { TestBed } from '@angular/core/testing';

import { NoAuthGuard } from './restrict.service';

describe('RestrictService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoAuthGuard = TestBed.get(NoAuthGuard);
    expect(service).toBeTruthy();
  });
});
