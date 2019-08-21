import { TestBed } from '@angular/core/testing';

import { RestrictService } from './restrict.service';

describe('RestrictService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RestrictService = TestBed.get(RestrictService);
    expect(service).toBeTruthy();
  });
});
