import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { share } from 'rxjs/operators';
import { Translation } from 'src/app/models/translate.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EditUser } from 'src/app/models/profile.model';
import { MatDialog } from '@angular/material';
import { AdminControlService } from 'src/app/pages/adminControl/services/adminControl.service';
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
  profileFeatures = { "general": false, "entities": false, "leaves": false, "profile": true, "changePassword": false };
  joinEntityData: { moduleName: string; };
  allEntries: Object;
  entitiesList: any;

  constructor(
    private profile: ProfileService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public adminServices: AdminControlService,
    public helperService: HelperService
  ) {
    this.translated = this.helperService.translation;
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.PROFILE_COMPONENT);
    this.appIcons = this.helperService.constants.appIcons;
    this.appConstants = this.helperService.constants.appConstant;
    this.profileData = JSON.parse(localStorage.getItem(this.helperService.constants.localStorageKeys.entityUserData));
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
    this.helperService.hideLoggers();
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
      this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.PROFILE_SUCCESS);

    }, (error) => {
      this.helperService.appLoggerDev(this.helperService.constants.status.ERROR, `${this.translated.LOGGER.MESSAGES.PROFILE_ERROR +
        this.translated.LOGGER.MESSAGES.STATUS + error.status}`);
      this.helperService.logoutError(error.status)
    });
    return this.dataRecieved;
  }


  onCreate(feature: any) {
    var self = this
    this.helperService.iterations(this.profileFeatures, function (value, key) {
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
      this.helperService.appLoggerDev(this.helperService.constants.status.WARNING, valid);
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.translated.LOGGER.MESSAGES.PROFILE_CREDENTIAL_REQ);
      return;
    }
    this.helperService.appLoggerDev(this.helperService.constants.status.INFO, valid);
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(value));
    value[this.appConstants.userName] = this.username;
    this.profile.editUser(this.user_id, value).subscribe((data) => {
      this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, valid);
      this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.PROFILE_UPDATED);
      this.helperService.createToaster(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.PROFILE_UPDATED, this.translated.STATUS.SUCCESS)
      this.getUserData();
    },
      (error) => {
        this.helperService.appLoggerDev(this.helperService.constants.status.ERROR, `${error.error.detail +
          this.translated.LOGGER.MESSAGES.STATUS + error.status}`);
        this.helperService.appLoggerDev(this.translated.MESSAGES.LOGIN_FAIL, this.translated.LOGGER.MESSAGES.PROFILE_NOTUPDATED);
        this.helperService.logoutError(error.status)
      }
    )
  };
}
