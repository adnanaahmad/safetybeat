import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ConstantService} from 'src/app/shared/constant/constant.service';
import {TranslateService} from '@ngx-translate/core';
import {Reset} from 'src/app/models/profile.model';
import {LoginRegistrationService} from 'src/app/pages/loginRegistration/services/LoginRegistrationService';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {PasswordRecovery} from '../../../../models/loginRegistration/passwordRecovery.model';
import {FormErrorHandler} from '../../../../shared/FormErrorHandler/FormErrorHandler';

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
    private translate: TranslateService,
    private resetServices: LoginRegistrationService,
    private router: Router,
    private helperService: HelperService
  ) {

    this.translate.get(['LOGGER', 'BUTTONS', 'AUTH', 'MESSAGES']).subscribe((values) => {
      this.passRecoveryObj.translated = values;
    });
    this.route.params.subscribe(data => {
      this.passRecoveryObj.data = data;
    });
    this.passRecoveryObj.appConstants = ConstantService.appConstant;
    this.passRecoveryObj.formErrorMatcher = new FormErrorHandler();

  }

  ngOnInit() {
    this.passRecoveryObj.resetPasswordForm = this.formBuilder.group({
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]]
    }, {validator: this.checkPasswords});
  }

  checkPasswords(group: FormGroup) {
    const pass = group.controls.password1.value;
    const confirmPass = group.controls.password2.value;
    return pass === confirmPass ? null : group.controls.password2.setErrors({notSame: true});
  }

  get formValidation() {
    return this.passRecoveryObj.resetPasswordForm.controls;
  }

  changePassword({value, valid}: { value: Reset; valid: boolean }): void {
    if (!valid) {
      this.helperService.appLoggerDev(this.passRecoveryObj.translated.LOGGER.STATUS.WARNING, valid);
      this.helperService.appLogger(this.passRecoveryObj.translated.LOGGER.STATUS.ERROR, this.passRecoveryObj.translated.AUTH.PASSWORD_REQ);
      return;
    }

    let data = {
      'password': value.password1,
      'uid': this.passRecoveryObj.data.uid,
      'token': this.passRecoveryObj.data.token
    };

    this.resetServices.resetPassword(data).subscribe((res) => {
      this.helperService.appLogger(this.passRecoveryObj.translated.LOGGER.STATUS.SUCCESS,
        this.passRecoveryObj.translated.LOGGER.MESSAGES.PASSWORD_CHANGE);
      this.helperService.appLoggerDev(this.passRecoveryObj.translated.LOGGER.STATUS.SUCCESS
        , this.passRecoveryObj.translated.LOGGER.MESSAGES.CHANGEPASSWORDFOR_DEV);
      this.helperService.navigateTo(['/login']);
    }, (error) => {
      this.helperService.appLoggerDev(this.passRecoveryObj.translated.LOGGER.STATUS.ERROR, `${error.error.detail +
      this.passRecoveryObj.translated.LOGGER.MESSAGES.STATUS + error.status}`);
      this.helperService.appLoggerDev(this.passRecoveryObj.translated.MESSAGES.CHANGEPASSWORD_FAIL,
        this.passRecoveryObj.translated.LOGGER.MESSAGES.PASSWORDCHANGE_UNSUCCESS);
    });
  }

}
