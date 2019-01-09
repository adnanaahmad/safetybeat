import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/shared/settings/setting.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  theme: String;
  constructor(public settings: SettingService, ) { }

  ngOnInit() {
    this.settings.getActiveTheme().subscribe(val => {
      this.theme = val;
    });
  }


  changed() {
    if (this.theme == 'dark-theme') {
      this.settings.setActiveTheme('light-theme')
    } else {
      this.settings.setActiveTheme('dark-theme')
    }
  }
}
