import {Component, OnInit, OnDestroy, Renderer2, ViewChildren, Inject} from '@angular/core';
import {Translation} from 'src/app/models/translate.model';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoginRegistrationService} from 'src/app/features/loginRegistration/services/LoginRegistrationService';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private render: Renderer2,
    private loginRegService: LoginRegistrationService,
    public helperService: HelperService,
    @Inject(MAT_DIALOG_DATA) public email: any,
    public dialogRef: MatDialogRef<VerificationComponent>,
  ) {
    this.translated = this.helperService.translated;
    this.appConstants = this.helperService.constants.appConstant;
    this.render.addClass(document.body, this.helperService.constants.config.theme.modalClass);
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.VERIFICATION_COMPONENT);
    this.mailData = this.email.email;
  }

  /**
   * this function is used for checking the validation of the verification form.
   */

  get formValidation() {
    return this.verifyForm.controls;
  }

  translated: Translation;
  verifyForm: FormGroup;
  data: any;
  success: any;
  res: any;
  appConstants: any;
  code: string = '';
  validationData: any;
  userEmail: any;
  mailData: any;

  @ViewChildren('input') inputs;

  ngOnInit() {
  }

  /**
   * this function is used for removing the class that we have assigned to this component
   * in the constructor and also we hide the debugging messages on the destroy of component.
   */
  ngOnDestroy() {
    this.render.removeClass(document.body, this.helperService.constants.config.theme.modalClass);
    this.helperService.hideLoggers();
  }

  /**
   * this function is used for tapping password of 6 length that user gets from his/her email.
   * @params $event
   * @params value
   */

  keyTab($event, value) {
    if (this.code === '') {
      this.code = value;
    } else {
      this.code = this.code + value;
    }

    let element = $event.srcElement.nextElementSibling;
    if (element == null) {
      let data = {
        'code': parseInt(this.code, 10)
      };
      this.validateUser(data);
      return;
    } else {
      element.focus();
    }
  }

  /**
   * this function is called when the user enters the 6 digits long password that he/she gets from his/her
   * email and after verification user goes to the sign up page.
   * @params data
   */
  validateUser(data: any) {
    this.loginRegService.verifyCode(data).subscribe(res => {
      this.validationData = res;
      this.userEmail = this.validationData.data.data;
      if (this.validationData.responseDetails.code === this.helperService.constants.appConstant.codeValidations[0]) {
        this.helperService.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.helperService.translated.MESSAGES.VERIFIED);
        this.dialogRef.close();
        this.router.navigate(['/signup', {data: JSON.stringify(this.userEmail)}], {skipLocationChange: true});
      }
    }, (error) => {
      this.helperService.appLogger(this.translated.LOGGER.STATUS.ERROR, this.helperService.translated.MESSAGES.VERIFY_ERR);
    });
  }

  /**
   * this function is used to resend the verification password if the user doesn't get the password on his/her
   * email or when the user's entered password is not valid and expired.
   */

  resendVerification() {
    let emailData = {
      'email': this.email.email
    };
    this.loginRegService.validateUser(emailData).subscribe(
      data => {
        this.helperService.appLogger(
          this.helperService.constants.status.SUCCESS,
          this.translated.LOGGER.MESSAGES.REGISTRATION_SUCCESS
        );
        this.helperService.appLogger(
          this.helperService.constants.status.SUCCESS,
          this.translated.MESSAGES.RESET_SUCCESS
        );
      },
      error => {
        this.helperService.appLogger(this.helperService.constants.status.ERROR, error.error);
        this.helperService.appLogger(this.helperService.constants.status.ERROR, this.translated.MESSAGES.BACKEND_ERROR);
      }
    );
  }
}
