import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/shared/settings/setting.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Translation } from 'src/app/models/translate.model';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { HelperService } from 'src/app/shared/helperService/helper.service';
@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  themeSelected: any;
  translated: Translation;
  appIcons: any;
  appConstants: any;
  appTheme: any;
  settingFeatures = { "general": true, "security": false, "organization": false, "group": false, "privacy": false, "theme": false};
  constructor(
    public settings: SettingService,
    public overlay: OverlayContainer,
    private logging: LoggingService,
    public helperService: HelperService
  ) {
    this.translated = this.helperService.translation;
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.SETTING_COMPONENT);
    this.appConstants = ConstantService.appConstant;
    this.appIcons = ConstantService.appIcons;
    this.appTheme = ConstantService.appTheme;
  }

  ngOnInit() {
    this.settings.getActiveTheme().subscribe(val => {
      this.themeSelected = val;
    });
  }

  changed() {
    this.settings.setActiveTheme(this.themeSelected);
    var self = this;
    this.helperService.iterations(this.overlay.getContainerElement().classList, function (value, index) {
      if (index !== 0) {
        self.overlay.getContainerElement().classList.remove(value);
      }
    })
    this.overlay.getContainerElement().classList.add(this.themeSelected);
  }

  changeSetting(settings: any) {
    var self = this
    this.helperService.iterations(this.settingFeatures, function (value, key) {
      if (key === settings) {
        self.settingFeatures[key] = true;
      } else {
        self.settingFeatures[key] = false;
      }
    })
  }
}
