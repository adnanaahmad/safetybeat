import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/shared/settings/setting.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
import { Translation } from 'src/app/models/translate.model';
import { ConstantService } from 'src/app/shared/constant/constant.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  themeSelected: any;
  translated: Translation;
  appIcons: any;
  appConstants: any;
  constructor(public settings: SettingService,
    public overlay: OverlayContainer,
    private translate: TranslateService) {
    this.translate.get(['LOGGER', 'BUTTONS', 'AUTH', 'MESSAGES', 'STRINGS']).subscribe((values) => {
      this.translated = values;
    });
    this.appConstants = ConstantService.appConstant;
    this.appIcons = ConstantService.appIcons;
  }

  ngOnInit() {
    this.settings.getActiveTheme().subscribe(val => {
      this.themeSelected = val;
    });
  }


  changed() {
    this.settings.setActiveTheme(this.themeSelected);
    this.overlay.getContainerElement().classList.forEach((value, index) => {
      if (index !== 0) {
        this.overlay.getContainerElement().classList.remove(value);
      }
    });
    this.overlay.getContainerElement().classList.add(this.themeSelected);
  }
}
