import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { NavItem } from 'src/app/models/navItems.model';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-fixed-nav',
  templateUrl: './fixedNav.component.html',
  styleUrls: ['./fixedNav.component.scss']
})
export class FixedNavComponent implements OnInit {
  @Input()
  navOpened: boolean;
  @Output() sidenavToggle = new EventEmitter<boolean>();
  @Output() switchNavList = new EventEmitter();
  @Output() switchNavListDefault = new EventEmitter();
  @Input() public selectedEntity;
  translated: Translation;
  expanded: boolean;
  appIcons: any;
  public navLinks: NavItem[] = [];
  public defaultNavLinks: NavItem[] = [
    {
      route: '/home',
      iconName: this.helperService.constants.appIcons.dashboard,
      toolTip: 'Dashboard'
    },
    {
      route: '/home/adminControl/entityControl',
      iconName: this.helperService.constants.appIcons.contacts,
      toolTip: 'Entity Control Center'
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
  allEntitiesData: any;
  joinEntityData: { moduleName: string };

  constructor(
    public helperService: HelperService,
  ) {
    this.translated = this.helperService.translation;
    this.appIcons = this.helperService.constants.appIcons;
    this.navLinks = this.defaultNavLinks;
  }
  // Toggle the sidenav
  public toggleSideNav() {
    this.navOpened = !this.navOpened;
    this.helperService.appLoggerDev(
      this.helperService.constants.status.INFO,
      `${this.translated.LOGGER.MESSAGES.SIDE_NAV + this.navOpened}`
    );
    this.sidenavToggle.emit(this.navOpened);
  }

  /**
   * this function...
   */
  public switchNavListMenuDefault() {
    this.navLinks = this.defaultNavLinks;
    this.switchNavListDefault.emit();
  }
  ngOnInit() { }
}
