import {InviteTeamData, InviteTeamResponse} from 'src/app/models/inviteUser.model';
import {Injectable} from '@angular/core';
import {entity, joinEntity, entityData} from 'src/app/models/entity.model';
import {HelperService} from '../../../shared/helperService/helper.service';
import {Observable, BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminControlService {
  apiRoutes: any;
  inviteTeamResponse$: Observable<InviteTeamResponse>
  method: { get: string; post: string; put: string; delete: string };
  private sites = new BehaviorSubject<any>(1);
  siteObserver = this.sites.asObservable();

  constructor(public helperService: HelperService) {
    this.apiRoutes = this.helperService.constants.apiRoutes;
    this.method = this.helperService.constants.apiMethod;
  }

  changeSites(sitesInfo: any) {
    debugger
    this.sites.next(sitesInfo)
  }

  createEntity(data: entity) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.createEntity,
      data
    );
  }

  viewEntities(data: object) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.viewAllEntities,
      data
    );
  }

  joinEntity(data: joinEntity) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.joinEntity,
      data
    );
  }

  viewSites(data: object) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.viewAllSites,
      data
    );
  }

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


}
