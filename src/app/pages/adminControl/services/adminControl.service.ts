import {InviteTeamData, InviteTeamResponse} from 'src/app/models/adminControl/inviteUser.model';
import {Injectable} from '@angular/core';
import {entity, joinEntity, entityData} from 'src/app/models/entity.model';
import {HelperService} from '../../../shared/helperService/helper.service';
import {Observable, BehaviorSubject} from 'rxjs';
import {ConstantService} from '../../../shared/constant/constant.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminControlService {
  apiRoutes: any;
  inviteTeamResponse$: Observable<InviteTeamResponse>
  method: any;
  private sites = new BehaviorSubject<any>(1);
  siteObserver = this.sites.asObservable();

  constructor(public helperService: HelperService,
              private http: HttpClient) {
    this.apiRoutes = this.helperService.constants.apiRoutes;
    this.method = this.helperService.constants.apiMethod;
  }

  /**
   * this function is used to...
   * @params sitesInfo
   */
  changeSites(sitesInfo: any) {
    this.sites.next(sitesInfo)
  }

  /**
   * this function is used to...
   * @params data
   */
  createEntity(data: entity) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.createEntity,
      data
    );
  }

  /**
   * this function is used to
   * @params data
   */
  viewEntities(data: object) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.viewAllEntities,
      data
    );
  }

  /**
   * this function is used to
   * @params data
   */
  joinEntity(data: joinEntity) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.joinEntity,
      data
    );
  }

  /**
   * this function is used to...
   * @params data
   */
  viewSites(data: object) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.viewAllSites,
      data
    );
  }

  /**
   * this function is used to
   * @params data
   */
  addSite(data: any) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.addSite,
      data
    )
  }

  inviteTeam(data: InviteTeamData): Observable<InviteTeamResponse> {
    this.inviteTeamResponse$ = this.helperService.requestCall(this.method.post, this.helperService.constants.apiRoutes.inviteTeam, data);
    return this.inviteTeamResponse$;
  }

  deleteEntity(id) {
    return this.http.delete(`${ConstantService.apiRoutes.editEntity}/${id}/`);
  }

  importSite(data: FormData) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.importSite,
      data
    )
  }

}
