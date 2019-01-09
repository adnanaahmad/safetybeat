import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { CoreService } from 'src/app/core/services/authorization/core.service';
import { TranslateService } from '@ngx-translate/core';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { Translation } from 'src/app/models/translate.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit {

  translated: Translation;
  public navLinks = [
    { path: '/home', icon: 'dashboard', label: 'Dashboard' },
    { path: '/home/profile', icon: 'supervised_user_circle', label: 'Profile' },
    { path: '/home/settings', icon: 'settings', label: 'Settings' }
  ];
  constructor(public core: CoreService,
    public translate: TranslateService,
    private logging: LoggingService) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER']).subscribe((values) => {
      this.translated = values;
    });
    this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.NAVIGATION_COMPONENT);
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.logging.hideAllAppLoggers()
  }

}
