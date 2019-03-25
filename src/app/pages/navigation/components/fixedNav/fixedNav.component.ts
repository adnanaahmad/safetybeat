import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { TranslateService } from '@ngx-translate/core';
import { Translation } from 'src/app/models/translate.model';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { NavItem } from 'src/app/models/navItems.model';
import { Router } from '@angular/router';
import { share } from 'rxjs/operators';
import { AdminControlService } from 'src/app/pages/adminControl/services/adminControl.service';

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
      iconName: ConstantService.appIcons.dashboard,
      toolTip: 'Dashboard'
    },
    {
      route: '/home/adminControl/entityControl',
      iconName: ConstantService.appIcons.contacts,
      toolTip: 'Entity Control Center'
    }
  ];
  public navLinksBottom: NavItem[] = [
    {
      route: '/home/profile',
      iconName: ConstantService.appIcons.person,
      toolTip: 'Profile'
    },
    {
      route: '/home',
      iconName: ConstantService.appIcons.help,
      toolTip: 'Support Center'
    },
    {
      route: '/home/settings',
      iconName: ConstantService.appIcons.settings,
      toolTip: 'Settings'
    }
  ];
  entitiesList: any;
  allEntitiesData: any;
  joinEntityData: { moduleName: string };

  constructor(
    public translate: TranslateService,
    private logging: LoggingService,
    private adminServices: AdminControlService,
    private router: Router
  ) {
    translate
      .get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER'])
      .subscribe(values => {
        this.translated = values;
      });
    this.appIcons = ConstantService.appIcons;
    this.navLinks = this.defaultNavLinks;
  }
  // Toggle the sidenav
  public toggleSideNav() {
    this.navOpened = !this.navOpened;
    this.logging.appLoggerForDev(
      this.translated.LOGGER.STATUS.INFO,
      `${this.translated.LOGGER.MESSAGES.SIDE_NAV + this.navOpened}`
    );
    this.sidenavToggle.emit(this.navOpened);
  }
  public switchNavListMenuDefault() {
    debugger
    this.navLinks = this.defaultNavLinks;
    this.switchNavListDefault.emit();
  }
  ngOnInit() {}
}
