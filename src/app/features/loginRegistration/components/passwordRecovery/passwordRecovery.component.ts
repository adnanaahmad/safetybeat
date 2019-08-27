import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Reset} from 'src/app/models/profile.model';
import {LoginRegistrationService} from 'src/app/features/loginRegistration/services/LoginRegistrationService';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {PasswordRecovery} from 'src/app/models/loginRegistration/passwordRecovery.model';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-passwordRecovery',
  templateUrl: './passwordRecovery.component.html',
  styleUrls: ['./passwordRecovery.component.scss']
})
export class PasswordRecoveryComponent implements OnInit {
  passRecoveryObj: PasswordRecovery = <PasswordRecovery>{};
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return [
          {title: 'particleContainer', cols: 2, rows: 1},
          {title: 'passwordRecoveryForm', cols: 2, rows: 1}
        ];
      } else {
        return [
          {title: 'particleContainer', cols: 1, rows: 2},
          {title: 'passwordRecoveryForm', cols: 1, rows: 2}
        ];
      }
    })
  );

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private resetServices: LoginRegistrationService,
    private breakpointObserver: BreakpointObserver,
    public helperService: HelperService
  ) {
    this.passRecoveryObj.loading = false;
    this.route.params.subscribe(data => {
      this.passRecoveryObj.data = data;
    });
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
    this.passRecoveryObj.loading = true;
    if (!valid) {
      this.passRecoveryObj.loading = false;
      this.helperService.createSnack(this.helperService.translated.AUTH.PASSWORD_REQ, this.helperService.translated.LOGGER.STATUS.ERROR);
      return;
    }
    let data = {
      'password': value.password1,
      'uid': this.passRecoveryObj.data.uid,
      'token': this.passRecoveryObj.data.token
    };

    this.resetServices.resetPassword(data).subscribe((res) => {
      if (res) {
        this.helperService.createSnack(this.helperService.translated.LOGGER.MESSAGES.CHANGEPASSWORDFOR_DEV,
          this.helperService.translated.LOGGER.STATUS.SUCCESS);
        this.passRecoveryObj.loading = false;
        this.helperService.navigateTo([this.helperService.appConstants.paths.login]);
      }
    }, (error) => {
      this.passRecoveryObj.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

}
