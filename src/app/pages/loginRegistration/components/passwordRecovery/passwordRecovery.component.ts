import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Reset} from 'src/app/models/profile.model';
import {LoginRegistrationService} from 'src/app/pages/loginRegistration/services/LoginRegistrationService';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {PasswordRecovery} from 'src/app/models/loginRegistration/passwordRecovery.model';
import {FormErrorHandler} from 'src/app/shared/FormErrorHandler/FormErrorHandler';

@Component({
  selector: 'app-passwordRecovery',
  templateUrl: './passwordRecovery.component.html',
  styleUrls: ['./passwordRecovery.component.scss']
})
export class PasswordRecoveryComponent implements OnInit {
  passRecoveryObj: PasswordRecovery = <PasswordRecovery>{};

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private resetServices: LoginRegistrationService,
    public helperService: HelperService
  ) {
    this.route.params.subscribe(data => {
      this.passRecoveryObj.data = data;
    });
    this.passRecoveryObj.formErrorMatcher = new FormErrorHandler();

  }

  /**
   * this function is used for making the resetPasswordForma and in this function we also declare the validations
   * to the input fields
   */

  ngOnInit() {
    this.passRecoveryObj.resetPasswordForm = this.formBuilder.group({
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]]
    }, {validator: this.checkPasswords});
  }

  /**
   * this function is used check if password and repeat password is same
   * @params group
   */
  checkPasswords(group: FormGroup) {
    const pass = group.controls.password1.value;
    const confirmPass = group.controls.password2.value;
    return pass === confirmPass ? null : group.controls.password2.setErrors({notSame: true});
  }

  /**
   *  Getter for resetPassword form validations
   */
  get formValidation() {
    return this.passRecoveryObj.resetPasswordForm.controls;
  }

  /**
   *  this function is used for changing the password in this function new password and confirm password
   *  fields are passed and then we check the validity of the both password whether they are same or not and
   *  then we pass this data to the api call and if the data is valid then api call return success reponse and password
   *  is changed successfully otherwise we will get an error message.
   * @params value
   * @params valid
   */
  changePassword({value, valid}: { value: Reset; valid: boolean }): void {
    if (!valid) {
      this.helperService.appLoggerDev(this.helperService.translated.LOGGER.STATUS.WARNING, valid);
      this.helperService.appLogger(this.helperService.translated.LOGGER.STATUS.ERROR, this.helperService.translated.AUTH.PASSWORD_REQ);
      return;
    }

    let data = {
      'password': value.password1,
      'uid': this.passRecoveryObj.data.uid,
      'token': this.passRecoveryObj.data.token
    };

    this.resetServices.resetPassword(data).subscribe((res) => {
      this.helperService.appLogger(this.helperService.translated.LOGGER.STATUS.SUCCESS,
        this.helperService.translated.LOGGER.MESSAGES.PASSWORD_CHANGE);
      this.helperService.appLoggerDev(this.helperService.translated.LOGGER.STATUS.SUCCESS
        , this.helperService.translated.LOGGER.MESSAGES.CHANGEPASSWORDFOR_DEV);
      this.helperService.navigateTo([this.helperService.appConstants.paths.login]);
    }, (error) => {
      this.helperService.appLoggerDev(this.helperService.translated.LOGGER.STATUS.ERROR, `${error.error.detail +
      this.helperService.translated.LOGGER.MESSAGES.STATUS + error.status}`);
      this.helperService.appLoggerDev(this.helperService.translated.MESSAGES.CHANGEPASSWORD_FAIL,
        this.helperService.translated.LOGGER.MESSAGES.PASSWORDCHANGE_UNSUCCESS);
    });
  }

}
