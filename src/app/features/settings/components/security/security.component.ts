import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {changePassword} from 'src/app/models/profile.model';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MatDialogRef} from '@angular/material';
import {SettingsService} from 'src/app/features/settings/services/settings.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {

  changePasswordForm: FormGroup;
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder,
              public settings: SettingsService,
              public dialogRef: MatDialogRef<SecurityComponent>,
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
    return pass === confirmPass ? null : group.controls.password2.setErrors({notSame: true});
  }

  changePassword({value, valid}: { value: changePassword; valid: boolean }, formDirective: FormGroupDirective): void {
    this.loading = true;
    if (!valid) {
      this.loading = false;
      this.helperService.createSnack(this.helperService.translated.AUTH.PASSWORD_REQ, this.helperService.constants.status.ERROR);
      return;
    }
    let result = {
      oldPassword: value.currentPassword,
      newPassword: value.password1
    };
    this.settings.changePassword(result).subscribe((res) => {
      let data: any = res;
      if (data && data.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.CHANGEPASSWORD_SUCCESS,
          this.helperService.constants.status.SUCCESS);
        this.loading = false;
        formDirective.resetForm();
        this.changePasswordForm.reset();
        this.dialogRef.close();
      } else {
        this.loading = false;
        this.dialogRef.close();
        this.helperService.createSnack(this.helperService.translated.MESSAGES.INCORRECT_PASS,
          this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.dialogRef.close();
      this.loading = false;
      this.helperService.createSnack(error.error,
        this.helperService.constants.status.ERROR);
    });
  }


}
