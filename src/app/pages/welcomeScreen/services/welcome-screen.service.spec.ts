import { TestBed } from '@angular/core/testing';

import { WelcomeScreenService } from './welcome-screen.service';

describe('WelcomeScreenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WelcomeScreenService = TestBed.get(WelcomeScreenService);
    expect(service).toBeTruthy();
  });
});
