import {Injectable} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsReportService {
  private apiRoutes: any;
  private method: any;

  constructor(public helperService: HelperService) {
    this.apiRoutes = this.helperService.constants.apiRoutes;
    this.method = this.helperService.constants.apiMethod;
  }

  actionReport(data: any) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.actionsReport,
      data
    );
  }

  checkInByActivityReport(data: any) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.checkinByActivityReport,
      data
    );
  }

  pulseByEntity(data: any) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.pulseByEntity,
      data
    );
  }

  getHazardReport(data) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.hazardReport,
      data
    );
  }

  siteActivityReport(data: any) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.siteActivityReport,
      data
    );
  }

  filter() {
    return this.helperService.requestCall(
      this.method.get,
      this.apiRoutes.filters
    );
  }

  averageDailyActionsReport(data: any) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.averageDailyActionsReport,
      data
    );
  }


}
