import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/shared/settings/setting.service';
import { ConstantService } from '../../../shared/constant/constant.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  themeSelected: String;
  constructor(public settings: SettingService) { }

  ngOnInit() {
    this.settings.getActiveTheme().subscribe(val => {
      this.themeSelected = val
    });
  }


  changed() {
    this.settings.setActiveTheme(this.themeSelected)
  }
}
