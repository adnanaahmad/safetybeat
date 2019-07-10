import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavItem } from 'src/app/models/navItems.model';
import { HelperService } from 'src/app/shared/helperService/helper.service';
import { FixedNavModel } from 'src/app/models/navigation/fixedNav.model';

@Component({
  selector: 'app-fixed-nav',
  templateUrl: './fixedNav.component.html',
  styleUrls: ['./fixedNav.component.scss']
})
export class FixedNavComponent implements OnInit {
  @Input() navOpened: boolean;
  @Output() sidenavToggle = new EventEmitter<boolean>();
  @Output() switchNavList = new EventEmitter();
  @Output() switchNavListDefault = new EventEmitter();
  @Input() public selectedEntity;

  fixedNav: FixedNavModel = <FixedNavModel>{};
  appIcons: any;
  public navLinks: NavItem[] = [];
  public defaultNavLinks: NavItem[] = [
    {
      route: '/home',
      iconName: this.helperService.constants.appIcons.dashboard,
      toolTip: 'Dashboard'
    },
    {
      route: '/home/adminControl/memberCenter',
      iconName: this.helperService.constants.appIcons.person,
      toolTip: 'Member Center'
    },
    {
      route: '/home/adminControl/entityControl',
      iconName: this.helperService.constants.appIcons.log,
      toolTip: 'Entity Control Center'
    },
    {
      route: '/home/adminControl/myTeam',
      iconName: this.helperService.constants.appIcons.group,
      toolTip: 'My Team'
    },
    {
      route: '/home/adminControl/siteCenter',
      iconName: this.helperService.constants.appIcons.domain,
      toolTip: 'Site Center'
    },
    {
      route: '/home/adminControl/questionCenter',
      iconName: this.helperService.constants.appIcons.help,
      toolTip: 'Question Center'
    },
    {
      route: '/home/adminControl/hazardCenter',
      iconName: this.helperService.constants.appIcons.warning,
      toolTip: 'Hazard Center'
    },
    {
      route: '/home/adminControl/documents',
      iconName: this.helperService.constants.appIcons.insertDriveFile,
      toolTip: 'Documents'
    },
    {
      iconName: 'bar_chart',
      toolTip: 'Reports'
    }
  ];
  public navLinksBottom: NavItem[] = [
    {
      route: '/home',
      iconName: this.helperService.constants.appIcons.questionAnswer,
      toolTip: 'Support Center'
    },
    {
      route: '/home/settings',
      iconName: this.helperService.constants.appIcons.settings,
      toolTip: 'Settings'
    }
  ];

  public reportLinks: NavItem[] = [
    {
      displayName: 'Action Report',
      route: '/home/analyticsReport/actionReport',
      disabled: true
    },
    {
      displayName: 'Average Daily Actions',
      route: '/home/analyticsReport/averageDailyActionsReport',
      disabled: true
    },
    {
      displayName: 'Checkin by Activity',
      route: '/home/analyticsReport/checkInActivityReport',
      disabled: true
    },
    {
      displayName: 'Checkin and Alert by Person',
      route: '/home/analyticsReport/alertsPersonReport',
      disabled: true
    },
    {
      displayName: 'Actions vs Alerts',
      route: '/home/analyticsReport/actionAlertsReport',
      disabled: true
    },
    {
      displayName: 'Pulse Report by Entity',
      route: '/home/analyticsReport/entityPulseReport',
      disabled: true
    },
    {
      displayName: 'Pulse Report by Person',
      route: '/home/analyticsReport/personPulseReport',
      disabled: true
    },
    {
      displayName: 'Compliant Checkout',
      route: '/home/analyticsReport/compliantCheckoutReport',
      disabled: true
    },
    {
      displayName: 'Site Activity Report',
      route: '/home/analyticsReport/siteActivityReport',
      disabled: true
    },
    {
      displayName: 'Hazard Reports',
      route: '/home/analyticsReport/hazardReport',
      disabled: true
    }
  ]
  entitiesList: any;

  constructor(
    public helperService: HelperService,
  ) {
    this.fixedNav.translated = this.helperService.translated;
    this.fixedNav.appIcons = this.helperService.constants.appIcons;
    this.navLinks = this.defaultNavLinks;
  }

  /**
   * this function is used for toggling the sideNav bar to open or to close.
   */
  public toggleSideNav() {
    this.navOpened = !this.navOpened;
    this.helperService.appLoggerDev(
      this.helperService.constants.status.INFO,
      `${this.fixedNav.translated.LOGGER.MESSAGES.SIDE_NAV + this.navOpened}`
    );
    this.sidenavToggle.emit(this.navOpened);
  }

  /**
   * this function is used for switching the nav bar menu according to the role of the user in that
   * particular entity.
   */
  public switchNavListMenuDefault() {
    this.navLinks = this.defaultNavLinks;
    this.switchNavListDefault.emit();
  }

  ngOnInit() {
  }
}
