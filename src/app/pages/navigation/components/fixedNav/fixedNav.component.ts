import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { TranslateService } from '@ngx-translate/core';
import { Translation } from 'src/app/models/translate.model';

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
  public navLinks = [
    { path: '/home', icon: 'dashboard' },
    { path: '/home/profile', icon: 'person' },
    { path: '/home', icon: 'supervised_user_circle' }
  ];
  public navLinksBottom = [
    { path: '/home', icon: 'search' },
    { path: '/home', icon: 'add' },
    { path: '/home', icon: 'notification_important' },
    { path: '/home', icon: 'help' },
    { path: '/home/settings', icon: 'settings' }
  ];

  constructor(public translate: TranslateService,
    private logging: LoggingService) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER']).subscribe((values) => {
      this.translated = values;
    });
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
