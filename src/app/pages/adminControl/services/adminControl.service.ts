import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { entity, joinEntity, entityData } from 'src/app/models/entity.model';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { map, catchError } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/authorization/core.service';
import { HelperService } from '../../../shared/helperService/helper.service';
import { Observable, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdminControlService {
  apiRoutes: any;
  method: { get: string; post: string; put: string; delete: string };
  private sites = new BehaviorSubject<any>(1);
  siteObserver = this.sites.asObservable();
  constructor(public helperService: HelperService) { 
    this.apiRoutes = this.helperService.constants.apiRoutes;
    this.method = this.helperService.constants.apiMethod;
  }

  changeSites(sitesInfo:any){
    this.sites.next(sitesInfo)
  }

  createEntity(data: entity) {
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.createEntity,
      data
    ); 
  }
  
  viewEntities(data:object){
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.viewAllEntities,
      data
    );
  }

  joinEntity(data:joinEntity){
    return this.helperService.requestCall(
     this.method.post,
     this.apiRoutes.joinEntity,
     data 
    );
  }

  viewSites(data:object){
    debugger
    return this.helperService.requestCall(
      this.method.post,
      this.apiRoutes.viewAllSites,
      data
    );
  }
}
