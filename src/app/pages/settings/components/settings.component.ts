import {Component, OnInit, AfterViewInit} from '@angular/core';
import {SettingService} from 'src/app/shared/settings/setting.service';
import {OverlayContainer} from '@angular/cdk/overlay';
import {Translation} from 'src/app/models/translate.model';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {EditEntity} from 'src/app/models/profile.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, AfterViewInit {
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

  constructor(
    public settings: SettingService,
    public overlay: OverlayContainer,
    public helperService: HelperService,
    private navService: NavigationService,
    private formBuilder: FormBuilder
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
  }

  ngAfterViewInit() {
    this.navService.selectedEntityData.subscribe((selectedEntity) => {
      this.allEntities = selectedEntity;
      this.entitiesData = this.allEntities.entityInfo;
      this.entityId = this.entitiesData.id;
      this.createdBy = this.entitiesData.createdBy;
      this.managedBy = this.entitiesData.managedBy;
    })
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


  changed() {
    this.settings.setActiveTheme(this.themeSelected);
    let self = this;
    this.helperService.iterations(this.overlay.getContainerElement().classList, function (value, index) {
      if (index !== 0) {
        self.overlay.getContainerElement().classList.remove(value);
      }
    })
    this.overlay.getContainerElement().classList.add(this.themeSelected);
  }

  changeSetting(settings: any) {
    let self = this
    this.helperService.iterations(this.settingFeatures, function (value, key) {
      if (key === settings) {
        self.settingFeatures[key] = true;
      } else {
        self.settingFeatures[key] = false;
      }
    })
  }

  updateEntity({value, valid}: { value: EditEntity; valid: boolean }): void {
    this.disabled = false;
    this.entityForm.disable();
    let data = {
       'code': value.code,
      'headOffice': value.headOffice,
      'managedBy': this.managedBy,
      'createdBy': this.createdBy
    }
    if (!valid) {
      this.helperService.appLogger(this.translated.STATUS.ERROR, 'Invalid Entity Fields');
      return;
    }
    this.settings.editEntity(this.entityId, data).subscribe((res) => {
      this.helperService.createSnack('Entity has been updated Successfully', 'Entity Updated', this.helperService.constants.status.SUCCESS);
    })


  }
}
