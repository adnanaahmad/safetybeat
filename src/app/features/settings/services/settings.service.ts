import {Injectable} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Intervals} from 'src/app/models/Settings/entitySetting.model';

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

  getDefaultIntervals(data): Observable<Intervals> {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.post,
      this.helperService.constants.apiRoutes.defaultIntervals, data);
  }

  updateIntervals(data, id): Observable<Intervals> {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.put,
      `${this.helperService.constants.apiRoutes.updateIntervals}${id}/`, data);
  }

  getPackage() {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.get,
      this.helperService.constants.apiRoutes.getPackage);
  }
}
