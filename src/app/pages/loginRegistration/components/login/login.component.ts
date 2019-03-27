import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LoginRegistrationService } from '../../services/LoginRegistrationService';
import { loginCredentials } from 'src/app/models/user.model';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { Translation } from 'src/app/models/translate.model';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';
import { FormErrorHandler } from 'src/app/shared/FormErrorHandler/FormErrorHandler';
import { AdminControlService } from 'src/app/pages/adminControl/services/adminControl.service';
import { NavigationService } from 'src/app/pages/navigation/services/navigation.service';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  templateUrl: 'login.component.html',
  selector: 'app-login',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading: boolean;
  data: any;
  translated: Translation;
  success: any;
  showError: string;
  appConstants: any;
  formErrorMatcher: any;
  entites: any;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public loginService: LoginRegistrationService,
    public helperService: HelperService,
    private logging: LoggingService,
    private compiler: CompilerProvider,
    private adminService: AdminControlService,
    private navService: NavigationService
  ) {
    this.translated = this.helperService.translation;
    this.appConstants = this.helperService.constants.appConstant;
    this.logging.appLogger(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.LOGIN_COMPONENT);
  }
  ngOnInit() {
    if (this.loginService.getToken()) {
      this.router.navigate(['/home']);
    }
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
    this.formErrorMatcher = new FormErrorHandler();
  }

  ngOnDestroy() {
    this.logging.hideAllAppLoggers();
  }

  /**
   * in this function loginform controls are checked whether they are valid or not and this is basically builtin fucntionality
   */
  get formValidation() {
    return this.loginForm.controls;
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
      this.logging.appLoggerForDev(
        this.helperService.constants.status.WARNING,
        valid
      );
      this.logging.appLogger(
        this.helperService.constants.status.ERROR,
        this.translated.LOGGER.MESSAGES.CREDENTIAL_REQ
      );
      return;
    }
    this.loading = true;
    this.logging.appLoggerForDev(this.helperService.constants.status.INFO, valid);
    this.logging.appLogger(
      this.helperService.constants.status.INFO,
      JSON.stringify(value)
    );
    this.loginService.loginUser(value).subscribe(
      data => {
        if (data.responseDetails.code === '0000') {
          this.data = data;
          data
            ? this.loginService.setToken(this.data.data.token)
            : this.loginService.setToken('');
          var entityData = {
            'moduleName': 'Safetybeat'
          };
          this.adminService.viewEntities(entityData).subscribe((res) => {
            this.entites = res;
            let entityUserData = this.compiler.constructUserEntityData(this.entites.data);
            this.navService.changeEntites(entityUserData);
            this.logging.appLoggerForDev(
              this.helperService.constants.status.SUCCESS,
              this.translated.LOGGER.MESSAGES.LOGGEDIN
            );
            this.helperService.createToaster(this.translated.MESSAGES.LOGIN_SUCCESS, this.translated.MESSAGES.LOGIN_MSG, this.helperService.constants.status.SUCCESS);
            this.router.navigate(['/home']);
          })

        } else if (data.responseDetails.code === '0001') {
          this.logging.appLogger(
            this.helperService.constants.status.ERROR,
            data.responseDetails.message
          );
          this.logging.appLoggerForDev(
            this.helperService.constants.status.ERROR,
            data.responseDetails.message
          );
          this.loading = false;
        } else if (data.responseDetails.code === '0002') {
          this.logging.appLoggerForDev(
            this.helperService.constants.status.ERROR,
            data.responseDetails.message
          );
          this.logging.appLogger(
            this.helperService.constants.status.ERROR,
            data.responseDetails.message
          );
          this.loading = false;
        }
      },
      error => {
        this.logging.appLogger(this.helperService.constants.status.ERROR, error);
        this.loading = false;
        this.helperService.createToaster(
          this.translated.MESSAGES.LOGIN_FAIL,
          this.translated.MESSAGES.LOGINFAIL_MSG,
          this.helperService.constants.status.ERROR
        );
      }
    );
  }
}
