import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { Router, ActivatedRoute, NavigationCancel } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Verification } from 'src/app/models/user.model';
import { LoginRegistrationService } from '../../services/LoginRegistrationService';
import { Location } from '@angular/common';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit, OnDestroy {
  translated: Translation;
  verifyForm: FormGroup;
  emaill: string;
  data: any;
  email: FormGroup;
  success: any;
  res: any;
  appConstants: any;
  constructor(
    private logging: LoggingService,
    private router: Router,
    public formBuilder: FormBuilder,
    private render: Renderer2,
    private loginRegService: LoginRegistrationService,
    private route: ActivatedRoute,
    private location: Location,
    public helperService: HelperService,
  ) {
    this.translated = this.helperService.translation;
    this.appConstants = this.helperService.constants.appConstant;
    this.render.addClass(document.body, this.helperService.constants.config.theme.background);
    this.logging.appLoggerForDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.VERIFICATION_COMPONENT);
  }

  ngOnInit() {
    this.router.events.pipe().subscribe(
      (event: NavigationCancel) => {
        this.location.replaceState('/signup');
      }
    );
    this.verifyForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.route.params.subscribe(params => {
      this.data = JSON.parse(params.data);
    })
  }

  ngOnDestroy() {
    this.render.removeClass(document.body, this.helperService.constants.config.theme.background);
    this.logging.hideAllAppLoggers();
  }

  checkEmail(group) {
    this.email = this.formBuilder.group({
      'email': [group.value.email, Validators.email]
    });
    if (this.email.status === 'VALID') {
      const email = { email: group.value.email };
      this.loginRegService.checkEmail(email).pipe().subscribe((res) => {
        this.success = res;
        if (this.success.responseDetails.code == '0020') {
          group.controls.email.setErrors({ exists: true })
        }
      });
    }
  }

  get formValidation() { return this.verifyForm.controls; }

  changeEmail({ value, valid }: { value: Verification, valid: boolean }): void {
    if (!valid) {
      this.logging.appLoggerForDev(this.helperService.constants.status.WARNING, valid);
      this.logging.appLogger(this.helperService.constants.status.ERROR, this.translated.LOGGER.MESSAGES.FORGOT_REQ);
      return;
    }
    this.logging.appLoggerForDev(this.helperService.constants.status.INFO, valid);
    this.logging.appLogger(this.helperService.constants.status.INFO, JSON.stringify(value));
    this.emaill = value.email;
    const verificationData = {
      email: value.email,
      userId: this.data.data.userId
    };
    this.loginRegService.changeEmail(verificationData).subscribe((res) => {
      this.res = res;
      this.data.data.userData.email = value.email;
      this.loginRegService.resendemail({ 'email': this.data.userData.email }).subscribe((result) => {
        this.logging.appLogger(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.FORGOTSUCCESS);
        this.logging.appLoggerForDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.FORGOTSUCCESS);
      }, (err) => {
        this.logging.appLoggerForDev(this.helperService.constants.status.ERROR, err);
      });
      this.logging.appLoggerForDev(this.helperService.constants.status.SUCCESS, this.translated.MESSAGES.EMAIL_CHANGED);
    })
  }
  resendVerification() {
    const resendData = {
      userId: this.data.data.userId,
      email: this.data.data.userData.email
    }
    this.loginRegService.resendemail(resendData).subscribe((res) => {
      this.logging.appLogger(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.FORGOTSUCCESS);
      this.logging.appLoggerForDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.FORGOTSUCCESS);
    }, (err) => {
      this.logging.appLoggerForDev(this.helperService.constants.status.ERROR, err);
    });
  }
}
