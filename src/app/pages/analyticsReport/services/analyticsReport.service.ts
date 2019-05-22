import {Injectable} from '@angular/core';
import {HelperService} from '../../../shared/helperService/helper.service';

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

  actionReportForUser(data: any) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.actionsReportForUser,
      data
    );
  }

}
