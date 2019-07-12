import {InviteTeamData, InviteTeamResponse} from 'src/app/models/adminControl/inviteUser.model';
import {Injectable} from '@angular/core';
import {entity, joinEntity} from 'src/app/models/entity.model';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {Observable, BehaviorSubject} from 'rxjs';
import {ViewAllEntitiesResponse} from 'src/app/models/adminControl/entityControl.model';
import {CreateEntityResponse} from 'src/app/models/adminControl/createEntity.model';
import {AllHazardsApiData, AllHazardsApiResponseData, DeleteHazardApiResponse, Hazard, RiskType} from 'src/app/models/hazard.model';
import {AllTeamsApiResponse, GetAllTeamsData, TeamList} from 'src/app/models/adminControl/myTeam.model';
import {
  AddSiteApiResponse,
  AddSiteData, PaginationData,
  ViewAllSiteEntityData, ViewAllSitesApiResponse,
} from 'src/app/models/site.model';

@Injectable({
  providedIn: 'root'
})
export class AdminControlService {
  apiRoutes: any;
  method: any;
  private sites = new BehaviorSubject<any>(1);
  siteObserver = this.sites.asObservable();

  constructor(public helperService: HelperService) {
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
  createEntity(data: entity): Observable<CreateEntityResponse> {
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
  viewEntities(data: object): Observable<ViewAllEntitiesResponse> {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.viewAllEntities,
      data
    );
  }

  viewEntitiesOfUser(data: object) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.viewAllEntitiesOfUser,
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
  viewSites(entityData: ViewAllSiteEntityData, paginationData: PaginationData): Observable<ViewAllSitesApiResponse> {
    return this.helperService.requestCall(
      this.method.post,
      `${this.apiRoutes.viewAllSites}?limit=${paginationData.limit}&offset=${paginationData.offset}&search=${paginationData.search}`,
      entityData
    );
  }


  getSiteList(data: object) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.getAllSites,
      data
    );
  }

  /**
   * this function is used to return the addSite api response.
   * @params data
   */
  addSite(data: AddSiteData): Observable<AddSiteApiResponse> {
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
    return this.helperService.requestCall(this.method.post, this.helperService.constants.apiRoutes.inviteTeam, data);
  }

  /**
   * this function is used to delete the entity using the entityId and return response.
   * @params id
   */

  deleteEntity(id) {
    return this.helperService.requestCall(this.method.delete, `${this.apiRoutes.editEntity}
/${id}
/`);
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

  viewSiteInfo(id
                 :
                 number
  ) {
    return this.helperService.requestCall(
      this.method.get,
      `${this.apiRoutes.viewSiteInfo}${id}/`
    );
  }

  deleteSite(id
               :
               number
  ) {
    return this.helperService.requestCall(
      this.method.delete,
      `${this.apiRoutes.viewSiteInfo}${id}/`
    );
  }

  editSite(id
             :
             number, data
  ):
    Observable<AddSiteApiResponse> {
    return this.helperService.requestCall(
      this.method.put,
      `${this.apiRoutes.viewSiteInfo}${id}/`,
      data
    );
  }

  addHazard(data)
    :
    Observable<AllHazardsApiData> {
    return this.helperService.requestCall(
      this.helperService.constants.apiMethod.post,
      `${this.apiRoutes.viewHazardInfo}`,
      data
    );
  }

  editHazard(id
               :
               number, data
  ) {
    return this.helperService.requestCall(
      this.method.put,
      `${this.apiRoutes.viewHazardInfo}${id}/`,
      data
    );
  }

  deleteHazard(id
                 :
                 number
  ):
    Observable<DeleteHazardApiResponse> {
    return this.helperService.requestCall(
      this.method.delete,
      `${this.apiRoutes.viewHazardInfo}${id}/`,
    );
  }


  getRisks()
    :
    Observable<Array<RiskType>> {
    return this.helperService.requestCall(
      this.helperService.constants.apiMethod.get,
      `${this.apiRoutes.riskList}`
    );
  }

  allHazards(entityData: ViewAllSiteEntityData, paginationData: PaginationData): Observable<AllHazardsApiData> {
    return this.helperService.requestCall(
      this.method.post,
      `${this.apiRoutes.allHazards}?limit=${paginationData.limit}&offset=${paginationData.offset}&search=${paginationData.search}`,
      entityData
    );
  }

  allConnections(data) {
    return this.helperService.requestCall(
      this.helperService.constants.apiMethod.post,
      this.apiRoutes.viewAllConnections,
      data
    );
  }

  registerTeam(data) {
    return this.helperService.requestCall(
      this.helperService.constants.apiMethod.post,
      this.apiRoutes.team,
      data
    );
  }

  deleteTeam(id
               :
               number
  ) {
    return this.helperService.requestCall(
      this.method.delete,
      `${this.apiRoutes.team}${id}/`
    );
  }

  allTeamsData(data
                 :
                 GetAllTeamsData
  ):
    Observable<AllTeamsApiResponse> {
    return this.helperService.requestCall(
      this.helperService.constants.apiMethod.post,
      this.apiRoutes.viewAllTeams,
      data
    );
  }

  editTeam(id
             :
             number, data
  ) {
    return this.helperService.requestCall(
      this.method.put,
      `${this.apiRoutes.team}${id}/`,
      data
    );
  }

}
