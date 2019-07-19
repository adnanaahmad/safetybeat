import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {AllUsersOfEntityResponse} from 'src/app/models/adminControl/entityControl.model';
import {User} from 'src/app/models/user.model';

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

  getAllUsers(): Observable<AllUsersOfEntityResponse> {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.get,
      this.helperService.constants.apiRoutes.allUsersOfOrganization);
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

  viewAllConnections(data: any) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.viewAllConnections, data);
  }

  viewRecentActivities(userId) {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.post,
      this.helperService.constants.apiRoutes.recentActivities, userId);
  }

}
