import {Injectable} from '@angular/core';
import {HelperService} from '../../../shared/helperService/helper.service';
import {entity} from '../../../models/entity.model';

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

}
