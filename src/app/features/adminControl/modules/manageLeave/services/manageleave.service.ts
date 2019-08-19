import {Injectable} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {AllUserLeavesApiData} from 'src/app/models/manageLeave.model';
import {Observable} from 'rxjs';
import {AddLeaveApiResponse, UserLeavesApiResponse} from 'src/app/models/profile.model';
import {PaginationData} from 'src/app/models/site.model';

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


  viewAllUserLeavesData(data: AllUserLeavesApiData, pagination: PaginationData): Observable<UserLeavesApiResponse> {
    return this.helperService.requestCall(
      this.method.post,
      `${this.apiRoutes.allUserLeaves}?limit=${pagination.limit}&offset=${pagination.offset}&search=${pagination.search}`,
      data
    );
  }

  acceptRejectUserLeaves(id, data): Observable<AddLeaveApiResponse> {
    return this.helperService.requestCall(this.method.put, `${this.apiRoutes.addLeave}${id}/`, data);
  }


}
