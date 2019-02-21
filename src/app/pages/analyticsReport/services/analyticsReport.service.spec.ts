import { TestBed } from '@angular/core/testing';

import { AnalyticsReportService } from './analyticsReport.service';

describe('AnalyticsReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnalyticsReportService = TestBed.get(AnalyticsReportService);
    expect(service).toBeTruthy();
  });
});
