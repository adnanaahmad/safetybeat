import {Component, OnInit} from '@angular/core';
import {SettingService} from 'src/app/shared/settings/setting.service';
import {OverlayContainer} from '@angular/cdk/overlay';
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
  settingFeatures = {'general': true, 'security': false, 'organization': false, 'group': false, 'entity': false, 'theme': false};

  constructor(
    public settings: SettingService,
    public overlay: OverlayContainer,
    public helperService: HelperService,
  ) {
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS,
      this.helperService.translated.LOGGER.MESSAGES.SETTING_COMPONENT);
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
      self.settingFeatures[key] = key === settings;
    });
  }
}

