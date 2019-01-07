import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// services
import { TranslateService } from '@ngx-translate/core';
import { LoginRegistrationService } from '../../services/LoginRegistrationService';
import { loginCredentials } from 'src/app/models/user.model';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { Translation } from 'src/app/models/translate.model';


@Component({
  templateUrl: 'login.component.html',
  selector: 'app-login',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean;
  data: any;
  translated: Translation;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public loginService: LoginRegistrationService,
    public translate: TranslateService,
    public toastProvider: ToastService,
    private logging: LoggingService
  ) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER']).subscribe((values) => {
      this.translated = values;
    });
    this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.LOGIN_COMPONENT);
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.email]
    });
  }

  ngOnDestroy() {
    this.logging.hideAllAppLoggers()
  }

  /**
   * in this function loginform controls are checked whether they are valid or not and this is basically builtin fucntionality
   */
  get formValidation() { return this.loginForm.controls; }
  /**
   * this function is used when we click on the login button then first of all it is checked that whether the form data is
   * valid or not if its invalid then its returned and if this is valid then the loginfrom data is sent to the api and if
   * the data we get then a token is assigned and we save it in the localstorage and then navigate to the dashboard page
   * and loading is used to disable the sign up button when the loader is in progress
   */
  onSubmit({ value, valid }: { value: loginCredentials; valid: boolean }): void {

    if (!valid) {
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.WARNING, valid);
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.CREDENTIAL_REQ);
      return;
    }
    this.loading = true;
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.INFO, valid);
    this.logging.appLogger(this.translated.LOGGER.STATUS.INFO, JSON.stringify(value));
    this.loginService.loginUser(value)
      .subscribe(
        (data) => {
          this.data = data;
          this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.LOGGEDIN);
          data ? this.loginService.setToken(this.data.token) : this.loginService.setToken('');
          this.toastProvider.createSuccessToaster(this.translated.MESSAGES.LOGIN_SUCCESS, this.translated.MESSAGES.LOGIN_MSG);
          this.router.navigate(['/home']);
        },
        (error) => {
          this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.ERROR, `${error.error.non_field_errors[0] + this.translated.LOGGER.MESSAGES.STATUS + error.status}`);
          this.loading = false;
          this.toastProvider.createErrorToaster(this.translated.MESSAGES.LOGIN_FAIL, this.translated.MESSAGES.LOGINFAIL_MSG);
        }
      );
  }
}
