import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {changePassword} from 'src/app/models/profile.model';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {SettingService} from 'src/app/shared/settings/setting.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {

  changePasswordForm: FormGroup;
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder,
              public settings: SettingService,
              public helperService: HelperService) {
  }

  get changePasswordFormValidations() {
    return this.changePasswordForm.controls;
  }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]]
    }, {validator: this.checkPasswords});
  }

  checkPasswords(group: FormGroup) {
    const pass = group.controls.password1.value;
    const confirmPass = group.controls.password2.value;
    return pass === confirmPass ? group.controls.password2.setErrors({notSame: null}) : group.controls.password2.setErrors({notSame: true});
  }

  changePassword({value, valid}: { value: changePassword; valid: boolean }, formDirective: FormGroupDirective): void {
    if (!valid) {
      this.helperService.appLoggerDev(this.helperService.constants.status.WARNING, valid);
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.AUTH.PASSWORD_REQ);
      return;
    }
    this.helperService.appLoggerDev(this.helperService.constants.status.INFO, valid);
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(value));
    let result = {
      oldPassword: value.currentPassword,
      newPassword: value.password1
    };
    this.settings.changePassword(result).subscribe((res) => {
      let data: any = res;
      if (data.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
          this.helperService.translated.LOGGER.MESSAGES.PASSWORD_CHANGE);
        this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS,
          this.helperService.translated.LOGGER.MESSAGES.CHANGEPASSWORDFOR_DEV);
        this.helperService.createSnack(this.helperService.translated.MESSAGES.CHANGEPASSWORD_SUCCESS,
          this.helperService.constants.status.SUCCESS);
        this.loading = false;
        formDirective.resetForm();
        this.changePasswordForm.reset();
      } else {
        this.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.INCORRECT_PASS,
           this.helperService.constants.status.ERROR);

      }
    }, (error) => {
      this.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.CHANGEPASSWORD_FAIL,
         this.helperService.constants.status.ERROR);
      this.helperService.appLoggerDev(this.helperService.constants.status.ERROR, `${error.error.detail +
      this.helperService.translated.LOGGER.MESSAGES.STATUS + error.status}`);
      this.helperService.appLoggerDev(this.helperService.translated.MESSAGES.CHANGEPASSWORD_FAIL,
        this.helperService.translated.LOGGER.MESSAGES.PASSWORDCHANGE_UNSUCCESS);
      this.helperService.logoutError(error.status);
      this.clearValidations();
    });
  }

  clearValidations() {
    Object.keys(this.changePasswordForm.controls).forEach(key => {
      this.changePasswordForm.controls[key].setErrors(null);
    });
  }


}
