import { Component, OnInit, OnDestroy, Renderer2, ViewChildren } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { Router, ActivatedRoute, NavigationCancel } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Verification } from 'src/app/models/user.model';
import { LoginRegistrationService } from '../../services/LoginRegistrationService';
import { Location } from '@angular/common';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: "app-verification",
  templateUrl: "./verification.component.html",
  styleUrls: ["./verification.component.scss"]
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
  code: string = "";
  codeNumber: number;
  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private render: Renderer2,
    private loginRegService: LoginRegistrationService,
    private route: ActivatedRoute,
    public helperService: HelperService,
    private dialogRef: MatDialogRef<VerificationComponent>
  ) {
    dialogRef.disableClose = true;
    this.translated = this.helperService.translation;
    this.appConstants = this.helperService.constants.appConstant;
    this.render.addClass(document.body, this.helperService.constants.config.theme.modalClass);
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.VERIFICATION_COMPONENT);
  }

  ngOnInit() {
    this.verifyForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }

  ngOnDestroy() {
    this.render.removeClass(document.body, this.helperService.constants.config.theme.background);
    this.helperService.hideLoggers();
  }
  @ViewChildren("input") inputs;
  keyTab($event, value) {
    if (this.code == "") {
      this.code = value;
    } else {
      this.code = this.code + value;
    }

    let element = $event.srcElement.nextElementSibling;
    if (element == null) {
      console.log(this.code);
      debugger;
      this.codeNumber = parseInt(this.code);
      console.log(this.codeNumber);
      this.myfunc(this.codeNumber);
      return;
    } else {
      element.focus();
    }
  }

  checkEmail(group) {
    this.email = this.formBuilder.group({
      email: [group.value.email, Validators.email]
    });
    if (this.email.status === "VALID") {
      const email = { email: group.value.email };
      this.loginRegService
        .checkEmail(email)
        .pipe()
        .subscribe(res => {
          this.success = res;
          if (this.success.responseDetails.code == "0020") {
            group.controls.email.setErrors({ exists: true });
          }
        });
    }
  }

  get formValidation() {
    return this.verifyForm.controls;
  }

  changeEmail({ value, valid }: { value: Verification; valid: boolean }): void {
    if (!valid) {
      this.helperService.appLoggerDev(this.helperService.constants.status.WARNING, valid);
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.translated.LOGGER.MESSAGES.FORGOT_REQ);
      return;
    }
    this.helperService.appLoggerDev(this.helperService.constants.status.INFO, valid);
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(value));
    this.emaill = value.email;
    const verificationData = {
      email: value.email,
      userId: this.data.data.userId
    };
    this.loginRegService.changeEmail(verificationData).subscribe(res => {
      this.res = res;
      this.data.data.userData.email = value.email;
      this.loginRegService.resendemail({ 'email': this.data.userData.email }).subscribe((result) => {
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.FORGOTSUCCESS);
        this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.FORGOTSUCCESS);
      }, (err) => {
        this.helperService.appLoggerDev(this.helperService.constants.status.ERROR, err);
      });
      this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.MESSAGES.EMAIL_CHANGED);
    })
  }
  resendVerification() {
    const resendData = {
      userId: this.data.data.userId,
      email: this.data.data.userData.email
    }
    this.loginRegService.resendemail(resendData).subscribe((res) => {
      this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.FORGOTSUCCESS);
      this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.FORGOTSUCCESS);
    }, (err) => {
      this.helperService.appLoggerDev(this.helperService.constants.status.ERROR, err);
    });
  }

  myfunc(data: any) {
    console.log("this is requested code", data);
  }
}
