import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { entity, joinEntity } from 'src/app/models/entity.model';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { map, catchError } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/authorization/core.service';
import { BehaviorSubject } from 'rxjs';
import { HelperService } from 'src/app/shared/helperService/helper.service';
@Injectable({
  providedIn: 'root'
})
export class AdminControlService {
  method: any;
  constructor(
    private http: HttpClient,
    public coreServices: CoreService,
    private helperService:HelperService
  ) { 
    this.method = this.helperService.constants.apiMethod

  }
  createEntity(data:entity){
    return this.http.post(this.helperService.constants.apiRoutes.createEntity,data).pipe(catchError(this.coreServices.handleError));
  }

  viewEntities(data:any){
    return this.http.post(this.helperService.constants.apiRoutes.viewAllEntities,data).pipe(catchError(this.coreServices.handleError));
  }

  joinEntity(data:joinEntity){
    return this.http.post(this.helperService.constants.apiRoutes.joinEntity,data).pipe(catchError(this.coreServices.handleError));
  }

  inviteTeam(data: any) {
    return this.helperService.requestCall(this.method.post,this.helperService.constants.apiRoutes.inviteTeam,data);
  }


}
