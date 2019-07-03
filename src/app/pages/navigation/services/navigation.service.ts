import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Router, NavigationEnd, Event} from '@angular/router';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {EntityUserData} from '../../../models/userEntityData.model';
import {User} from '../../../models/user.model';

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
  private doc = new BehaviorSubject<any>(1);
  newDoc = this.doc.asObservable();
  private folder = new BehaviorSubject<any>(1);
  allFoldersList = this.folder.asObservable();


  constructor(
    private router: Router,
    public helperService: HelperService) {
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
    return this.helperService.requestCall(this.helperService.constants.apiMethod.post,
      this.helperService.constants.apiRoutes.checkEmail, email);
  }

  /**
   * this api function return all the roles form db.
   */

  getRoles() {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.get, this.helperService.constants.apiRoutes.getRoles);
  }

  /**
   * this function is used for inviting the user to the particular entity.
   * @params data
   */

  inviteUser(data) {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.post,
      this.helperService.constants.apiRoutes.getInvite, data);
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

  changeEntites(entitiesInfo: EntityUserData) {
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
    return this.helperService.requestCall(this.helperService.constants.apiMethod.get, this.helperService.constants.apiRoutes.logout);
  }

  updateCurrentUser(data: User) {
    this.currentUser.next(data);
  };

  getDocuments(data: object) {
    return this.helperService.requestCall(
      this.helperService.constants.apiMethod.post,
      this.helperService.constants.apiRoutes.getAllDocuments,
      data
    );
  }

  getRootDocuments(data: object) {
    return this.helperService.requestCall(
      this.helperService.constants.apiMethod.post,
      this.helperService.constants.apiRoutes.getRootDocuments, data
    );
  }

  uploadDocuments(data: object) {
    return this.helperService.requestCall(
      this.helperService.constants.apiMethod.post,
      this.helperService.constants.apiRoutes.documents,
      data
    );
  }

  allFolders(data) {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.post,
      this.helperService.constants.apiRoutes.getFolders,
      data);
  }

  createFolder(data) {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.post,
      this.helperService.constants.apiRoutes.createFolder, data);
  }

  renameFolder(id, data) {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.put,
      `${this.helperService.constants.apiRoutes.createFolder}${id}/`, data);
  }

  deleteDoc(id) {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.delete,
      `${this.helperService.constants.apiRoutes.documents}${id}/`);
  }

  deleteFolder(id) {
    return this.helperService.requestCall(this.helperService.constants.apiMethod.delete,
      `${this.helperService.constants.apiRoutes.createFolder}${id}/`);
  }

  updateDocument(data: any) {
    this.doc.next(data);
  }

  updateFolder(data: any) {
    this.folder.next(data);
  }
}
