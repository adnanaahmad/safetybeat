import { Component, OnInit, OnDestroy } from "@angular/core";
import { ChangeDetectionStrategy } from "@angular/core";
import { CoreService } from "src/app/core/services/authorization/core.service";
import { TranslateService } from "@ngx-translate/core";
import { LoggingService } from "src/app/shared/logging/logging.service";
import { Translation } from "src/app/models/translate.model";
import { ConstantService } from "src/app/shared/constant/constant.service";
import { NavItem } from "src/app/models/navItems.model";
import * as _ from "lodash";
import { share } from "rxjs/operators";
import { AdminControlService } from "src/app/pages/adminControl/services/adminControl.service";
import { Router } from "@angular/router";
import { EntityUserData } from "src/app/models/userEntityData.model";
import { disableDebugTools } from "@angular/platform-browser";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit, OnDestroy {
  translated: Translation;
  appIcons: any;
  empty: boolean = false;
  navLinks: NavItem[] = [];
  entitiesList: string;
  entitesName: any = [];
  abc: any;
  allEntitiesData: any;
  joinEntityData: { moduleName: string };
  defaultList: NavItem[] = [];
  entityUserData: EntityUserData;
  selectedEntity;
  constructor(
    public core: CoreService,
    public translate: TranslateService,
    public adminServices: AdminControlService,
    private logging: LoggingService,
    private router: Router
  ) {
    translate
      .get(["AUTH", "BUTTONS", "MESSAGES", "LOGGER"])
      .subscribe(values => {
        this.translated = values;
        this.logging.appLoggerForDev(
          this.translated.LOGGER.STATUS.SUCCESS,
          this.translated.LOGGER.MESSAGES.NAVIGATION_COMPONENT
        );
      });
    this.appIcons = ConstantService.appIcons;
    this.navLinks = this.defaultList;
  }

  ngOnInit() {
    this.entityUserData = JSON.parse(localStorage.getItem("entityUserData"));
    let index = _.findIndex(this.entityUserData.entities, function(entity){
      return entity.active===true
    });
    this.selectedEntity = (index!=-1)?this.entityUserData.entities[index]:this.entityUserData.entities[0]
    this.switchSideMenu(this.selectedEntity)
  }
  ngOnDestroy() {
    this.logging.hideAllAppLoggers();
  }
  switchList() {
    this.navLinks = [
      {
        route: "/home",
        iconName: ConstantService.appIcons.dashboard,
        displayName: "Dashboard",
        disabled: true
      },
      {
        displayName: "Action Report",
        route: "/home/analyticsReport/actionReport",
        disabled: true
      },
      {
        displayName: "Average Daily Actions",
        route: "/home/analyticsReport/averageDailyActionsReport",
        disabled: true
      },
      {
        displayName: "Checkin by Activity",
        route: "/home/analyticsReport/checkInActivityReport",
        disabled: true
      },
      {
        displayName: "Checkin and Alert by Person",
        route: "/home/analyticsReport/alertsPersonReport",
        disabled: true
      },
      {
        displayName: "Actions vs Alerts",
        route: "/home/analyticsReport/actionAlertsReport",
        disabled: true
      },
      {
        displayName: "Pulse Report by Entity",
        route: "/home/analyticsReport/entityPulseReport",
        disabled: true
      },
      {
        displayName: "Pulse Report by Person",
        route: "/home/analyticsReport/personPulseReport",
        disabled: true
      },
      {
        displayName: "Compliant Checkout",
        route: "/home/analyticsReport/compliantCheckoutReport",
        disabled: true
      },
      {
        displayName: "Site Activity Report",
        route: "/home/analyticsReport/siteActivityReport",
        disabled: true
      },
      {
        displayName: "Hazard Reports",
        route: "/home/analyticsReport/hazardReport",
        disabled: true
      }
    ];
  }
  switchListDefault() {
    this.navLinks = this.defaultList;
  }

  switchSideMenu(data: any) {
    console.log(data);
    if (data) {
      this.navLinks = [
        {
          route: "/home",
          iconName: ConstantService.appIcons.dashboard,
          displayName: "Dashboard",
          disabled: data.permissions.dashboard
        },
        {
          route: "/home/profile/user",
          iconName: ConstantService.appIcons.group,
          displayName: "Users",
          disabled: data.permissions.allUsers
        },
        {
          displayName: "Entity Control",
          route: "/home/adminControl/entityControl",
          disabled: data.permissions.entityControl
        },
        {
          displayName: "Member Center",
          route: "/home/adminControl/memberCenter",
          disabled: data.permissions.myTeam
        },
        {
          displayName: "Site Center",
          route: "/home/adminControl/siteCenter",
          disabled: data.permissions.siteCenter
        },
        {
          displayName: "Question Center",
          route: "/home/adminControl/questionCenter",
          disabled: data.permissions.questionCenter
        },
        {
          displayName: "Permission Center",
          route: "/home/adminControl/permissionCenter",
          disabled: data.permissions.permissionCenter
        },
        {
          displayName: "Hazard Center",
          route: "/home/adminControl/hazardCenter",
          disabled: data.permissions.hazardCenter
        },
        {
          displayName: "Invite Users",
          disabled: data.permissions.inviteUsers
        },

        {
          route: "/home/documents",
          iconName: ConstantService.appIcons.insertDriveFile,
          displayName: "Documents",
          disabled: data.permissions.documents
        }
      ];
    }
    else{
      
    }
  }
}
