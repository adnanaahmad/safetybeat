import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { LoginRegistrationService } from '../../services/LoginRegistrationService';
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
    public helperService: HelperService,
  ) {
    this.render.addClass(document.body, ConstantService.config.theme.modalClass);
    this.translated = this.helperService.translation;
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.VERIFICATION_COMPONENT);
    this.appConstants = ConstantService.appConstant;
  }

  ngOnInit() {
    this.verifyForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnDestroy() {
    this.render.removeClass(document.body, ConstantService.config.theme.background);
    this.logging.hideAllAppLoggers();
  }
}
