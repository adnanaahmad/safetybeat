import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { LoggingService } from "src/app/shared/logging/logging.service";
import { TranslateService } from "@ngx-translate/core";
import { Translation } from "src/app/models/translate.model";
import { ConstantService } from "src/app/shared/constant/constant.service";
import { NavItem } from "src/app/models/navItems.model";
import { Router } from "@angular/router";
import { share } from "rxjs/operators";
import { AdminControlService } from "src/app/pages/adminControl/services/adminControl.service";

@Component({
  selector: "app-fixed-nav",
  templateUrl: "./fixedNav.component.html",
  styleUrls: ["./fixedNav.component.scss"]
})
export class FixedNavComponent implements OnInit {
  @Input()
  navOpened: boolean;
  @Output() sidenavToggle = new EventEmitter<boolean>();
  @Output() switchNavList = new EventEmitter();
  @Output() switchNavListDefault = new EventEmitter();
  translated: Translation;
  expanded: boolean;
  appIcons: any;
  public navLinks: NavItem[] = [];
  public defaultNavLinks: NavItem[] = [
    { route: "/home", iconName: ConstantService.appIcons.dashboard },
    { route: "/home/profile/user", iconName: ConstantService.appIcons.group },
    {
      iconName: ConstantService.appIcons.showChart,
      children: [
        {
          displayName: "Action Report",
          route: "/home/analyticsReport/actionReport"
        },
        {
          displayName: "Average Daily Actions",
          route: "/home/analyticsReport/averageDailyActionsReport"
        },
        {
          displayName: "Checkin by Activity",
          route: "/home/analyticsReport/checkInActivityReport"
        },
        {
          displayName: "Checkin and Alert by Person",
          route: "/home/analyticsReport/alertsPersonReport"
        },
        {
          displayName: "Actions vs Alerts",
          route: "/home/analyticsReport/actionAlertsReport"
        },
        {
          displayName: "Pulse Report by Entity",
          route: "/home/analyticsReport/entityPulseReport"
        },
        {
          displayName: "Pulse Report by Person",
          route: "/home/analyticsReport/personPulseReport"
        },
        {
          displayName: "Compliant Checkout",
          route: "/home/analyticsReport/compliantCheckoutReport"
        },
        {
          displayName: "Site Activity Report",
          route: "/home/analyticsReport/siteActivityReport"
        },
        {
          displayName: "Hazard Reports",
          route: "/home/analyticsReport/hazardReport"
        }
      ]
    },
    {
      route: "/home/adminControl/entityControl",
      iconName: ConstantService.appIcons.contacts
    },
    {
      route: "/home/documents",
      iconName: ConstantService.appIcons.insertDriveFile
    }
  ];
  public navLinksBottom: NavItem[] = [
    { route: "/home/profile", iconName: ConstantService.appIcons.person },
    { route: "/home", iconName: ConstantService.appIcons.help },
    { route: "/home/settings", iconName: ConstantService.appIcons.settings }
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
      .get(["AUTH", "BUTTONS", "MESSAGES", "LOGGER"])
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
  public switchNavListMenu() {
    this.navLinks = [
      { route: "/home", iconName: ConstantService.appIcons.dashboard },
      {
        iconName: ConstantService.appIcons.showChart,
        children: [
          {
            displayName: "Action Report",
            route: "/home/analyticsReport/actionReport"
          },
          {
            displayName: "Average Daily Actions",
            route: "/home/analyticsReport/averageDailyActionsReport"
          },
          {
            displayName: "Checkin by Activity",
            route: "/home/analyticsReport/checkInActivityReport"
          },
          {
            displayName: "Checkin and Alert by Person",
            route: "/home/analyticsReport/alertsPersonReport"
          },
          {
            displayName: "Actions vs Alerts",
            route: "/home/analyticsReport/actionAlertsReport"
          },
          {
            displayName: "Pulse Report by Entity",
            route: "/home/analyticsReport/entityPulseReport"
          },
          {
            displayName: "Pulse Report by Person",
            route: "/home/analyticsReport/personPulseReport"
          },
          {
            displayName: "Compliant Checkout",
            route: "/home/analyticsReport/compliantCheckoutReport"
          },
          {
            displayName: "Site Activity Report",
            route: "/home/analyticsReport/siteActivityReport"
          },
          {
            displayName: "Hazard Reports",
            route: "/home/analyticsReport/hazardReport"
          }
        ]
      }
    ];
    this.switchNavList.emit();
  }
  public switchNavListMenuDefault() {
    this.navLinks = this.defaultNavLinks
    this.switchNavListDefault.emit();
  }
  ngOnInit() {}

  onItemSelected(navLinks: NavItem) {
    if (!navLinks.children || !navLinks.children.length) {
      this.router.navigate([navLinks.route]);
    }
    if (navLinks.children && navLinks.children.length) {
      this.expanded = !this.expanded;
    }
  }
}
