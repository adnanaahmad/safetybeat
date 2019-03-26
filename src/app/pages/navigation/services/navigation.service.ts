import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd, Event } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from '../../../shared/constant/constant.service';
import { map, catchError } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/authorization/core.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  public sideNav: any;
  public currentUrl = new BehaviorSubject<string>(undefined);

  constructor(
    private http: HttpClient,
    private router: Router,
    public coreServices: CoreService) {
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
    return this.http.post(ConstantService.apiRoutes.checkEmail, email).pipe(catchError(this.coreServices.handleError));
  }
  getRoles() {
    return this.http.get(ConstantService.apiRoutes.getRoles).pipe(catchError(this.coreServices.handleError));
  }
  inviteUser(data) {
    return this.http.post(ConstantService.apiRoutes.getInvite, data).pipe(catchError(this.coreServices.handleError));
  }

}
