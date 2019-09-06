import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ForgotPasswordComp} from 'src/app/models/loginRegistration/forgotPassword.model';
import {LoginRegistrationService} from 'src/app/features/loginRegistration/services/LoginRegistrationService';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {ForgotPassword} from 'src/app/models/user.model';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgotPassword.component.html',
  styleUrls: ['./forgotPassword.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassObj: ForgotPasswordComp = <ForgotPasswordComp>{};
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return [
          {title: 'particleContainer', cols: 2, rows: 1},
          {title: 'forgotPasswordForm', cols: 2, rows: 1}
        ];
      } else {
        return [
          {title: 'particleContainer', cols: 1, rows: 2},
          {title: 'forgotPasswordForm', cols: 1, rows: 2}
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
    this.forgotPassObj.loading = false;
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
    this.forgotPassObj.loading = true;
    if (!valid) {
      this.helperService.createSnack(this.helperService.translated.LOGGER.MESSAGES.FORGOT_REQ, this.helperService.constants.status.ERROR);
      this.forgotPassObj.loading = false;
      return;
    }
    this.forgotService.forgotPassword(value).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.forgotPassObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.RESET_SUCCESS, this.helperService.constants.status.SUCCESS);
        this.helperService.navigateTo([this.helperService.appConstants.paths.home]);
      }
    }, (error) => {
      this.forgotPassObj.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

}

