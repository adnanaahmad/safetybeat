import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { changePassword } from 'src/app/models/profile.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Translation } from 'src/app/models/translate.model';
import { ProfileService } from '../../services/profile.service';
import { FormErrorHandler } from 'src/app/shared/FormErrorHandler/FormErrorHandler';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './changePasswordModal.component.html',
  styleUrls: ['./changePasswordModal.component.scss']
})
export class ModalDialogComponent implements OnInit {
  changePasswordForm: FormGroup;
  translated: Translation;
  profileData: any;
  user_id: any;
  appConstants: any;
  formErrorMatcher: any;
  constructor(
    public dialogRef: MatDialogRef<ModalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: changePassword,
    public formBuilder: FormBuilder,
    private modalService: ProfileService,
    public helperService: HelperService
  ) {
    this.translated = this.helperService.translation;
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.PASSWORDCHANGE);
    this.appConstants = this.helperService.constants.appConstant;
    this.profileData = JSON.parse(localStorage.getItem(this.helperService.constants.localStorageKeys.entityUserData));
    this.user_id = this.profileData.user.id;
  }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]]
    }, { validator: this.checkPasswords });
    this.formErrorMatcher = new FormErrorHandler();
  }
  checkPasswords(group: FormGroup) {
    const pass = group.controls.password1.value;
    const confirmPass = group.controls.password2.value;
    return pass === confirmPass ? null : group.controls.password2.setErrors({ notSame: true });
  }
  get formValidation() { return this.changePasswordForm.controls; }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changePassword({ value, valid }: { value: changePassword; valid: boolean }): void {
    if (!valid) {
      this.helperService.appLoggerDev(this.helperService.constants.status.WARNING, valid);
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.translated.AUTH.PASSWORD_REQ);
      return;
    }
    this.helperService.appLoggerDev(this.helperService.constants.status.INFO, valid);
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(value));
    let result = {
      oldPassword: value.currentPassword,
      newPassword: value.password1,
      pk: this.user_id
    }
    this.modalService.changePassword(result).subscribe((res) => {
      this.dialogRef.close();
      this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.PASSWORD_CHANGE);
      this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.CHANGEPASSWORDFOR_DEV);
      this.helperService.creactSnack(this.translated.MESSAGES.CHANGEPASSWORD_SUCCESS, this.translated.LOGGER.MESSAGES.PASSWORD_CHANGE, this.helperService.constants.status.SUCCESS);
    }, (error) => {
      this.helperService.creactSnack(this.translated.MESSAGES.CHANGEPASSWORD_FAIL, this.translated.LOGGER.MESSAGES.PASSWORDCHANGE_UNSUCCESS, this.helperService.constants.status.ERROR);
      this.dialogRef.close();
      this.helperService.appLoggerDev(this.helperService.constants.status.ERROR, `${error.error.detail +
        this.translated.LOGGER.MESSAGES.STATUS + error.status}`);
      this.helperService.appLoggerDev(this.translated.MESSAGES.CHANGEPASSWORD_FAIL,
        this.translated.LOGGER.MESSAGES.PASSWORDCHANGE_UNSUCCESS);
      this.helperService.logoutError(error.status)
    });

  }

}
