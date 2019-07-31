import {Injectable} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';

@Injectable({
  providedIn: 'root'
})
export class ManageleaveService {
  private apiRoutes: any;
  private method: any;

  constructor(
    public helperService: HelperService) {
    this.apiRoutes = this.helperService.constants.apiRoutes;
    this.method = this.helperService.constants.apiMethod;
  }


  viewAllUserLeavesData(data) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.allUserLeaves, data);
  }
}
