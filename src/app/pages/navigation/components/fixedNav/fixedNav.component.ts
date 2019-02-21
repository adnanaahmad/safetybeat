import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { TranslateService } from '@ngx-translate/core';
import { Translation } from 'src/app/models/translate.model';
import { ConstantService } from 'src/app/shared/constant/constant.service';

@Component({
  selector: 'app-fixed-nav',
  templateUrl: './fixedNav.component.html',
  styleUrls: ['./fixedNav.component.scss']
})
export class FixedNavComponent implements OnInit {
  @Input()
  navOpened: boolean;
  @Output()
  sidenavToggle = new EventEmitter<boolean>();
  translated: Translation;
  appIcons: any;
  public navLinks = [
    { path: '/home', icon: ConstantService.appIcons.dashboard },
    { path: '/home/profile/user', icon: ConstantService.appIcons.group },
    { icon: ConstantService.appIcons.supervisedUserCircle },
    { icon: ConstantService.appIcons.contacts },
    { icon: ConstantService.appIcons.showChart },
    { icon: ConstantService.appIcons.insertDriveFile },

  ];
  public navLinksBottom = [
    { path: '/home/profile', icon: ConstantService.appIcons.person },
    { path: '/home', icon: ConstantService.appIcons.notificationImportant },
    { path: '/home', icon: ConstantService.appIcons.help },
    { path: '/home/settings', icon: ConstantService.appIcons.settings }
  ];

  constructor(public translate: TranslateService,
    private logging: LoggingService) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER']).subscribe((values) => {
      this.translated = values;
    });
    this.appIcons = ConstantService.appIcons;
  }
  // Toggle the sidenav
  public toggleSideNav() {
    this.navOpened = !this.navOpened;
    this.logging.appLoggerForDev(this.translated.LOGGER.STATUS.INFO, `${this.translated.LOGGER.MESSAGES.SIDE_NAV + this.navOpened}`);
    this.sidenavToggle.emit(this.navOpened);
  }
  ngOnInit() {
  }

}
