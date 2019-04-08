import {Component, OnInit, Inject} from '@angular/core';
import {inviteUser} from '../../../../models/inviteUser.model';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {Translation} from 'src/app/models/translate.model';
import {NavigationService} from '../../services/navigation.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {HelperService} from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-inviteUserModal',
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
  InviteUserData: any;
  entityID: any;

  constructor(
    public dialogRef: MatDialogRef<InviteUserModalComponent>,
    public formBuilder: FormBuilder,
    private navigationService: NavigationService,
    public helperService: HelperService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.translated = this.helperService.translation;
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.CREATEENTITY);
    this.appConstants = this.helperService.constants.appConstant;
    this.roleList = this.data.role
    this.entityID = this.data.entityId
  }

  ngOnInit() {
    this.inviteUserForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  get formValidation() {
    return this.inviteUserForm.controls;
  }


  checkEmail(group) {
    this.email = this.formBuilder.group({
      'email': [group.value.email, Validators.email]
    });
    if (this.email.status === 'VALID') {
      const email = {email: group.value.email};
      this.navigationService.checkEmail(email).pipe().subscribe((res) => {
        this.success = res;
        if (this.success.responseDetails.code === '0020') {
          group.controls.email.setErrors({exists: true})
        }
      }, err => {
        this.helperService.logoutError(err.status)
      });
    }
  }

  inviteUser({value, valid}: { value: inviteUser; valid: boolean }): void {
    this.InviteUserData = {
      first_name: value.first_name,
      last_name: value.last_name,
      email: value.email,
      invitation: true,
      roleId: value.role,
      contactNo: '545535456',
      moduleName: 'Safetybeat',
      entityId: this.entityID
    }
    if (!valid) {
      this.helperService.appLoggerDev(this.helperService.constants.status.WARNING, valid);
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.translated.LOGGER.MESSAGES.INVITEUSER_ERROR);
      return;
    }
    this.helperService.appLoggerDev(this.helperService.constants.status.INFO, valid);
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(value));
    this.navigationService.inviteUser(this.InviteUserData).subscribe((res) => {
      this.dialogRef.close();
      this.helperService.appLogger(this.helperService.constants.status.SUCCESS, 'User has been successfully Invited.');
    }, (err) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR, 'Error inviting user.');
      this.dialogRef.close();
      this.helperService.logoutError(err.status)
    })
  }

}
