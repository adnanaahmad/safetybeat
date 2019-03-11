import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute, NavigationCancel } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { Verification } from 'src/app/models/user.model';
import { LoginRegistrationService } from '../../services/LoginRegistrationService';
import { Location } from '@angular/common';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit, OnDestroy {
  // @ViewChild(RegistrationComponent) reg;
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
    public translate: TranslateService,
    private router: Router,
    public formBuilder: FormBuilder,
    private render: Renderer2,
    private loginRegService: LoginRegistrationService,
    private route: ActivatedRoute,
    private location: Location,

  ) {
    this.render.addClass(document.body, ConstantService.config.theme.background);
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER']).subscribe((values) => {
      this.translated = values;
      this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.VERIFICATION_COMPONENT);
    });
    this.appConstants = ConstantService.appConstant;
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
    this.render.removeClass(document.body, ConstantService.config.theme.background);
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
        if (this.success.responseDetails.code=='0020') {
          group.controls.email.setErrors({ exists: true })
        }
      });
    }
  }

  get formValidation() { return this.verifyForm.controls; }
  resendVerification() {
    this.loginRegService.resendemail({ 'email': this.data.data.userData.email }).subscribe((res) => {
      this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.FORGOTSUCCESS);
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.FORGOTSUCCESS);
    }, (err) => {
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.ERROR, err);
    });
  }
  changeEmail({ value, valid }: { value: Verification, valid: boolean }): void {
    debugger;
    if (!valid) {
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.WARNING, valid);
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.FORGOT_REQ);
      return;
    }
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.INFO, valid);
    this.logging.appLogger(this.translated.LOGGER.STATUS.INFO, JSON.stringify(value));
    const verificationData = {
      email:value.email,
      userId:this.data.data.userId
    };
    this.loginRegService.changeEmail(verificationData).subscribe((res) => {
      debugger;
      this.res = res;
      this.data.data.userData.email = value.email;
      this.loginRegService.resendemail({ 'email': this.data.userData.email }).subscribe((result) => {
        this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.FORGOTSUCCESS);
        this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.FORGOTSUCCESS);
      }, (err) => {
        this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.ERROR, err);
      });
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.MESSAGES.EMAIL_CHANGED);
    })
  }
}
