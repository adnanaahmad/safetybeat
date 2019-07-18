import {Injectable} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {PaginationData, ViewAllSiteEntityData, ViewAllSitesApiResponse} from 'src/app/models/site.model';
import {entityUsersApiResponse} from 'src/app/models/entity.model';

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
   *
   * @params entityId
   * @params data
   */
  entityUsers(entityId: ViewAllSiteEntityData, data?: PaginationData): Observable<entityUsersApiResponse> {
    return this.helperService.requestCall(
      this.method.post,
      `${this.apiRoutes.entitiesUsers}?limit=${data.limit}&offset=${data.offset}&search=${data.search}`,
      entityId
    );
  }

  getUsersList(entityId: ViewAllSiteEntityData): Observable<entityUsersApiResponse> {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.allUser,
      entityId
    );
  }

  /**
   *
   * @params entityId
   */

  allEntityUsers(entityId: ViewAllSiteEntityData) {
    return this.helperService.requestCall(
      this.method.post, this.apiRoutes.allEntityUsers, entityId
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

  updateUserPermission(data, id) {
    return this.helperService.requestCall(
      this.method.put,
      `${this.apiRoutes.userPermissions}${id}/`,
      data
    );
  }
}
