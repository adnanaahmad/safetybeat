import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstantService} from 'src/app/shared/constant/constant.service';
import {CoreService} from 'src/app/core/services/authorization/core.service';
import {catchError} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {HelperService} from '../../../shared/helperService/helper.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private orgUsers = new BehaviorSubject<any>(1);
  usersData = this.orgUsers.asObservable();
  apiRoutes: any;
  method: any;

  constructor(
    private http: HttpClient,
    public coreServices: CoreService,
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

  getAllUsers() {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.get,
      this.helperService.constants.apiRoutes.allUsersOfOrganization);
  }

  /**
   * this function is used to update the all users of organization data to all the places where this observable is subscribed.
   * @params data
   */

  updateUsers(data: any) {
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


}
