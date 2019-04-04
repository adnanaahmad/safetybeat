import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPassword } from 'src/app/models/user.model';
import { LoginRegistrationService } from '../../services/LoginRegistrationService';
import { Translation } from 'src/app/models/translate.model';
import { FormErrorHandler } from 'src/app/shared/FormErrorHandler/FormErrorHandler';
import { HelperService } from 'src/app/shared/helperService/helper.service';

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
    public helperService: HelperService,
  ) {
    this.translated = this.helperService.translation;
    this.appConstants = this.helperService.constants.appConstant;
    this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.FORGOT_COMPONENT);
    this.formErrorMatcher = new FormErrorHandler();
  }
  ngOnInit() {
    this.forgotPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  ngOnDestroy() {
    this.helperService.hideLoggers();
  }
  checkEmail(group) {
    this.email = this.formBuilder.group({
      'email': [group.value.email, Validators.email]
    });
    if (this.email.status === 'VALID') {
      const email = { email: group.value.email };
      this.forgotService.checkEmail(email).pipe().subscribe((res) => {
        this.success = res;
        if (this.success.responseDetails.code == '0021') {
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
      this.helperService.appLoggerDev(this.helperService.constants.status.WARNING, valid);
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.translated.LOGGER.MESSAGES.FORGOT_REQ);
      return;
    }
    this.helperService.appLoggerDev(this.helperService.constants.status.INFO, valid);
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(value));
    this.forgotService.forgotPassword(value).subscribe(
      data => {
        this.helperService.creactSnack(this.translated.MESSAGES.RESET_SUCCESS, this.translated.MESSAGES.RESETMSG,this.helperService.constants.status.SUCCESS);
        this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.FORGOTSUCCESS);
        this.router.navigate(['/login']);
      },
      error => {
        this.helperService.appLoggerDev(this.helperService.constants.status.ERROR, `${this.translated.LOGGER.MESSAGES.STATUS + error.status}`);
        this.helperService.creactSnack(this.translated.MESSAGES.RESET_SUCCESS, this.translated.MESSAGES.RESETMSG, this.helperService.constants.status.ERROR);

      }
    );

  }

}

