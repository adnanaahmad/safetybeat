import { Injectable } from '@angular/core';
import { changePassword } from 'src/app/models/profile.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from 'src/app/shared/constant/constant.service';

@Injectable({
  providedIn: 'root'
})
export class ModalConfigService {

  constructor(
    private http: HttpClient,
    private ConstantService: ConstantService) { }

  changePassword(id, data) {
    return this.http.put(`${ConstantService.apiRoutes.changePassword}/${id}/`, data);
  }
}
