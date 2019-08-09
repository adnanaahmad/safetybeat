import {Injectable} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {AllUserLeavesApiData} from 'src/app/models/manageLeave.model';
import {Observable} from 'rxjs';
import {UserLeavesApiResponse} from 'src/app/models/profile.model';

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


  viewAllUserLeavesData(data: AllUserLeavesApiData): Observable<UserLeavesApiResponse> {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.allUserLeaves, data);
  }
}
