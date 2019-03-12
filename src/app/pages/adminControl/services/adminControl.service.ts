import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { entity } from 'src/app/models/entity.model';
import { ConstantService } from 'src/app/shared/constant/constant.service';

@Injectable({
  providedIn: 'root'
})
export class AdminControlService {

  constructor(
    private http: HttpClient
  ) { }
  
  createEntity(data:entity){
    return this.http.post(ConstantService.apiRoutes.createEntity,data);
  }
}
