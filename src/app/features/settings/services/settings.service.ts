import {Injectable} from '@angular/core';
import {HelperService} from '../../../services/common/helperService/helper.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private orgData = new BehaviorSubject<any>(1);
  organizationData = this.orgData.asObservable();
  private genData = new BehaviorSubject<any>(1);
  generalData = this.genData.asObservable();

  constructor(public helperService: HelperService) {

  }

  getOrganization() {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.get,
      this.helperService.constants.apiRoutes.getOrganization);
  }

  editOrganization(id, data) {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.put,
      `${this.helperService.constants.apiRoutes.editOrganization}/${id}/`, data);
  }

  getTypes(): any {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.get, this.helperService.constants.apiRoutes.companyTypes);
  }

  editProfile(id, data) {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.put,
      `${this.helperService.constants.apiRoutes.editProfile}/${id}/`, data);
  }

  /**
   * this function is used to edit Entity using entityId and new data of the entity
   * @params id
   * @params data
   */
  editEntity(id, data) {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.put,
      `${this.helperService.constants.apiRoutes.editEntity}/${id}/`, data);
  }

  /**
   * this function is used to return api responses when password is changed.
   * @params data
   */

  changePassword(data) {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.put,
      this.helperService.constants.apiRoutes.changePassword, data);
  }
}
