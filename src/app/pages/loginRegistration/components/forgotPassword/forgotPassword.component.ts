import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ForgotPassword } from 'src/app/models/user.model';
import { LoginRegistrationService } from '../../services/LoginRegistrationService';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { Translation } from 'src/app/models/translate.model';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { FormErrorHandler } from 'src/app/shared/FormErrorHandler/FormErrorHandler';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgotPassword.component.html',
  styleUrls: ['./forgotPassword.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPassForm: FormGroup;
  translated: Translation;
  selectedTheme: String;
  showError: string;
  email: FormGroup;
  success: any;
  appConstants: any;
  formErrorMatcher: any;
  constructor(
    public forgotService: LoginRegistrationService,
    private router: Router,
    public formBuilder: FormBuilder,
    public translate: TranslateService,
    private logging: LoggingService,
    public toastProvider: ToastService,
    public constantProvider: ConstantService
  ) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER', 'ICONS', 'STRINGS']).subscribe((values) => {
      this.translated = values;
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.FORGOT_COMPONENT);
    });
    this.appConstants = ConstantService.appConstant;
    this.formErrorMatcher = new FormErrorHandler();
  }
  ngOnInit() {
    this.forgotPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  ngOnDestroy() {
    this.logging.hideAllAppLoggers();
  }
  checkEmail(group) {
    this.email = this.formBuilder.group({
      'email': [group.value.email, Validators.email]
    });
    if (this.email.status === 'VALID') {
      const email = { email: group.value.email };
      this.forgotService.checkEmail(email).pipe().subscribe((res) => {
        this.success = res;
        if (this.success.status) {
          group.controls.email.setErrors({ exists: true })
        }
      });
    }
  }
  /**
   * in this function loginform controls are checked whether they are valid or not and this is basically builtin fucntionality
   */
  get formValidation() { return this.forgotPassForm.controls; }
  /**
   * in this function when the user clicks on the reset button on the forgot password page then the reset password email is
   * sent to the user.and then navigates to the login page
   */
  onSubmit({ value, valid }: { value: ForgotPassword; valid: boolean }): void {
    if (!valid) {
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.WARNING, valid);
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.FORGOT_REQ);
      return;
    }
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.INFO, valid);
    this.logging.appLogger(this.translated.LOGGER.STATUS.INFO, JSON.stringify(value));
    // this.checkEmail(value);
    this.forgotService.forgotPassword(value).subscribe(
      data => {
        this.toastProvider.createSuccessToaster(this.translated.MESSAGES.RESET_SUCCESS, this.translated.MESSAGES.RESETMSG);
        this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.FORGOTSUCCESS);
        this.router.navigate(['/login']);
      },
      error => {
        this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.ERROR, `${this.translated.LOGGER.MESSAGES.STATUS + error.status}`);
        this.toastProvider.createErrorToaster(this.translated.MESSAGES.RESETFAIL, this.translated.MESSAGES.RESETFAIL_MSG);
      }
    );

  }

}

