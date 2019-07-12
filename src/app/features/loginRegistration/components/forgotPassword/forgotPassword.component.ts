import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ForgotPasswordComp} from 'src/app/models/loginRegistration/forgotPassword.model';
import {LoginRegistrationService} from 'src/app/features/loginRegistration/services/LoginRegistrationService';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {ForgotPassword} from 'src/app/models/user.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgotPassword.component.html',
  styleUrls: ['./forgotPassword.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPassObj: ForgotPasswordComp = <ForgotPasswordComp>{};
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'particleContainer', cols: 2, rows: 1 },
          { title: 'forgotPasswordForm', cols: 2, rows: 1 }
        ];
      } else {
        return [
          { title: 'particleContainer', cols: 1, rows: 2 },
          { title: 'forgotPasswordForm', cols: 1, rows: 2 }
        ];
      }
    })
  );
  constructor(
    public forgotService: LoginRegistrationService,
    public formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    public helperService: HelperService,
  ) {
    this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
      this.helperService.translated.LOGGER.MESSAGES.FORGOT_COMPONENT);
  }

  /**
   * this function is called when this components initializes and in this function forgotpasswordForm is made and we give the
   * validations to our input fields.
   */

  ngOnInit() {
    this.forgotPassObj.forgotPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * this function is called when the component is destroyed and this function will
   * hide all the debugging messages on the destroy of this component.
   */

  ngOnDestroy() {
    this.helperService.hideLoggers();
  }

  /**
   * in this function login form controls are checked whether they are valid or not and this is basically builtin fucntionality
   */
  get formValidation() {
    return this.forgotPassObj.forgotPassForm.controls;
  }

  /**
   * in this function when the user clicks on the reset button on the forgot password page then the reset password email is
   * sent to the user.and then navigates to the login page
   */
  onSubmit({value, valid}: { value: ForgotPassword; valid: boolean }): void {
    if (!valid) {
      this.helperService.appLoggerDev(this.helperService.constants.status.WARNING, valid);
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.LOGGER.MESSAGES.FORGOT_REQ);
      return;
    }
    this.helperService.appLoggerDev(this.helperService.constants.status.INFO, valid);
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(value));
    this.forgotService.forgotPassword(value).subscribe(
      data => {
        let res = data;
        if (res && res.responseDetails.code !== this.helperService.appConstants.codeValidations[1]) {
          this.helperService.createSnack(this.helperService.translated.MESSAGES.RESET_SUCCESS, this.helperService.constants.status.SUCCESS);
          this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS,
            this.helperService.translated.LOGGER.MESSAGES.FORGOTSUCCESS);
          this.helperService.navigateTo([this.helperService.appConstants.paths.home]);
        }
      },
      error => {
        this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
      }
    );

  }

}

