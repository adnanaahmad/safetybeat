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
      route: '/home/profile/user',
      iconName: this.helperService.constants.appIcons.supervisedUserCircle,
      toolTip: 'Users'
    },
    {
      route: '/home/adminControl/entityControl',
      iconName: this.helperService.constants.appIcons.log,
      toolTip: 'Entity Control Center'
    },
    {
      route: '/home/adminControl/memberCenter',
      iconName: this.helperService.constants.appIcons.group,
      toolTip: 'Member Center'
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
      route: '/home/documents',
      iconName: this.helperService.constants.appIcons.insertDriveFile,
      toolTip: 'Documents'
    }
  ];
  public navLinksBottom: NavItem[] = [
    {
      route: '/home/profile',
      iconName: this.helperService.constants.appIcons.person,
      toolTip: 'Profile'
    },
    {
      route: '/home',
      iconName: this.helperService.constants.appIcons.help,
      toolTip: 'Support Center'
    },
    {
      route: '/home/settings',
      iconName: this.helperService.constants.appIcons.settings,
      toolTip: 'Settings'
    }
  ];
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
