import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { changePassword } from 'src/app/models/profile.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Translation } from 'src/app/models/translate.model';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { ModalConfigService } from '../../services/modalConfig.service';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modalDialog.component.html',
  styleUrls: ['./modalDialog.component.scss']
})
export class ModalDialogComponent implements OnInit {
  changePasswordForm: FormGroup;
  translated: Translation;

  constructor(
    public dialogRef: MatDialogRef<ModalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: changePassword,
    public formBuilder: FormBuilder,
    private translate: TranslateService,
    private logging: LoggingService,
    private modalService: ModalConfigService
  ) {
    this.translate.get(['LOGGER', 'BUTTONS', 'AUTH', 'MESSAGES']).subscribe((values) => {
      this.translated = values;
      this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.PROFILE_COMPONENT);
    });
  }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]]
    }, { validator: this.checkPasswords });
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
    debugger;
    if (!valid) {
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.WARNING, valid);
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.AUTH.PASSWORD_REQ);
      return;
    }
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.INFO, valid);
    this.logging.appLogger(this.translated.LOGGER.STATUS.INFO, JSON.stringify(value));
    this.modalService.changePassword(value).subscribe((result) => {
      console.log('this is the result that we have gotten', result);
    });

  }

}
