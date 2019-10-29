import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {LoginRegistrationService} from 'src/app/features/loginRegistration/services/LoginRegistrationService';
import {loginCredentials, LoginResponse, PackageInfo} from 'src/app/models/user.model';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {Login} from 'src/app/models/loginRegistration/login.model';
import {Breakpoints, BreakpointObserver} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {EntityUserData} from 'src/app/models/userEntityData.model';

@Component({
  templateUrl: 'login.component.html',
  selector: 'app-login',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginObj: Login = <Login>{};
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return [
          {title: 'particleContainer', cols: 2, rows: 1},
          {title: 'loginForm', cols: 2, rows: 1}
        ];
      } else {
        return [
          {title: 'particleContainer', cols: 1, rows: 2},
          {title: 'loginForm', cols: 1, rows: 2}
        ];
      }
    })
  );

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public loginService: LoginRegistrationService,
    public helperService: HelperService,
    private compiler: CompilerProvider,
    private breakpointObserver: BreakpointObserver,
    private adminService: AdminControlService,
    private navService: NavigationService
  ) {
    localStorage.clear();
  }

  /**
   * this function is called on the initialization of the component and this function is used for making the loginForm input fields
   * and gives validations to these input fields.
   */

  ngOnInit() {
    this.loginObj.loginForm = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  /**
   * this function is used for hiding the debugging messages on the destroy of this component.
   */

  changeRoutes(expired: boolean) {
    if (this.loginService.getToken()) {
      (expired) ? this.helperService.navigateTo([this.helperService.appConstants.paths.package]) :
        this.helperService.navigateTo([this.helperService.appConstants.paths.home]);
    }
  }

  /**
   * in this function loginform controls are checked whether they are valid or not and this is basically builtin functionality
   */
  get formValidation() {
    return this.loginObj.loginForm.controls;
  }

  /**
   * this function is used when we click on the login button then first of all it is checked that whether the form data is
   * valid or not if its invalid then its returned and if this is valid then the loginfrom data is sent to the api and if
   * the data we get then a token is assigned and we save it in the localstorage and then navigate to the dashboard page
   * and loading is used to disable the sign up button when the loader is in progress
   */
  onSubmit({value, valid}: { value: loginCredentials; valid: boolean; }): void {
    if (!valid) {
      this.helperService.createSnack(
        this.helperService.translated.LOGGER.MESSAGES.CREDENTIAL_REQ, this.helperService.constants.status.ERROR);
      return;
    }
    this.loginObj.loading = true;
    this.loginService.loginUser(value).subscribe(
      (data) => {
        if (data && data.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.loginObj.data = data;
          data ? this.loginService.setToken(this.loginObj.data.data.token) : this.loginService.setToken('');
          this.loginObj.userData = this.compiler.constructUserData(this.loginObj.data);
          this.navService.updateCurrentUser(this.loginObj.userData.user);
          let self = this;
          this.loginObj.index = this.helperService.findIndex(this.loginObj.userData.packageInfo, function (packageVal: PackageInfo) {
            return packageVal.module === self.helperService.appConstants.moduleName;
          });
          this.navService.updatePackageInfo(this.loginObj.userData.packageInfo[this.loginObj.index]);
          localStorage.setItem(this.helperService.constants.localStorageKeys.packageInfo,
            this.helperService.encrypt(JSON.stringify(this.loginObj.userData.packageInfo),
              this.helperService.appConstants.key).toString()); // Store package data in local storage
          let entityData = {
            'moduleName': this.helperService.appConstants.moduleName
          };
          this.adminService.viewEntities(entityData).subscribe((res) => {
            if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
              this.loginObj.entities = res;
              this.loginObj.entityUserData = this.compiler.constructUserEntityData(this.loginObj.entities.data.allEntities);
              this.navService.changeEntites(this.loginObj.entityUserData);
              this.permissionBasedNavigation(this.loginObj.entityUserData,
                this.loginObj.userData.packageInfo[this.loginObj.index].expired, this.loginObj.data);
              this.loginObj.loading = false;
            } else {
              this.loginObj.loading = false;
              this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR);
            }
          }, (err) => {
            this.loginObj.loading = false;
            this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
          });
        } else if (data && data.responseDetails.code === this.helperService.appConstants.codeValidations[1]) {
          this.helperService.createSnack(
            data.responseDetails.message,
            this.helperService.constants.status.ERROR
          );
          this.loginObj.loading = false;
          this.helperService.createSnack(data.responseDetails.message, this.helperService.constants.status.WARNING);
        } else if (data && data.responseDetails.code === this.helperService.appConstants.codeValidations[2]) {
          this.helperService.createSnack(
            data.responseDetails.message,
            this.helperService.constants.status.ERROR
          );
          this.loginObj.loading = false;
          this.helperService.createSnack(data.responseDetails.message, this.helperService.constants.status.WARNING);
        } else {
          this.loginObj.loading = false;
          this.helperService.createSnack(data.responseDetails.message, this.helperService.constants.status.ERROR);
        }
      }, (error) => {
        this.loginObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      });
  }

  permissionBasedNavigation(data: EntityUserData, expired: boolean, loginData: LoginResponse) {
    this.helperService.createSnack(this.helperService.translated.MESSAGES.LOGIN_SUCCESS,
      this.helperService.constants.status.SUCCESS);
    if (loginData.data.firstLogin) {
      this.router.navigate(['updateProfile']);
    } else {
      if (data.entities.length === 0) {
        this.router.navigate(['welcomeScreen/entityCreation']);
      } else {
        let index = this.helperService.findIndex(data.entities, function (entity) {
          return entity.active === true;
        });
        this.loginObj.selectedEntity = index !== -1 ? data.entities[index] : data.entities[0];
        this.navService.changeSelectedEntity(this.loginObj.selectedEntity);
        if (expired) {
          this.helperService.navigateTo([this.helperService.appConstants.paths.package]);
        } else {
          this.loginObj.selectedEntity.permissions.dashboard ? this.router.navigate(['home/adminControl/dashboard']) :
            this.router.navigate(['home/adminControl/entityControl']);
        }
      }
    }

  }
}
