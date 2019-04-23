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
import {CompilerProvider} from '../../../shared/compiler/compiler';
import {Organization} from '../../../models/Settings/setting.model';
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
  settingFeatures = {
    'general': true,
    'security': false,
    'organization': false,
    'group': false,
    'entity': false,
    'theme': false,
    'permission': false
  };
  disabled: boolean = false;
  entityId: any;
  createdBy: any;
  managedBy: any;
  changePasswordForm: FormGroup;
  formErrorMatcher: any;
  data: any;
  currentPassword: string;
  password1: any;
  password2: any;
  loading: boolean = false;
  organizationForm: FormGroup;
  orgID: any;


  constructor(
    public settings: SettingService,
    public overlay: OverlayContainer,
    public helperService: HelperService,
    private navService: NavigationService,
    private formBuilder: FormBuilder,
    public settingService: SettingsService,
    public compiler: CompilerProvider,
    private modalService: ProfileService
) {
    this.translated = this.helperService.translated;
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.SETTING_COMPONENT);
    this.appConstants = this.helperService.constants.appConstant;
    this.appIcons = this.helperService.constants.appIcons;
    this.appTheme = this.helperService.constants.appTheme;
  }
  /**
   * handling forms validations
   */
  get organizationViewForm() {
    return this.organizationForm.controls;
  }

  /**
   * this function is called when this components is initialized and this function subscribes to the activate theme
   * and we also have made entity form and change password form.
   */

  ngOnInit() {
    this.settings.getActiveTheme().subscribe(val => {
      this.themeSelected = val;
    });
    this.getOrganizationInfo();

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

    this.organizationForm = this.formBuilder.group({
      name: [''],
      accountNo: [''],
      address: [''],
      billingEmail: [''],
      dateJoined: [''],
      phoneNo: ['']

    });
  }

  getOrganizationInfo() {
    this.settingService.organizationData.subscribe((res) => {
      if (res === 1) {
        // it means page is refreshed we need to call the API
        this.settingService.getOrganization().subscribe((res) => {
          console.log(res);
          let orgObj = this.compiler.constructOrganizationObject(res);
          this.organizationViewForm['name'].setValue(orgObj.name);
          this.organizationViewForm['accountNo'].setValue(orgObj.accountNo);
          this.organizationViewForm['address'].setValue(orgObj.address);
          this.organizationViewForm['billingEmail'].setValue(orgObj.billingEmail);
          this.organizationViewForm['dateJoined'].setValue(orgObj.dateJoined);
          this.organizationViewForm['phoneNo'].setValue(orgObj.phoneNo);
          this.orgID = orgObj.id;
          this.organizationForm.disable();
        });
      } else {
        // it means that we dont need to call API
      }
    });
  }

  /**
   * this function is used for subscribing the selectedEntityData and we get all the entity information and save them in
   * our global variables to show on tabular form.
   */

  ngAfterViewInit() {
    this.navService.selectedEntityData.subscribe((selectedEntity) => {
      if (selectedEntity !== 1) {
        this.allEntities = selectedEntity;
        this.entitiesData = this.allEntities.entityInfo;
        this.entityId = this.entitiesData.id;
        this.createdBy = this.entitiesData.createdBy;
        this.managedBy = this.entitiesData.managedBy;
      }
    });
  }

  /**
   * this function is used for checking the new password and confirm password match.
   * @params group
   */

  checkPasswords(group: FormGroup) {
    const pass = group.controls.password1.value;
    const confirmPass = group.controls.password2.value;
    return pass === confirmPass ? null : group.controls.password2.setErrors({notSame: true});
  }

  /**
   * this function is used for edit entity data.
   */

  editEntity() {
    this.disabled = true;
    this.entityForm.enable();
  }

  /**
   * this function is called when we click on cancel button to cancel the edit account.
   */

  editOrgForm() {
     this.disabled = true;
     this.organizationForm.enable();
  }

  cancelEditAccount() {
    this.disabled = false;
    this.entityForm.disable();
  }

  /**
   * this function is used for checking the validations of entityForm.
   */

  get entityDataForm() {
    return this.entityForm.controls;
  }

  cancelOrgForm() {
    this.disabled = false;
    this.organizationForm.disable();
  }

  /**
   * this function is used for change password form validations.
   */

  get changePasswordFormValidations() {
    return this.changePasswordForm.controls;
  }

  /**
   * this function is used for changing the theme.
   */

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

  /**
   * this function is used for changing the mat cards in the settings.
   * @params settings
   */

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

  /**
   * this function is used for updating the entity data using entityForm.
   * @params value
   * @params valid
   */

  updateEntity({value, valid}: { value: EditEntity; valid: boolean }): void {
    this.disabled = false;
    this.entityForm.disable();
    let data = {
      'name': value.name,
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

  updateOrganization({value, valid}: { value: Organization; valid: boolean }): void {
    this.disabled = false;
    this.organizationForm.disable();
    let data = {
      'name': value.name,
      'accountNo': value.accountNo,
      'address': value.address,
      'dateJoined': value.dateJoined,
      'phoneNo': value.phoneNo,
      'billingEmail' : value.billingEmail,
      'type': 2
    };
    if (!valid) {
      this.helperService.appLogger(this.translated.STATUS.ERROR, 'Invalid Fields');
      return;
    }
    this.settingService.editOrganization(this.orgID, data).subscribe((res) => {
      this.helperService.createSnack('Entity has been updated Successfully', 'Entity Updated', this.helperService.constants.status.SUCCESS);
    });
  }

  /**
   * this function is used for change password api call it accepts the data in the form of old password and new password and
   * changes the password.
   * @params value
   * @params valid
   * @params formDirective
   */

  changePassword({value, valid}: { value: changePassword; valid: boolean }, formDirective: FormGroupDirective): void {
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
        formDirective.resetForm();
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

    });
  }

  /**
   * this function is used to clear the validations of the change password form when user clicks on cancel button.
   */

  clearValidations() {
    Object.keys(this.changePasswordForm.controls).forEach(key => {
      this.changePasswordForm.controls[key].setErrors(null);
    });
  }
}

