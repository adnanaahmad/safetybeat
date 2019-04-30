import {Injectable} from '@angular/core';
import {HelperService} from '../../../shared/helperService/helper.service';
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
}
