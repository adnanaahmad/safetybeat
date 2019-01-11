import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/shared/settings/setting.service';
import { ConstantService } from '../../../shared/constant/constant.service';
import { OverlayContainer } from '@angular/cdk/overlay';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  themeSelected: any;
  constructor(public settings: SettingService,
    public overlay: OverlayContainer) { }

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
