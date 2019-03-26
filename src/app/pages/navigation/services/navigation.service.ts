import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router, NavigationEnd, Event } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from '../../../shared/constant/constant.service';
import { EntityUserData } from 'src/app/models/userEntityData.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  public sideNav: any;
  public currentUrl = new BehaviorSubject<string>(undefined);
  private entitySelectedRole = new BehaviorSubject<string>("default Role");
  currentRole = this.entitySelectedRole.asObservable();
  private dataSource = new BehaviorSubject<any>(1);
  data = this.dataSource.asObservable();
  private entitySelectedId = new BehaviorSubject<number>(1);
  currentRoleId = this.entitySelectedId.asObservable();
  constructor(
    private http: HttpClient,
    private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  public closeNav() {
    this.sideNav.close();
  }

  public openNav() {
    this.sideNav.open();
  }
  checkEmail(email: object) {
    return this.http.post(ConstantService.apiRoutes.checkEmail, email)
  }
  getRoles() {
    return this.http.get(ConstantService.apiRoutes.getRoles)
  }
  inviteUser(data) {
    return this.http.post(ConstantService.apiRoutes.getInvite, data)
  }
  changeRole(role:string){
    this.entitySelectedRole.next(role);
  }

  changeEntites(entitiesInfo:any){
    debugger;
    this.dataSource.next(entitiesInfo);
    console.log(this.dataSource)
  }

  changeRoleId(roleId:number){
    this.entitySelectedId.next(roleId);
  }

}
