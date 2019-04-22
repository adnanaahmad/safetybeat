import {Injectable} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';

@Injectable({
  providedIn: 'root'
})
export class MemberCenterService {
  apiRoutes: any;
  method: any;

  constructor(
    public helperService: HelperService
  ) {
    this.apiRoutes = this.helperService.constants.apiRoutes;
    this.method = this.helperService.constants.apiMethod;
  }


  /**
   * this function is used to...
   * @params data
   */
  entityUsers(data) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.entitiesUsers,
      data
    );
  }

  deactivateUser(data) {
    return this.helperService.requestCall(this.method.put, this.apiRoutes.deactivateUser, data)
  }

  activateUser(data) {
    return this.helperService.requestCall(this.method.put, this.apiRoutes.activateUser, data)
  }
}
