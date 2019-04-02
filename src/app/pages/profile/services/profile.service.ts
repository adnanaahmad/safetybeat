import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { UserProfile } from 'src/app/models/profile.model';
import { CoreService } from 'src/app/core/services/authorization/core.service';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private orgUsers = new BehaviorSubject<any>(1);
  usersData = this.orgUsers.asObservable();
  constructor(
    private http: HttpClient,
    public coreServices: CoreService) { }

  getUser() {
    return this.http.get(`${ConstantService.apiRoutes.user}`).pipe(catchError(this.coreServices.handleError));
  }

  editUser(id, data) {
    return this.http.put<UserProfile>(`${ConstantService.apiRoutes.editProfile}/${id}/`, data).pipe(catchError(this.coreServices.handleError));
  }
  getResponse(data) {
    return this.http.post(ConstantService.apiRoutes.getInvite, data).pipe(catchError(this.coreServices.handleError));
  }
  changePassword(data) {
    return this.http.put(`${ConstantService.apiRoutes.changePassword}`, data).pipe(catchError(this.coreServices.handleError));
  }
  getAllUsers() {
    return this.http.get(`${ConstantService.apiRoutes.allUsersOfOrganization}`).pipe(catchError(this.coreServices.handleError));
  }

  updateUsers(data:any){
    debugger
    this.orgUsers.next(data);
  }
}
