import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { entity, joinEntity, entityData } from 'src/app/models/entity.model';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { map, catchError } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/authorization/core.service';
import { HelperService } from '../../../shared/helperService/helper.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Site } from '../../../models/site.model';
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

  /**
   * this function is used to...
   * @params sitesInfo
   */
  changeSites(sitesInfo:any){
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
}
