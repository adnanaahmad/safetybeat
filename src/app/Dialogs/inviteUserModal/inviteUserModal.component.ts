import {Component, OnInit, Inject} from '@angular/core';
import {InviteUser, inviteUserData} from 'src/app/models/adminControl/inviteUser.model';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {Translation} from 'src/app/models/translate.model';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {HelperService} from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-inviteUserModal',
  templateUrl: './inviteUserModal.component.html',
  styleUrls: ['./inviteUserModal.component.scss']
})
export class InviteUserModalComponent implements OnInit {
  inviteUserModal: InviteUser = <InviteUser>{};

  constructor(
    public dialogRef: MatDialogRef<InviteUserModalComponent>,
    public formBuilder: FormBuilder,
    private navigationService: NavigationService,
    public helperService: HelperService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.inviteUserModal.translated = this.helperService.translated;
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS,
      this.inviteUserModal.translated.LOGGER.MESSAGES.CREATEENTITY);
    this.inviteUserModal.appConstants = this.helperService.constants.appConstant;
    this.inviteUserModal.roleList = this.data.role;
    this.inviteUserModal.entityID = this.data.entityId;
  }

  ngOnInit() {
    this.inviteUserModal.inviteUserForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  initialize() {
    this.inviteUserModal.roleList = [
      'user', 'owner', 'teamLead'
    ];
  }

  /**
   * This function is used to validate Invite User form and shows error if the form field is invalid
   */
  get formValidation() {
    return this.inviteUserModal.inviteUserForm.controls;
  }

  /**
   * this function is used to check if the email is valid or already exists
   * @params group
   */
  checkEmail(group) {
    this.inviteUserModal.email = this.formBuilder.group({
      'email': [group.value.email, Validators.email]
    });
    if (this.inviteUserModal.email.status === 'VALID') {
      const email = {email: group.value.email};
      this.navigationService.checkEmail(email).pipe().subscribe((res) => {
        this.inviteUserModal.success = res;
        if (this.inviteUserModal.success.responseDetails.code === '0020') {
          group.controls.email.setErrors({exists: true});
        }
      }, err => {
        this.helperService.logoutError(err.status);
      });
    }
  }

  /**
   * this function is used to register a user by taking information from Invite User form and checks if the
   * user is successfully invited or not
   * @params value
   * @params valid
   */
  inviteUser({value, valid}: { value: inviteUserData; valid: boolean }): void {
    this.inviteUserModal.InviteUserData = {
      first_name: value.first_name,
      last_name: value.last_name,
      email: value.email,
      invitation: true,
      roleId: value.role,
      contactNo: '545535456',
      moduleName: 'Safetybeat',
      entityId: this.inviteUserModal.entityID
    };
    if (!valid) {
      this.helperService.appLoggerDev(this.helperService.constants.status.WARNING, valid);
      this.helperService.appLogger(this.helperService.constants.status.ERROR,
        this.inviteUserModal.translated.LOGGER.MESSAGES.INVITEUSER_ERROR);
      return;
    }
    this.helperService.appLoggerDev(this.helperService.constants.status.INFO, valid);
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(value));
    this.navigationService.inviteUser(this.inviteUserModal.InviteUserData).subscribe((res) => {
      this.dialogRef.close();
      this.helperService.appLogger(this.helperService.constants.status.SUCCESS, 'User has been successfully Invited.');
    }, (err) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR, 'Error inviting user.');
      this.dialogRef.close();
      this.helperService.logoutError(err.status);
    });
  }

}
