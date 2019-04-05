import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { entity, joinEntity } from 'src/app/models/entity.model';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { map, catchError } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/authorization/core.service';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdminControlService {
  constructor(
    private http: HttpClient,
    public coreServices: CoreService
  ) { }
  createEntity(data:entity){
    return this.http.post(ConstantService.apiRoutes.createEntity,data).pipe(catchError(this.coreServices.handleError));
  }

  viewEntities(data:any){
    return this.http.post(ConstantService.apiRoutes.viewAllEntities,data).pipe(catchError(this.coreServices.handleError));
  }

  joinEntity(data:joinEntity){
    return this.http.post(ConstantService.apiRoutes.joinEntity,data).pipe(catchError(this.coreServices.handleError));
  }


}
