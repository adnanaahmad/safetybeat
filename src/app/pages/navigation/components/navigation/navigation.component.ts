import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { CoreService } from 'src/app/core/services/authorization/core.service';
import { TranslateService } from '@ngx-translate/core';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { Translation } from 'src/app/models/translate.model';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { NavItem } from 'src/app/models/navItems.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit, OnDestroy {
  translated: Translation;
  appIcons: any;
  navLinks:NavItem[] = [
    { route: '/home', iconName: ConstantService.appIcons.dashboard, displayName: 'Dashboard' },
    { route: '/home/profile/user', iconName: ConstantService.appIcons.group, displayName: 'All Users' },
    { route: '/home', iconName: ConstantService.appIcons.supervisedUserCircle, displayName: 'My Team' },
    {
      iconName: ConstantService.appIcons.contacts,
      displayName: 'Admin Control',
      children: [
        {
          displayName: 'Entity Control',
          route:'/home/adminControl/entityControl'
        },
        {
          displayName: 'Member Center',
          route: '/home/adminControl/memberCenter'
        },
        {
          displayName: 'Site Center',
          route: '/home/adminControl/siteCenter'
        },
        {
          displayName: 'Question Center',
          route: '/home/adminControl/questionCenter'
        },
        {
          displayName: 'Permission Center',
          route: '/home/adminControl/permissionCenter'
        },
        {
          displayName: 'Hazard Center',
          route: '/home/adminControl/hazardCenter'
        },
      ]
    },
    { 
      iconName: ConstantService.appIcons.showChart,
      displayName: 'Analytics Reports',
      children: [
        {
          displayName: 'Action Report',
          route:'/home/analyticsReport/actionReport'
        },
        {
          displayName: 'Average Daily Actions',
          route: '/home/analyticsReport/averageDailyActionsReport'
        },
        {
          displayName: 'Checkin by Activity',
          route: '/home/analyticsReport/checkInActivityReport'
        },
        {
          displayName: 'Checkin and Alert by Person',
          route: '/home/analyticsReport/alertsPersonReport'
        },
        {
          displayName: 'Actions vs Alerts',
          route: '/home/analyticsReport/actionAlertsReport'
        },
        {
          displayName: 'Pulse Report by Entity',
          route: '/home/analyticsReport/entityPulseReport'
        },
        {
          displayName: 'Pulse Report by Person',
          route: '/home/analyticsReport/personPulseReport'
        },
        {
          displayName: 'Compliant Checkout',
          route: '/home/analyticsReport/compliantCheckoutReport'
        },
        {
          displayName: 'Site Activity Report',
          route: '/home/analyticsReport/siteActivityReport'
        },
        {
          displayName: 'Hazard Reports',
          route: '/home/analyticsReport/hazardReport'
        },
      ]
    },
    { route:'/home/documents',iconName: ConstantService.appIcons.insertDriveFile, displayName: 'Documents' }


  ];
  public navLinksBottom = [
    { path: '/home/profile', icon: ConstantService.appIcons.dashboard, label: 'Profile' },
    { path: '/home', icon: ConstantService.appIcons.supervisedUserCircle, label: 'Notifications' },
    { path: '/home', icon: ConstantService.appIcons.supervisedUserCircle, label: 'Support' },
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
