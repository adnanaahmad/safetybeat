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
}
