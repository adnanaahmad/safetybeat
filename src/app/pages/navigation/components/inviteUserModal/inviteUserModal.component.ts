import { Component, OnInit, Inject } from '@angular/core';
import { inviteUser } from '../../../../models/inviteUser.model';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { TranslateService } from '@ngx-translate/core';
import { Translation } from 'src/app/models/translate.model';
import { NavigationService } from '../../services/navigation.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-invite-user-modal',
  templateUrl: './inviteUserModal.component.html',
  styleUrls: ['./inviteUserModal.component.scss']
})
export class InviteUserModalComponent implements OnInit {
  translated: Translation;
  appConstants: any;
  inviteUserForm: FormGroup;
  email: FormGroup;
  success: any;
 
  roleList = [
    'user', 'owner', 'teamLead'
  ]
  InviteUserData: { first_name: string; last_name: string; email: string; role: string; invitation: boolean; moduleName: string; };
  constructor(
    public dialogRef: MatDialogRef<InviteUserModalComponent>,
    private translate: TranslateService,
    public formBuilder: FormBuilder,
    private logging: LoggingService,
    private navigationService: NavigationService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.translate.get(['LOGGER', 'BUTTONS', 'AUTH', 'MESSAGES']).subscribe((values) => {
      this.translated = values;
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.CREATEENTITY);
    });
    this.appConstants = ConstantService.appConstant;
    this.roleList = this.data
  }

  ngOnInit() {
    this.inviteUserForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  get formValidation() { return this.inviteUserForm.controls; }

  
  checkEmail(group) {
    this.email = this.formBuilder.group({
      'email': [group.value.email, Validators.email]
    });
    if (this.email.status === 'VALID') {
      const email = { email: group.value.email };
      this.navigationService.checkEmail(email).pipe().subscribe((res) => {
        this.success = res;
        if (this.success.responseDetails.code == '0020') {
          group.controls.email.setErrors({ exists: true })
        }
      });
    }
  }

  inviteUser({ value, valid }: { value: inviteUser; valid: boolean }): void {
    this.InviteUserData = {
      first_name: value.first_name,
      last_name: value.last_name,
      email: value.email,
      role: value.role,
      invitation: true,
      moduleName: "Safetybeat"
    }
    debugger
    if (!valid) {
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.WARNING, valid);
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.INVITEUSER_ERROR);
      return;
    }
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.INFO, valid);
    this.logging.appLogger(this.translated.LOGGER.STATUS.INFO, JSON.stringify(value));
    this.navigationService.inviteUser(this.InviteUserData).subscribe((res) => {
      this.dialogRef.close();
      this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, "User has been successfully Invited.");
    }, (err) => {
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, "Error inviting user.");
    })
  }

}
