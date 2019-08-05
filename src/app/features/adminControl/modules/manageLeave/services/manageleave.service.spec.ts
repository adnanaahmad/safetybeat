import { TestBed } from '@angular/core/testing';

import { ManageleaveService } from './manageleave.service';

describe('ManageleaveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageleaveService = TestBed.get(ManageleaveService);
    expect(service).toBeTruthy();
  });
});
