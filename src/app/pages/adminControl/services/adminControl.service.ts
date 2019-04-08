import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {entity, joinEntity} from 'src/app/models/entity.model';
import {map, catchError} from 'rxjs/operators';
import {CoreService} from 'src/app/core/services/authorization/core.service';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {InviteTeamData, InviteTeamResponse} from 'src/app/models/inviteUser.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminControlService {
  method: any;
  public inviteTeamResponse$: Observable<InviteTeamResponse>

  constructor(
    private http: HttpClient,
    public coreServices: CoreService,
    private helperService: HelperService
  ) {
    this.method = this.helperService.constants.apiMethod

  }

  createEntity(data: entity) {
    return this.http.post(this.helperService.constants.apiRoutes.createEntity, data).pipe(catchError(this.coreServices.handleError));
  }

  viewEntities(data: any) {
    return this.http.post(this.helperService.constants.apiRoutes.viewAllEntities, data).pipe(catchError(this.coreServices.handleError));
  }

  joinEntity(data: joinEntity) {
    return this.http.post(this.helperService.constants.apiRoutes.joinEntity, data).pipe(catchError(this.coreServices.handleError));
  }

  inviteTeam(data: InviteTeamData): Observable<InviteTeamResponse> {
    this.inviteTeamResponse$ = this.helperService.requestCall(this.method.post, this.helperService.constants.apiRoutes.inviteTeam, data);
    return this.inviteTeamResponse$;
  }


}
