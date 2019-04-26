import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {LoginRegistrationService} from 'src/app/pages/loginRegistration/services/LoginRegistrationService';
import {loginCredentials} from 'src/app/models/user.model';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {Login} from 'src/app/models/loginRegistration/login.model';
import {ProfileService} from '../../../profile/services/profile.service';

@Component({
  templateUrl: 'login.component.html',
  selector: 'app-login',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginObj: Login = <Login>{};

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public loginService: LoginRegistrationService,
    public helperService: HelperService,
    private compiler: CompilerProvider,
    private adminService: AdminControlService,
    private navService: NavigationService,
    private profile: ProfileService
  ) {
    this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
      this.helperService.translated.LOGGER.MESSAGES.LOGIN_COMPONENT);
  }

  /**
   * this function is called on the initialization of the component and this function is used for making the loginForm input fields
   * and gives validations to these input fields.
   */

  ngOnInit() {
    if (this.loginService.getToken()) {
      this.helperService.navigateTo([this.helperService.appConstants.paths.home]);
    }
    this.loginObj.loginForm = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  /**
   * this function is used for hiding the debugging messages on the destroy of this component.
   */

  ngOnDestroy() {
    this.helperService.hideLoggers();
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
  onSubmit({
             value,
             valid
           }: {
    value: loginCredentials;
    valid: boolean;
  }): void {

    if (!valid) {
      this.helperService.appLoggerDev(
        this.helperService.constants.status.WARNING,
        valid
      );
      this.helperService.appLogger(
        this.helperService.constants.status.ERROR,
        this.helperService.translated.LOGGER.MESSAGES.CREDENTIAL_REQ
      );
      return;
    }
    this.loginObj.loading = true;
    this.helperService.appLoggerDev(this.helperService.constants.status.INFO, valid);
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(value));
    this.loginService.loginUser(value).subscribe(
      data => {
        if (data.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.loginObj.data = data;
          data
            ? this.loginService.setToken(this.loginObj.data.data.token)
            : this.loginService.setToken('');
          let userData = this.compiler.constructUserData(this.loginObj.data);
          this.profile.updateCurrenUser(userData.user);
          this.navService.updatePackageInfo(userData.packageInfo);
          localStorage.setItem(this.helperService.constants.localStorageKeys.packageInfo, this.helperService.encrypt
          (JSON.stringify(userData.packageInfo), this.helperService.appConstants.key).toString());
            let entityData = {
              'moduleName': 'Safetybeat'
            };
            this.adminService.viewEntities(entityData).subscribe((res) => {
              this.loginObj.entities = res;
              let entityUserData = this.compiler.constructUserEntityData(this.loginObj.entities.data);
              this.navService.changeEntites(entityUserData);
              this.helperService.appLoggerDev(
                this.helperService.constants.status.SUCCESS,
                this.helperService.translated.LOGGER.MESSAGES.LOGGEDIN
              );
              this.helperService.createSnack(this.helperService.translated.MESSAGES.LOGIN_SUCCESS,
                this.helperService.constants.status.SUCCESS);
              this.helperService.navigateTo([this.helperService.appConstants.paths.home]);
            }, (err) => {
            });
          // }
        } else if (data.responseDetails.code === this.helperService.appConstants.codeValidations[1]) {
          this.helperService.appLogger(
            this.helperService.constants.status.ERROR,
            data.responseDetails.message
          );
          this.helperService.appLoggerDev(
            this.helperService.constants.status.ERROR,
            data.responseDetails.message
          );
          this.helperService.createSnack(data.responseDetails.message, this.helperService.constants.status.WARNING);
          this.loginObj.loading = false;
        }
      },
      error => {
        this.helperService.appLogger(this.helperService.constants.status.ERROR, error);
        this.loginObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.LOGIN_FAIL, this.helperService.constants.status.ERROR);
      }
    );
  }
}
