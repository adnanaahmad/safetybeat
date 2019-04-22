import {Component, OnInit} from '@angular/core';
import {SettingService} from 'src/app/shared/settings/setting.service';
import {OverlayContainer} from '@angular/cdk/overlay';
import {Translation} from 'src/app/models/translate.model';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public dialogRef: MatDialogRef<SettingsComponent>;
  themeSelected: any;
  translated: Translation;
  appIcons: any;
  appConstants: any;
  appTheme: any;
  settingFeatures = {'general': true, 'security': false, 'organization': false, 'group': false, 'entity': false, 'theme': false};
  formErrorMatcher: any;
  currentPassword: string;
  password1: any;
  password2: any;

  constructor(
    public settings: SettingService,
    public overlay: OverlayContainer,
    public helperService: HelperService,
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
}

