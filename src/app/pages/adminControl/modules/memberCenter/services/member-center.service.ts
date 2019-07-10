import {Injectable} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {entityUserApiData, entityUsersApiResponse} from 'src/app/models/entity.model';
import {PaginationData, ViewAllSiteEntityData, ViewAllSitesApiResponse} from '../../../../../models/site.model';

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
