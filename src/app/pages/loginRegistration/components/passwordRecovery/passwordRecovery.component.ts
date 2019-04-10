import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ConstantService} from 'src/app/shared/constant/constant.service';
import {TranslateService} from '@ngx-translate/core';
import {Translation} from 'src/app/models/translate.model';
import {Reset} from 'src/app/models/profile.model';
import {LoginRegistrationService} from 'src/app/pages/loginRegistration/services/LoginRegistrationService';
import {HelperService} from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-passwordRecovery',
  templateUrl: './passwordRecovery.component.html',
  styleUrls: ['./passwordRecovery.component.scss']
})
export class PasswordRecoveryComponent implements OnInit {
  data: any;
  resetPasswordForm: FormGroup;
  appConstants: any;
  translated: Translation;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private resetServices: LoginRegistrationService,
    private router: Router,
    private helperService: HelperService
  ) {

    this.translate.get(['LOGGER', 'BUTTONS', 'AUTH', 'MESSAGES']).subscribe((values) => {
      this.translated = values;
    });
    this.route.params.subscribe(data => {
      this.data = data;
    })
    this.appConstants = ConstantService.appConstant;

  }

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]]
    }, {validator: this.checkPasswords});
  }

  /**
   * this function
   * @params group
   */
  checkPasswords(group: FormGroup) {
    const pass = group.controls.password1.value;
    const confirmPass = group.controls.password2.value;
    return pass === confirmPass ? null : group.controls.password2.setErrors({notSame: true});
  }


  /**
   * this function is used to validate form and ....
   */
  get formValidation() { return this.resetPasswordForm.controls; }

  /**
   *  this function
   * @params value
   * @params valid
   */
  changePassword({ value, valid }: { value: Reset; valid: boolean }): void {
    if (!valid) {
      this.helperService.appLoggerDev(this.translated.LOGGER.STATUS.WARNING, valid);
      this.helperService.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.AUTH.PASSWORD_REQ);
      return;
    }

    let data = {
      'password': value.password1,
      'uid': this.data.uid,
      'token': this.data.token
    };

    this.resetServices.resetPassword(data).subscribe((res) => {
      this.helperService.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.PASSWORD_CHANGE);
      this.helperService.appLoggerDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.CHANGEPASSWORDFOR_DEV);
      this.router.navigate(['/login']);
    }, (error) => {
      this.helperService.appLoggerDev(this.translated.LOGGER.STATUS.ERROR, `${error.error.detail +
      this.translated.LOGGER.MESSAGES.STATUS + error.status}`);
      this.helperService.appLoggerDev(this.translated.MESSAGES.CHANGEPASSWORD_FAIL,
        this.translated.LOGGER.MESSAGES.PASSWORDCHANGE_UNSUCCESS);
    })
  }

}
