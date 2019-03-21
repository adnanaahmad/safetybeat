import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { share } from 'rxjs/operators';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { TranslateService } from '@ngx-translate/core';
import { Translation } from 'src/app/models/translate.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EditUser } from 'src/app/models/profile.model';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { ModalDialogComponent } from '../changePasswordModal/changePasswordModal.component';

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
  org_id: number;
  role: string;
  username: string;
  firstname:string;
  lastname:string;
  dataRecieved: any;
  disabled: boolean = false;
  isEdited: boolean = false;
  currentPassword: string;
  password1: string;
  password2: string;
  appIcons: any;
  appConstants: any;
  constructor(
    private profile: ProfileService,
    private logging: LoggingService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    public toastProvider: ToastService,
    public dialog: MatDialog,
  ) {
    debugger;
    this.translate.get(['LOGGER', 'BUTTONS', 'AUTH', 'MESSAGES', 'STRINGS']).subscribe((values) => {
      this.translated = values;
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.PROFILE_COMPONENT);
    });
    this.appIcons = ConstantService.appIcons;
    this.appConstants = ConstantService.appConstant;
    this.profileData = JSON.parse(localStorage.getItem('entityUserData'));
    this.user_id = this.profileData.user.id;
    this.org_id = this.profileData.orgid;
    this.role = this.profileData.role;
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
      this.username = this.firstname+this.lastname;
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.PROFILE_SUCCESS);

    }, (error) => {
      this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.ERROR, `${this.translated.LOGGER.MESSAGES.PROFILE_ERROR +
        this.translated.LOGGER.MESSAGES.STATUS + error.status}`);
    });
    return this.dataRecieved;
  }
  onCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = false;
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      data: { currentPassword: this.currentPassword, password1: this.password1, password2: this.password2 }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getUserData();
    });
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
      this.toastProvider.createSuccessToaster(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.PROFILE_UPDATED);
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
