import { TestBed } from '@angular/core/testing';

import { ModalConfigService } from './modalConfig.service';

describe('ModalConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModalConfigService = TestBed.get(ModalConfigService);
    expect(service).toBeTruthy();
  });
});
