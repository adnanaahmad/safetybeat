import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {LoginRegistrationService} from 'src/app/features/loginRegistration/services/LoginRegistrationService';
import {loginCredentials, PackageInfo} from 'src/app/models/user.model';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {Login} from 'src/app/models/loginRegistration/login.model';
import {Breakpoints, BreakpointObserver} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';

@Component({
  templateUrl: 'login.component.html',
  selector: 'app-login',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
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
    this.navService.packageData.subscribe(
      (packageDataResult) => {
        if (packageDataResult !== 1) {
          this.changeRoutes(packageDataResult.expired);
        } else if (this.loginService.getToken()) {
          let self = this;
          this.navService.getPackageInfo().subscribe(res => {
            let packageData = res.data;
            let index = this.helperService.findIndex(packageData, function (packageVal: PackageInfo) {
              return packageVal.module === self.helperService.appConstants.moduleName;
            });
            this.navService.updatePackageInfo(packageData[index]);
            this.changeRoutes(packageData[index].expired);
          });
        }
      });
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

  ngOnDestroy() {
    this.helperService.hideLoggers();
    this.loginObj.subscription.unsubscribe();
  }

  /**
   * in this function loginform controls are checked whether they are valid or not and this is basically builtin functionality
   */
  get formValidation() {
    return this.loginObj.loginForm.controls;
  }

  permissionBasedNavigation() {
    this.loginObj.subscription = this.navService.entityPermissions.subscribe((res) => {
      if (res !== 1) {
        res.dashboard ? this.router.navigate(['home/adminControl/dashboard']) : this.router.navigate(['home/adminControl/entityControl']);
      }
    })
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
        this.helperService.translated.LOGGER.MESSAGES.CREDENTIAL_REQ,
        this.helperService.constants.status.ERROR
      );
      return;
    }
    this.loginObj.loading = true;
    this.loginService.loginUser(value).subscribe(
      data => {
        if (data && data.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.loginObj.data = data;
          data
            ? this.loginService.setToken(this.loginObj.data.data.token)
            : this.loginService.setToken('');
          let userData = this.compiler.constructUserData(this.loginObj.data);
          this.navService.updateCurrentUser(userData.user);
          let self = this;
          let index = this.helperService.findIndex(userData.packageInfo, function (packageVal: PackageInfo) {
            return packageVal.module === self.helperService.appConstants.moduleName;
          });
          this.navService.updatePackageInfo(userData.packageInfo[index]);
          localStorage.setItem(this.helperService.constants.localStorageKeys.packageInfo, this.helperService.encrypt
          (JSON.stringify(userData.packageInfo), this.helperService.appConstants.key).toString()); // Store package data in local storage
          let entityData = {
            'moduleName': this.helperService.appConstants.moduleName
          };
          this.adminService.viewEntities(entityData).subscribe((res) => {
            if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
              this.loginObj.entities = res;
              let entityUserData = this.compiler.constructUserEntityData(this.loginObj.entities.data);
              this.navService.changeEntites(entityUserData);
              this.helperService.createSnack(this.helperService.translated.MESSAGES.LOGIN_SUCCESS,
                this.helperService.constants.status.SUCCESS);
              this.loginObj.loading = false;
              this.permissionBasedNavigation();
            } else {
              this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR);
            }
          }, (err) => {
            this.helperService.createSnack(err.error, this.helperService.constants.status.ERROR);
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
        }
      }, (error) => {
        this.loginObj.loading = false;
        this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
      });
  }
}
