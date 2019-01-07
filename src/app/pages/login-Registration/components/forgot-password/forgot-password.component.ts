
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ForgotPassword } from 'src/app/models/user.model';
import { LoginRegistrationService } from '../../services/LoginRegistrationService';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { Translation } from 'src/app/models/translate.model';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassForm: FormGroup;
  translated: Translation;
  selectedTheme: String;
  constructor(
    public forgotService: LoginRegistrationService,
    private router: Router,
    public formBuilder: FormBuilder,
    public translate: TranslateService,
    private logging: LoggingService
  ) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER']).subscribe((values) => {
      this.translated = values;
    });
    this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.FORGOT_COMPONENT);
  }
  ngOnInit()
  {
    this.forgotPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  ngOnDestroy(){
    this.logging.hideAllAppLoggers()
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
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.WARNING, valid);
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.FORGOT_REQ);
      return;
    }
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.INFO, valid);
    this.logging.appLogger(this.translated.LOGGER.STATUS.INFO, JSON.stringify(value));
    this.forgotService.forgotPassword(value).subscribe(
      data => {
        this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.FORGOTSUCCESS);
        this.router.navigate(['/login']);
      },
      error => {
        this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.ERROR, `${this.translated.LOGGER.MESSAGES.STATUS + error.status}`);
      }
    );

  }

}

