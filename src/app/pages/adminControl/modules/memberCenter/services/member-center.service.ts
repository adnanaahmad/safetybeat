import {Injectable} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberCenterService {
  apiRoutes: any;
  method: any;
  private allentityUsers = new BehaviorSubject<any>(1);
  entityUserObserver = this.allentityUsers.asObservable();

  constructor(
    public helperService: HelperService,
    private http: HttpClient
  ) {
    this.apiRoutes = this.helperService.constants.apiRoutes;
    this.method = this.helperService.constants.apiMethod;
  }


  /**
   * this function is used to...
   * @params data
   */
  entityUsers(data) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.entitiesUsers,
      data
    );
  }

  /**
   * this function is used for adding members of the entities as connections
   * @params data
   */

  addConnection(data) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.connectionAdding, data);
  }

  removeConnection(data) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.removeConnection, data);
  }

  confirmConnection(data) {
    return this.helperService.requestCall(this.method.post, this.apiRoutes.connectionConfirm, data);
  }
  deactivateUser(data) {
    return this.helperService.requestCall(this.method.put, this.apiRoutes.deactivateUser, data);
  }

  activateUser(data) {
    return this.helperService.requestCall(this.method.put, this.apiRoutes.activateUser, data);
  }

  changeEntityUsers(usersInfo: any) {
    this.allentityUsers.next(usersInfo);
  }
}
