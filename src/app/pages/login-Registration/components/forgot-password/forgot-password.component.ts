
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ForgotPassword } from 'src/app/models/user.model';
import { LoginRegistrationService } from '../../services/LoginRegistrationService';
import { LoggingService } from 'src/app/shared/logging/logging.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassForm: FormGroup;
  translated: object;
  selectedTheme: String;
  status: string;
  warning: string;
  info: string;
  error: string;
  success: string;
  forgot_req: string;
  default: string;
  forgotsuccess: string;
  constructor(
    public forgotService: LoginRegistrationService,
    private router: Router,
    public formBuilder: FormBuilder,
    public translate: TranslateService,
    private logging: LoggingService
  )
  /**
   *in this translate.get function i have subscribed the en.json AUTH,BUTTONS and MESSAGES strings and have used in the html
   *file
   */
  // tslint:disable-next-line:one-line
  {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER']).subscribe((values) => {
      this.translated = values;
      this.default = values.LOGGER.STATUS.DEFAULT;
      this.info = values.LOGGER.STATUS.INFO;
      this.success = values.LOGGER.STATUS.SUCCESS;
      this.warning = values.LOGGER.STATUS.WARNING;
      this.error = values.LOGGER.STATUS.ERROR;
      this.forgot_req = values.LOGGER.MESSAGES.FORGOT_REQ;
      this.forgotsuccess = values.LOGGER.MESSAGES.FORGOTSUCCESS;
      this.status = values.LOGGER.MESSAGES.STATUS;
    });
  }
  ngOnInit()
  /**
   *here we are checking the validity of email
   */
  // tslint:disable-next-line:one-line
  {
    this.forgotPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
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
      this.logging.appLogger(this.warning, valid);
      this.logging.appLogger(this.error, this.forgot_req);
      return;
    }
    this.logging.appLogger(this.info, valid);
    this.logging.appLogger(this.info, JSON.stringify(value));
    this.forgotService.forgotPassword(value).subscribe(
      data => {
        this.logging.appLogger(this.success, this.forgotsuccess);
        this.router.navigate(['/login']);
      },
      error => {
        this.logging.appLogger(this.error, `${this.status + error.status}`);
      }
    );

  }

}

