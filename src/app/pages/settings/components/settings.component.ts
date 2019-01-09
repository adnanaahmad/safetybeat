import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/shared/settings/setting.service';
import { ConstantService } from '../../../shared/constant/constant.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  theme: String;
  constructor(public settings: SettingService) { }

  ngOnInit() {
    this.settings.getActiveTheme().subscribe(val => {
      this.theme = val;
    });
  }


  changed() {
    if (this.theme == ConstantService.config.theme.dark) {
      this.settings.setActiveTheme(ConstantService.config.theme.light)
    } else {
      this.settings.setActiveTheme(ConstantService.config.theme.dark)
    }
  }
}
