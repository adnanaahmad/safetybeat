import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstantService} from 'src/app/shared/constant/constant.service';
import {CoreService} from 'src/app/core/services/authorization/core.service';
import {catchError} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private orgUsers = new BehaviorSubject<any>(1);
  usersData = this.orgUsers.asObservable();
  private currentUser = new BehaviorSubject<any>(1);
  currentUserData = this.currentUser.asObservable();

  constructor(
    private http: HttpClient,
    public coreServices: CoreService) {
  }

  /**
   * this api function is used to get the current user's data.
   */

  getUser() {
    return this.http.get(`${ConstantService.apiRoutes.user}`).pipe(catchError(this.coreServices.handleError));
  }

  /**
   * this api function is used to return all the users of the organization.
   */

  getAllUsers() {
    return this.http.get(`${ConstantService.apiRoutes.allUsersOfOrganization}`).pipe(catchError(this.coreServices.handleError));
  }

  /**
   * this function is used to update the all users of organization data to all the places where this observable is subscribed.
   * @params data
   */

  updateUsers(data: any) {
    this.orgUsers.next(data);
  }

  updateCurrenUser(data: any) {
    this.currentUser.next(data);
  };
}
