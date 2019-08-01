import {Component, OnInit} from '@angular/core';
import {SettingService} from 'src/app/services/common/settings/setting.service';
import {OverlayContainer} from '@angular/cdk/overlay';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public dialogRef: MatDialogRef<SettingsComponent>;
  themeSelected: any;
  settingFeatures = {
    'organization': true,
    'entity': false,
    'theme': false,
    'allUsers': false
  };

  constructor(
    public settings: SettingService,
    public overlay: OverlayContainer,
    public helperService: HelperService,
  ) {
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

