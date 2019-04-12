import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ForgotPasswordComp} from 'src/app/models/loginRegistration/forgotPassword.model';
import {LoginRegistrationService} from 'src/app/pages/loginRegistration/services/LoginRegistrationService';
import {FormErrorHandler} from 'src/app/shared/FormErrorHandler/FormErrorHandler';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {ForgotPassword} from 'src/app/models/user.model';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgotPassword.component.html',
  styleUrls: ['./forgotPassword.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPassObj: ForgotPasswordComp = <ForgotPasswordComp>{};

  constructor(
    public forgotService: LoginRegistrationService,
    public formBuilder: FormBuilder,
    public helperService: HelperService,
  ) {
    this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
      this.helperService.translated.LOGGER.MESSAGES.FORGOT_COMPONENT);
    this.forgotPassObj.formErrorMatcher = new FormErrorHandler();
  }

  ngOnInit() {
    this.forgotPassObj.forgotPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnDestroy() {
    this.helperService.hideLoggers();
  }

  /**
   * this function is used to validate the email if user forgets the password
   * @params group
   */
  checkEmail(group) {
    this.forgotPassObj.email = this.formBuilder.group({
      'email': [group.value.email, Validators.email]
    });
    if (this.forgotPassObj.email.status === this.helperService.appConstants.emailValid) {
      const email = {email: group.value.email};
      this.forgotService.checkEmail(email).pipe().subscribe((res) => {
        this.forgotPassObj.success = res;
        if (this.forgotPassObj.success.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          group.controls.email.setErrors({exists: true});
        }
      });
    } else {
      group.controls.email.setErrors({invalid: true});
    }
  }

  /**
   * in this function login form controls are checked whether they are valid or not and this is basically builtin fucntionality
   */
  get formValidation() {
    return this.forgotPassObj.forgotPassForm.controls;
  }

  /**
   * in this function when the user clicks on the reset button on the forgot password page then the reset password email is
   * sent to the user.and then navigates to the login page
   */
  onSubmit({value, valid}: { value: ForgotPassword; valid: boolean }): void {
    if (!valid) {
      this.helperService.appLoggerDev(this.helperService.constants.status.WARNING, valid);
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.LOGGER.MESSAGES.FORGOT_REQ);
      return;
    }
    this.helperService.appLoggerDev(this.helperService.constants.status.INFO, valid);
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(value));
    this.forgotService.forgotPassword(value).subscribe(
      data => {
        let res = data;
        if (res.responseDetails.code !== this.helperService.appConstants.codeValidations[1]) {
          this.helperService.createSnack(this.helperService.translated.MESSAGES.RESET_SUCCESS,
            this.helperService.translated.MESSAGES.RESETMSG, this.helperService.constants.status.SUCCESS);
          this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS,
            this.helperService.translated.LOGGER.MESSAGES.FORGOTSUCCESS);
          this.helperService.navigateTo([this.helperService.appConstants.paths.home]);
        }
      },
      error => {
        this.helperService.appLoggerDev(this.helperService.constants.status.ERROR,
          `${this.helperService.translated.LOGGER.MESSAGES.STATUS + error.status}`);
        this.helperService.createSnack(this.helperService.translated.MESSAGES.RESET_SUCCESS,
          this.helperService.translated.MESSAGES.RESETMSG, this.helperService.constants.status.ERROR);

      }
    );

  }

}

