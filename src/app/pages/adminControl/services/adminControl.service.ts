import {InviteTeamData, InviteTeamResponse} from 'src/app/models/adminControl/inviteUser.model';
import {Injectable} from '@angular/core';
import {entity, joinEntity} from 'src/app/models/entity.model';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {Observable, BehaviorSubject} from 'rxjs';
import {ConstantService} from 'src/app/shared/constant/constant.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminControlService {
  apiRoutes: any;
  inviteTeamResponse$: Observable<InviteTeamResponse>;
  method: any;
  private sites = new BehaviorSubject<any>(1);
  siteObserver = this.sites.asObservable();

  constructor(public helperService: HelperService,
              private http: HttpClient) {
    this.apiRoutes = this.helperService.constants.apiRoutes;
    this.method = this.helperService.constants.apiMethod;
  }

  /**
   * this function is used to change the sites data whenever the view all sites data api is called
   * @params sitesInfo
   */
  changeSites(sitesInfo: any) {
    this.sites.next(sitesInfo);
  }

  /**
   * this function is used to return the createEntity api response.
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
   * this function is used to return the viewAllEntities api response whenever and wherever this function is called
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
   * this function is used to return the joinEntity api response.
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
   * this function is used to return the response for viewAllSites api call.
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
   * this function is used to return the addSite api response.
   * @params data
   */
  addSite(data: any) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.addSite,
      data
    );
  }

  /**
   * this function is used to return the inviteTeam api response whether the user's been added into the team or not.
   * @params data
   */

  inviteTeam(data: InviteTeamData): Observable<InviteTeamResponse> {
    this.inviteTeamResponse$ = this.helperService.requestCall(this.method.post, this.helperService.constants.apiRoutes.inviteTeam, data);
    return this.inviteTeamResponse$;
  }

  /**
   * this function is used to delete the entity using the entityId and return response.
   * @params id
   */

  deleteEntity(id) {
    return this.helperService.requestCall(this.method.delete, `${this.apiRoutes.importSite}/${id}/`);
  }

  /**
   * this function is used to return the api response for import Site api
   * call. when the csv file is sent to this api call then the sites data
   * that is written in that particular csv file is added into the sites this function returns the success or failure response.
   * @params data
   */

  importSite(data: FormData) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.importSite,
      data
    );
  }

  viewSiteInfo(id: number) {
    return this.helperService.requestCall(
      this.method.get,
      `${this.apiRoutes.viewSiteInfo}${id}/`
    );
  }

  deleteSite(id: number) {
    return this.helperService.requestCall(
      this.method.delete,
      `${this.apiRoutes.viewSiteInfo}${id}/`
    );
  }

  editSite(id: number, data) {
    return this.helperService.requestCall(
      this.method.put,
      `${this.apiRoutes.viewSiteInfo}${id}/`,
      data
    );
  }

  addNewHazard(data) {

    return this.helperService.requestCall(this.helperService.constants.apiMethod.post,
      `${this.helperService.constants.apiRoutes.addHazard}`, data);
  }

  getHazards() {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.get,
      `${this.helperService.constants.apiRoutes.hazardList}`);
  }

  allHazards() {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.get,
      `${this.helperService.constants.apiRoutes.allHazards}`);
  }
}
