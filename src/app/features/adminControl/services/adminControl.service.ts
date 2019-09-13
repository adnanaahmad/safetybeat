import {InviteTeamData, InviteTeamResponse} from 'src/app/models/adminControl/inviteUser.model';
import {Injectable} from '@angular/core';
import {entity, joinEntity} from 'src/app/models/entity.model';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {Observable, BehaviorSubject} from 'rxjs';
import {CheckInTypesCat, RefreshEntityCodeResponse, ViewAllEntitiesResponse} from 'src/app/models/adminControl/entityControl.model';
import {CreateEntityResponse} from 'src/app/models/adminControl/createEntity.model';
import {AllHazardsApiData, AllHazardsApiResponseData, DeleteHazardApiResponse, Hazard, RiskType} from 'src/app/models/hazard.model';
import {AllTeamsApiResponse, GetAllTeamsData, TeamList} from 'src/app/models/adminControl/myTeam.model';

import {
  AddSiteApiResponse,
  AddSiteData, PaginationData, RefreshSiteCodeApiResponse, sendSiteCodeApiData, SendSiteCodeApiResponse,
  ViewAllSiteEntityData, ViewAllSitesApiResponse, ViewAllSiteArchivedData
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

  checkInTypes(entityId: object) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.getCheckInTypes,
      entityId
    );
  }

    pulseTypes(entityId: object) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.getPulseTypes,
      entityId
    );
  }

  addCheckInTypes(data: object) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.checkInType,
      data
    );
  }

  addPulseTypes(data: object) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.pulseType,
      data
    );
  }

  deleteCheckInType(id: number) {
    return this.helperService.requestCall(
      this.method.delete,
      `${this.apiRoutes.checkInTypeEntity}${id}/`
    );
  }

  deletePulseType(id: number) {
    return this.helperService.requestCall(
      this.method.delete,
      `${this.apiRoutes.sendPulseTypeEntity}${id}/`
    );
  }

  /**
   * this function is used for getting all the entities information with pagination data.
   * @params data
   * @params paginationData
   */

  viewAllEntitiesWithPagination(data: object, paginationData: PaginationData): Observable<ViewAllEntitiesResponse> {
    return this.helperService.requestCall(
      this.method.post,
      `${this.apiRoutes.viewAllEntities}?limit=${paginationData.limit}&offset=${paginationData.offset}&search=${paginationData.search}`,
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

  /**
   * this function is used to return the response for archived viewAllSites api call.
   * @params data
   */
  viewArchivedSites(entityData: ViewAllSiteArchivedData, paginationData: PaginationData): Observable<ViewAllSitesApiResponse> {
    return this.helperService.requestCall(
      this.method.post,
      `${this.apiRoutes.viewAllSites}?limit=${paginationData.limit}&offset=${paginationData.offset}&search=${paginationData.search}`,
      entityData
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
    return this.helperService.requestCall(this.method.delete, `${this.apiRoutes.editEntity}/${id}/`);
  }

  /**
   * this function is used to archive the entity using the entityId and return response.
   * @params id
   */

  archiveEntity(id:number) {
    const data = {"id": id};
    return this.helperService.requestCall(
      this.method.put,
      `${this.apiRoutes.archiveEntity}`,
      data
    );
  }

   /**
   * this function is used to unarchive the entity using the entityId and return response.
   * @params id
   */

  unarchiveEntity(id:number) {
    const data = {"id": id};
    return this.helperService.requestCall(
      this.method.put,
      `${this.apiRoutes.unarchiveEntity}`,
      data
    );
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

  deleteSite(id:number) {
    const data = {"id": id};
    return this.helperService.requestCall(
      this.method.put,
      `${this.apiRoutes.archiveSite}`,
      data
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

  deleteHazard(id:number) {
    const data = {"id": id};
    return this.helperService.requestCall(
      this.method.put,
      `${this.apiRoutes.archiveHazard}`,
      data
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

  allConnections(data, paginationData: PaginationData) {
    return this.helperService.requestCall(
      this.method.post,
      `${this.apiRoutes.viewAllConnections}?limit=${paginationData.limit}&offset=${paginationData.offset}&search=${paginationData.search}`,
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

  archiveTeam(id:number) {
    const data = {"id": id};
    return this.helperService.requestCall(
      this.method.put,
      `${this.apiRoutes.archiveTeam}`,
      data
    );
  }

  unarchiveTeam(id:number) {
    const data = {"id": id};
    return this.helperService.requestCall(
      this.method.put,
      `${this.apiRoutes.unarchiveTeam}`,
      data
    );
  }

  allTeamsData(entityData: GetAllTeamsData, paginationData: PaginationData): Observable<AllTeamsApiResponse> {
    return this.helperService.requestCall(
      this.helperService.constants.apiMethod.post,
      `${this.apiRoutes.viewAllTeams}?limit=${paginationData.limit}&offset=${paginationData.offset}&search=${paginationData.search}`,
      entityData
    );
  }

  editTeam(id: number, data) {
    return this.helperService.requestCall(
      this.method.put,
      `${this.apiRoutes.team}${id}/`,
      data
    );
  }

  sendSiteCode(data: sendSiteCodeApiData): Observable<SendSiteCodeApiResponse> {
    return this.helperService.requestCall(this.method.post, this.helperService.constants.apiRoutes.sendSiteCode, data);
  }

  refreshSiteCode(data: object): Observable<RefreshSiteCodeApiResponse> {
    return this.helperService.requestCall(this.method.post, this.helperService.constants.apiRoutes.refreshSiteCode, data);
  }

  refreshEntityCode(data: object): Observable<RefreshEntityCodeResponse> {
    return this.helperService.requestCall(this.method.post, this.helperService.constants.apiRoutes.refreshEntityCode, data);
  }
}
