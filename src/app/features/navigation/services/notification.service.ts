import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {NotificationList} from 'src/app/models/navigation/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  apiRoutes: any;
  method: { get: string; post: string; put: string; delete: string; };
  constructor(public helperService: HelperService) { 
    this.apiRoutes = this.helperService.constants.apiRoutes;
    this.method = this.helperService.constants.apiMethod;
  }

  /**
   * Get Requests, sent from mobile devices
   */
  getRequestsData() : Observable<NotificationList> {
    return this.helperService.requestCall(this.method.get, this.apiRoutes.requests);
  }

  /**
   * Get notifications like pulse, check-in, check-out that are sent from mobile devices
   */
  getDirectMessages() : any {
    return this.helperService.requestCall(this.method.get, this.apiRoutes.directMessages);
  }
}
