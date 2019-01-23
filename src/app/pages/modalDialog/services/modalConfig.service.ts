import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from 'src/app/shared/constant/constant.service';

@Injectable({
  providedIn: 'root'
})
export class ModalConfigService {

  constructor(
    private http: HttpClient) { }

  changePassword(id, data) {
    return this.http.put(`${ConstantService.apiRoutes.changePassword}/${id}/`, data);
  }
}
