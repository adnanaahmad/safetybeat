import { TestBed } from '@angular/core/testing';

import { QuestionCenterService } from './questionCenter.service';

describe('QuestionCenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuestionCenterService = TestBed.get(QuestionCenterService);
    expect(service).toBeTruthy();
  });
});
