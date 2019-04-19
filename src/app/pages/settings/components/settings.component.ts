import {Component, OnInit, AfterViewInit} from '@angular/core';
import {SettingService} from 'src/app/shared/settings/setting.service';
import {OverlayContainer} from '@angular/cdk/overlay';
import {Translation} from 'src/app/models/translate.model';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {FormGroup, FormBuilder, Validators, FormGroupDirective} from '@angular/forms';
import {changePassword, EditEntity} from 'src/app/models/profile.model';
import {MatDialogRef} from '@angular/material';
import {ProfileService} from '../../profile/services/profile.service';
import {SettingsService} from '../services/settings.service';
import {FormErrorHandler} from '../../../shared/FormErrorHandler/FormErrorHandler';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, AfterViewInit {
  public dialogRef: MatDialogRef<SettingsComponent>;
  themeSelected: any;
  translated: Translation;
  entityForm: FormGroup;
  appIcons: any;
  appConstants: any;
  appTheme: any;
  entitiesData: any;
  allEntities: any;
  settingFeatures = {'general': true, 'security': false, 'organization': false, 'group': false, 'entity': false, 'theme': false};
  disabled: boolean = false;
  entityId: any;
  createdBy: any;
  managedBy: any;
  changePasswordForm: FormGroup;
  private modalService: ProfileService;
  data: any;
  currentPassword: string;
  password1: any;
  password2: any;
  loading: boolean = false;
  orgName: string;
  account: number;
  address: string;
  email: string;
  date: number;
  contact: number;

  constructor(
    public settings: SettingService,
    public overlay: OverlayContainer,
    public helperService: HelperService,
    private navService: NavigationService,
    private formBuilder: FormBuilder,
    public settingService: SettingsService
  ) {
    this.translated = this.helperService.translated;
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.SETTING_COMPONENT);
    this.appConstants = this.helperService.constants.appConstant;
    this.appIcons = this.helperService.constants.appIcons;
    this.appTheme = this.helperService.constants.appTheme;
  }

  ngOnInit() {
    this.settings.getActiveTheme().subscribe(val => {
      this.themeSelected = val;
    });

    this.entityForm = this.formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      headOffice: ['', Validators.required]
    });
    this.entityForm.disable();
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]]
    }, {validator: this.checkPasswords});
    this.settingService.organizationData.subscribe((res) => {
      if (res === 1) {
        // it means page is refreshed we need to call the API
        this.settingService.getOrganization().subscribe((res) => {
          console.log(res);
          this.orgName = res.data.name;
          this.account = res.data.accountNo;
          this.address = res.data.address;
          this.email = res.data.billingEmail;
          this.date = res.data.dateJoined;
          this.contact = res.data.phoneNo;
        });
      } else {
        // it means that we dont need to call API
      }
    });
  }

  ngAfterViewInit() {
    this.navService.selectedEntityData.subscribe((selectedEntity) => {
      this.allEntities = selectedEntity;
      this.entitiesData = this.allEntities.entityInfo;
      this.entityId = this.entitiesData.id;
      this.createdBy = this.entitiesData.createdBy;
      this.managedBy = this.entitiesData.managedBy;
    });
  }

  checkPasswords(group: FormGroup) {
    const pass = group.controls.password1.value;
    const confirmPass = group.controls.password2.value;
    return pass === confirmPass ? null : group.controls.password2.setErrors({notSame: true});
  }


  editEntity() {
    this.disabled = true;
    this.entityForm.enable();
  }

  cancelEditAccount() {
    this.disabled = false;
    this.entityForm.disable();
  }

  get entityDataForm() {
    return this.entityForm.controls;
  }

  get changePasswordFormValidations() {
    return this.changePasswordForm.controls;
  }

  changed() {
    this.settings.setActiveTheme(this.themeSelected);
    let self = this;
    this.helperService.iterations(this.overlay.getContainerElement().classList, function (value, index) {
      if (index !== 0) {
        self.overlay.getContainerElement().classList.remove(value);
      }
    });
    this.overlay.getContainerElement().classList.add(this.themeSelected);
  }

  changeSetting(settings: any) {
    let self = this;
    this.helperService.iterations(this.settingFeatures, function (value, key) {
      if (key === settings) {
        self.settingFeatures[key] = true;
      } else {
        self.settingFeatures[key] = false;
      }
    });
  }

  updateEntity({value, valid}: { value: EditEntity; valid: boolean }): void {
    this.disabled = false;
    this.entityForm.disable();
    let data = {
      'code': value.code,
      'headOffice': value.headOffice,
      'managedBy': this.managedBy,
      'createdBy': this.createdBy
    };
    if (!valid) {
      this.helperService.appLogger(this.translated.STATUS.ERROR, 'Invalid Entity Fields');
      return;
    }
    this.settings.editEntity(this.entityId, data).subscribe((res) => {
      this.helperService.createSnack('Entity has been updated Successfully', 'Entity Updated', this.helperService.constants.status.SUCCESS);
    });


  }

  changePassword({value, valid}: { value: changePassword; valid: boolean }, formDirective: FormGroupDirective ): void {
    if (!valid) {
      this.helperService.appLoggerDev(this.helperService.constants.status.WARNING, valid);
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.translated.AUTH.PASSWORD_REQ);
      return;
    }
    this.helperService.appLoggerDev(this.helperService.constants.status.INFO, valid);
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(value));
    let result = {
      oldPassword: value.currentPassword,
      newPassword: value.password1
    };
    this.settings.changePassword(result).subscribe((res) => {
      this.data = res;
      if (this.data.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
          this.translated.LOGGER.MESSAGES.PASSWORD_CHANGE);
        this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS,
          this.translated.LOGGER.MESSAGES.CHANGEPASSWORDFOR_DEV);
        this.helperService.createSnack(this.translated.MESSAGES.CHANGEPASSWORD_SUCCESS,
          this.translated.LOGGER.MESSAGES.PASSWORD_CHANGE, this.helperService.constants.status.SUCCESS);
        this.loading = false;
        formDirective.resetForm()
        this.changePasswordForm.reset();
      } else {
        this.loading = false;
        this.helperService.createSnack(this.translated.MESSAGES.INCORRECT_PASS,
          this.translated.LOGGER.MESSAGES.PASSWORDCHANGE_UNSUCCESS, this.helperService.constants.status.ERROR);

      }
    }, (error) => {
      this.loading = false;
      this.helperService.createSnack(this.translated.MESSAGES.CHANGEPASSWORD_FAIL,
        this.translated.LOGGER.MESSAGES.PASSWORDCHANGE_UNSUCCESS, this.helperService.constants.status.ERROR);
      this.helperService.appLoggerDev(this.helperService.constants.status.ERROR, `${error.error.detail +
      this.translated.LOGGER.MESSAGES.STATUS + error.status}`);
      this.helperService.appLoggerDev(this.translated.MESSAGES.CHANGEPASSWORD_FAIL,
        this.translated.LOGGER.MESSAGES.PASSWORDCHANGE_UNSUCCESS);
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

