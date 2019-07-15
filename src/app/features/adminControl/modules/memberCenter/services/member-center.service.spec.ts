import { TestBed } from '@angular/core/testing';

import { MemberCenterService } from './member-center.service';

describe('MemberCenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MemberCenterService = TestBed.get(MemberCenterService);
    expect(service).toBeTruthy();
  });
});
