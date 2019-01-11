import { Component, OnInit, OnDestroy, Renderer2, AfterViewInit, ViewChild } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { RegistrationComponent } from '../registration/registration.component';
import { Verification } from 'src/app/models/user.model';
import { LoginRegistrationService } from '../../services/LoginRegistrationService';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(RegistrationComponent) reg;
  translated: Translation;
  verifyForm: FormGroup;
  emaill: string;
  data: any;

  constructor(
    private logging: LoggingService,
    public translate: TranslateService,
    private router: Router,
    public formBuilder: FormBuilder,
    private render: Renderer2,
    private loginRegService: LoginRegistrationService,
    private route: ActivatedRoute


  ) {
    this.render.addClass(document.body, ConstantService.config.theme.background);
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER']).subscribe((values) => {
      this.translated = values;
      this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.VERIFICATION_COMPONENT);
    });
  }

  ngOnInit() {
    this.verifyForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.data = this.route.snapshot.paramMap.get('data');
    console.log('this is the data', this.data);

  }

  ngOnDestroy() {
    this.render.removeClass(document.body, ConstantService.config.theme.background);
    this.logging.hideAllAppLoggers();
  }

  ngAfterViewInit() {

  }

  get formValidation() { return this.verifyForm.controls; }

  changeEmail({ value, valid }: { value: Verification, valid: boolean }): void {
    if (!valid) {
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.WARNING, valid);
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.FORGOT_REQ);
      return;
    }

    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.INFO, valid);
    this.logging.appLogger(this.translated.LOGGER.STATUS.INFO, JSON.stringify(value));
    this.loginRegService.resendemail(value).subscribe((data) => {
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.FORGOTSUCCESS);
    })
  }


}
