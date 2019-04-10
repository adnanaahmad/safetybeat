import { Component, OnInit, OnDestroy, Renderer2, ViewChildren, Inject } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { Router, ActivatedRoute, NavigationCancel } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginRegistrationService } from '../../pages/loginRegistration/services/LoginRegistrationService';
import { HelperService } from 'src/app/shared/helperService/helper.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit, OnDestroy {
  translated: Translation;
  verifyForm: FormGroup;
  emaill: any;
  data: any;
  success: any;
  res: any;
  appConstants: any;
  code: string = '';
  registrationData: any;
  validationData: any;
  userEmail: any;
  mailData: any;
  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private render: Renderer2,
    private loginRegService: LoginRegistrationService,
    private route: ActivatedRoute,
    public helperService: HelperService,
    @Inject(MAT_DIALOG_DATA) public email: any,
    public dialogRef: MatDialogRef<VerificationComponent>,
  ) {
    this.translated = this.helperService.translation;
    this.appConstants = this.helperService.constants.appConstant;
    this.render.addClass(document.body, this.helperService.constants.config.theme.modalClass);
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.VERIFICATION_COMPONENT);
    this.mailData = this.email.email;
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.render.removeClass(document.body, this.helperService.constants.config.theme.modalClass);
    this.helperService.hideLoggers();
  }
  @ViewChildren('input') inputs;
  keyTab($event, value) {
    if (this.code === '') {
      this.code = value;
    } else {
      this.code = this.code + value;
    }

    let element = $event.srcElement.nextElementSibling;
    if (element == null) {
      let data = {
        'code': parseInt(this.code)
      };
      this.validateUser(data);
      return;
    } else {
      element.focus();
    }
  }

  /**
   * this function is used to validate Verify form and show error if the form field is invalid
   */
  get formValidation() {
    return this.verifyForm.controls;
  }

  /**
   * this function  verifies the user if the code matches
   * @params data
   */
  validateUser(data: any) {
    this.loginRegService.verifyCode(data).subscribe(res => {
      this.validationData = res;
      this.userEmail = this.validationData.data.data;
      if (this.validationData.responseDetails.code === '0035') {
        this.helperService.appLogger(this.translated.LOGGER.STATUS.SUCCESS, 'You have been verified');
        this.dialogRef.close();
        this.router.navigate(['/signup', { data: JSON.stringify(this.userEmail) }], { skipLocationChange: true });
      }
    }, (error) => {
      this.helperService.appLogger(this.translated.LOGGER.STATUS.ERROR, 'You have not been verified');
    });
  }

  /**
   * this function resends the code to user
   */
  resendVerification() {
    let emailData = {
      'email': this.email.email
    }
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
