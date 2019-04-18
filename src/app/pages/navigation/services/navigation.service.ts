import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {Router, NavigationEnd, Event} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ConstantService} from 'src/app/shared/constant/constant.service';
import {catchError} from 'rxjs/operators';
import {CoreService} from 'src/app/core/services/authorization/core.service';
import {HelperService} from '../../../shared/helperService/helper.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  public sideNav: any;
  public currentUrl = new BehaviorSubject<string>(undefined);
  private entitySelectedRole = new BehaviorSubject<string>('default Role');
  currentRole = this.entitySelectedRole.asObservable();
  private dataSource = new BehaviorSubject<any>(1);
  data = this.dataSource.asObservable();
  private entitySelectedId = new BehaviorSubject<number>(1);
  currentRoleId = this.entitySelectedId.asObservable();
  private entitySelected = new BehaviorSubject<any>(1);
  selectedEntityData = this.entitySelected.asObservable();
  private packageInfo = new BehaviorSubject<any>(1);
  packageData = this.packageInfo.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    public helperService: HelperService,
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

  getPackageInfo() {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.get, this.helperService.constants.apiRoutes.packageInfo);
  }

  changeRole(role: string) {
    localStorage.setItem(this.helperService.constants.localStorageKeys.role, this.helperService.encrypt
    (role, this.helperService.appConstants.key).toString());
    this.entitySelectedRole.next(role);
  }

  changeEntites(entitiesInfo: any) {
    this.dataSource.next(entitiesInfo);
  }

  changeRoleId(roleId: number) {
    this.entitySelectedId.next(roleId);
  }

  changeSelectedEntity(data: any) {
    this.entitySelected.next(data);
  }

  updatePackageInfo(data: any) {
    this.packageInfo.next(data);
  }

  logoutUser() {
    return this.http.get(ConstantService.apiRoutes.logout);
  }
}
