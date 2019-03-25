import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { share } from 'rxjs/operators';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { Translation } from 'src/app/models/translate.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EditUser } from 'src/app/models/profile.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { ModalDialogComponent } from '../changePasswordModal/changePasswordModal.component';
import { AdminControlService } from 'src/app/pages/adminControl/services/adminControl.service';
import * as _ from 'lodash';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})

export class ProfileComponent implements OnInit, OnDestroy {
  userData: any;
  @Input() profileForm: FormGroup;
  changePasswordForm: FormGroup;
  translated: Translation;
  profileData: any;
  user_id: number;
  username: string;
  firstname: string;
  lastname: string;
  dataRecieved: any;
  disabled: boolean = false;
  isEdited: boolean = false;
  currentPassword: string;
  password1: string;
  password2: string;
  appIcons: any;
  appConstants: any;
  profileFeatures = { "activities": false, "entities": false, "leaves": false, "profile": true, "changePassword": false };
  joinEntityData: { moduleName: string; };
  allEntries: Object;
  entitiesList: any;

  constructor(
    private profile: ProfileService,
    private logging: LoggingService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public adminServices: AdminControlService,
    public helperService: HelperService
  ) {
    this.translated = this.helperService.translation;
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.PROFILE_COMPONENT);
    this.appIcons = ConstantService.appIcons;
    this.appConstants = ConstantService.appConstant;
    this.profileData = JSON.parse(localStorage.getItem(ConstantService.localStorageKeys.entityUserData));
    this.user_id = this.profileData.user.id;
    this.userData = this.getUserData();
  }
  @Input()
  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contactNo: ['', Validators.required]
    });
    this.profileForm.disable();
  }

  ngOnDestroy() {
    this.logging.hideAllAppLoggers();
  }
  checkPasswords(group: FormGroup) {
    const pass = group.controls.password1.value;
    const confirmPass = group.controls.password2.value;
    return pass === confirmPass ? null : group.controls.password2.setErrors({ notSame: true });
  }
  get profileDataForm() { return this.profileForm.controls; }

  getUserData() {
    this.dataRecieved = this.profile.getUser(this.user_id).pipe(share());
    this.dataRecieved.subscribe((data) => {
      this.firstname = data.first_name;
      this.lastname = data.last_name;
      this.username = this.firstname + this.lastname;
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.PROFILE_SUCCESS);

    }, (error) => {
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.ERROR, `${this.translated.LOGGER.MESSAGES.PROFILE_ERROR +
        this.translated.LOGGER.MESSAGES.STATUS + error.status}`);
    });
    return this.dataRecieved;
  }
  onCreate(feature: any) {
    var self = this
    _.forEach(this.profileFeatures, function (value, key) {
      if (key === feature) {
        self.profileFeatures[key] = true;
      } else {
        self.profileFeatures[key] = false;
      }
    })
  }

  editAccount() {
    this.disabled = true;
    this.profileForm.enable();
  }
  cancelEditAccount() {
    this.disabled = false;
    this.profileForm.disable();
    this.userData = this.getUserData();
  }

  onLeaves() {
    this.profileFeatures.leaves = true;
  }

  onEntities() {

  }

  onActivities() {

  }

  updateProfile({ value, valid }: { value: EditUser; valid: boolean }): void {
    this.disabled = false;
    this.profileForm.disable();
    if (!valid) {
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.WARNING, valid);
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.PROFILE_CREDENTIAL_REQ);
      return;
    }
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.INFO, valid);
    this.logging.appLogger(this.translated.LOGGER.STATUS.INFO, JSON.stringify(value));
    value[this.appConstants.userName] = this.username;
    this.profile.editUser(this.user_id, value).subscribe((data) => {
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, valid);
      this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.PROFILE_UPDATED);
      this.helperService.createToaster(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.PROFILE_UPDATED, this.translated.STATUS.SUCCESS)
      this.getUserData();
    },
      (error) => {
        this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.ERROR, `${error.error.detail +
          this.translated.LOGGER.MESSAGES.STATUS + error.status}`);
        this.logging.appLoggerForDev(this.translated.MESSAGES.LOGIN_FAIL, this.translated.LOGGER.MESSAGES.PROFILE_NOTUPDATED);
      }
    )
  };
}
