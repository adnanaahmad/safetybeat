import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {AllUsersOfEntityResponse} from 'src/app/models/adminControl/entityControl.model';
import {User} from 'src/app/models/user.model';
import {ActivityApiResponse, ActivityFilterData, LeaveTypes} from 'src/app/models/profile/profile.model';
import {PaginationData, ViewAllSiteEntityData, ViewAllSitesApiResponse} from 'src/app/models/site.model';
import {AddLeaveApiResponse, AddLeaveData, UserLeavesApiResponse} from 'src/app/models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private orgUsers = new BehaviorSubject<any>(1);
  usersData = this.orgUsers.asObservable();
  apiRoutes: any;
  method: any;

  constructor(
    public helperService: HelperService) {
    this.apiRoutes = this.helperService.constants.apiRoutes;
    this.method = this.helperService.constants.apiMethod;
  }

  /**
   * this api function is used to get the current user's data.
   */

  getUser() {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.get, this.helperService.constants.apiRoutes.user);
  }

  /**
   * this api function is used to return all the users of the organization.
   */

  getAllUsers(paginationData: PaginationData): Observable<AllUsersOfEntityResponse> {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.get,
      `${this.helperService.constants.apiRoutes.allUsersOfOrganization}?limit=${paginationData.limit}&offset=${paginationData.offset}`
    );
  }

  /**
   * this function is used to update the all users of organization data to all the places where this observable is subscribed.
   * @params data
   */

  updateUsers(data: Array<User>) {
    this.orgUsers.next(data);
  }

  userInfo(id: number) {
    return this.helperService.requestCall(
      this.method.get,
      `${this.apiRoutes.userInfo}${id}/`
    );
  }

  profilePicUpdate(data: any) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.profilePic,
      data
    );
  }

  getUserData(data) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.getUserData,
      data
    )
  }

  viewAllConnections(data: any) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.viewAllConnections, data);
  }

  viewRecentActivities(data: ActivityFilterData, paginationData: PaginationData): Observable<ActivityApiResponse> {
    return this.helperService.requestCall(this.method.post,
      `${this.apiRoutes.recentActivities}?limit=${paginationData.limit}&offset=${paginationData.offset}`, data);
  }

  filter() {
    return this.helperService.requestCall(
      this.method.get,
      this.apiRoutes.filters
    );
  }

  getLeaveTypes(): Observable<Array<LeaveTypes>> {
    return this.helperService.requestCall(
      this.method.get,
      this.apiRoutes.leaveTypes
    );
  }

  addLeaves(data: AddLeaveData): Observable<AddLeaveApiResponse> {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.addLeave, data);
  }

  editLeaves(id: number, data: AddLeaveData): Observable<AddLeaveApiResponse> {
    return this.helperService.requestCall(this.method.put, `${this.apiRoutes.addLeave}${id}/`, data);
  }

  deleteLeave(id: number) {
    return this.helperService.requestCall(this.method.delete, `${this.apiRoutes.addLeave}${id}/`);
  }

  viewAllUserLeaves(data): Observable<UserLeavesApiResponse> {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.userLeaves, data);
  }

  allUserLeavesData(data) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.allUserLeaves, data)
  }

}
