import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
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
  private currentUser = new BehaviorSubject<any>(1);
  currentUserData = this.currentUser.asObservable();

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

  /**
   * this function is used for closing the side navBar.
   */
  public closeNav() {
    this.sideNav.close();
  }

  /**
   * this function is used for opening the side navBar.
   */

  public openNav() {
    this.sideNav.open();
  }

  /**
   * this function is used for checking the validity of the userEmail.whether it exists or not if exists then user can't
   * be invited again.
   * @params email
   */

  checkEmail(email: object) {
    return this.http.post(ConstantService.apiRoutes.checkEmail, email).pipe(catchError(this.coreServices.handleError));
  }

  /**
   * this api function return all the roles form db.
   */

  getRoles() {
    return this.http.get(ConstantService.apiRoutes.getRoles).pipe(catchError(this.coreServices.handleError));
  }

  /**
   * this function is used for inviting the user to the particular entity.
   * @params data
   */

  inviteUser(data) {
    return this.http.post(ConstantService.apiRoutes.getInvite, data).pipe(catchError(this.coreServices.handleError));
  }

  /**
   * this api function returns the packaged information from the db.
   */

  getPackageInfo() {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.get, this.helperService.constants.apiRoutes.packageInfo);
  }

  /**
   * this function is used for changing the role of the user when ever the entity is switched and it automatically
   * updated all the places where this observable is subscribed.
   * @params role
   */
  changeRole(role: string) {
    localStorage.setItem(this.helperService.constants.localStorageKeys.role, this.helperService.encrypt
    (role, this.helperService.appConstants.key).toString());
    this.entitySelectedRole.next(role);
  }

  /**
   * this function is used for changing the entities according to the user and it updates all the places where
   * entities information is being used.
   * @params entitiesInfo
   */

  changeEntites(entitiesInfo: any) {
    this.dataSource.next(entitiesInfo);
  }

  /**
   * this function is used for changing the roleId of the user after changing the entities.
   * @params roleId
   */

  changeRoleId(roleId: number) {
    this.entitySelectedId.next(roleId);
  }

  /**
   * this function is used for changing the selected Entity when the entity is changed from entity switcher.
   * @params data
   */

  changeSelectedEntity(data: any) {
    this.entitySelected.next(data);
  }

  /**
   * this function is used for updating the package information whenever the package information api is called.
   * @params data
   */

  updatePackageInfo(data: any) {
    this.packageInfo.next(data);
  }

  /**
   * this api function is called to logout the user and this api reponse makes the token disable and removes
   * form the db.
   */

  logoutUser() {
    return this.http.get(ConstantService.apiRoutes.logout);
  }

  updateCurrentUser(data: any) {
    this.currentUser.next(data);
  };
}
