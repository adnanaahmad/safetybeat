import {Injectable} from '@angular/core';
import {HelperService} from '../../../shared/helperService/helper.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private orgData = new BehaviorSubject<any>(1);
  organizationData = this.orgData.asObservable();
  constructor(public helperService: HelperService) {

  }
  getOrganization() {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.get,
      this.helperService.constants.apiRoutes.getOrganization);
  }
}
