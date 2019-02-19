import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { CoreService } from 'src/app/core/services/authorization/core.service';
import { TranslateService } from '@ngx-translate/core';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { Translation } from 'src/app/models/translate.model';
import { ConstantService } from 'src/app/shared/constant/constant.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit, OnDestroy {
  translated: Translation;
  appIcons: any;
  public navLinks = [
    { path: '/home', icon: ConstantService.appIcons.dashboard, label: 'Dashboard' },
    { path: '/home/profile', icon: ConstantService.appIcons.person, label: 'Profile' },
    { path: '/home', icon: ConstantService.appIcons.supervisedUserCircle, label: 'My Team' }
  ];
  public navLinksBottom = [
    { path: '/home', icon: ConstantService.appIcons.dashboard, label: 'Search' },
    { path: '/home/profile', icon: ConstantService.appIcons.person, label: 'Add' },
    { path: '/home', icon: ConstantService.appIcons.supervisedUserCircle, label: 'Notifications' },
    { path: '/home', icon: ConstantService.appIcons.supervisedUserCircle, label: 'Help' },
    { path: '/home/settings', icon: ConstantService.appIcons.settings, label: 'Settings' }
  ];
  constructor(public core: CoreService,
    public translate: TranslateService,
    private logging: LoggingService) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER']).subscribe((values) => {
      this.translated = values;
      this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.NAVIGATION_COMPONENT);
    });
    this.appIcons = ConstantService.appIcons;
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.logging.hideAllAppLoggers();
  }

}
