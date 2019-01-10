import { Component, OnInit, OnDestroy } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit, OnDestroy {
  translated: Translation;
  verifyForm: FormGroup;

  constructor(
    private logging: LoggingService,
    public translate: TranslateService,
    private router: Router,
    public formBuilder: FormBuilder,

  ) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER']).subscribe((values) => {
      this.translated = values;
      this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.VERIFICATION_COMPONENT);
    });
  }

  ngOnInit() {
    this.verifyForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnDestroy() {
    this.logging.hideAllAppLoggers();

  }

  get formValidation() { return this.verifyForm.controls; }


}
