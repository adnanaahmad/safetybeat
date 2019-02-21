import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { UserProfile } from 'src/app/models/profile.model';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getUser(id) {
    return this.http.get<UserProfile>(`${ConstantService.apiRoutes.user}/${id}`);
  }

  editUser(id, data) {
    return this.http.put<UserProfile>(`${ConstantService.apiRoutes.editProfile}/${id}/`, data);
  }
  getResponse(data) {
    console.log('get response logger for mehar RP', data)
    return this.http.post(ConstantService.apiRoutes.getInvite, data);
  }
  // createEntity() {
  //   var data = {
  //     moduleName: "Safetybeat",
  //     entityData: {
  //       name: "mixin",
  //       headOffice: "356 umer block A.I.T Lahore",
  //       status: true
  //     }
  //   }
  //   return this.http.post(ConstantService.apiRoutes.createEntity, data);
  // }
}
