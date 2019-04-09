import {Component, OnInit, OnDestroy, Output, EventEmitter, OnChanges, AfterViewInit} from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';
import {CoreService} from 'src/app/core/services/authorization/core.service';
import {Translation} from 'src/app/models/translate.model';
import {NavItem} from 'src/app/models/navItems.model';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {EntityUserData} from 'src/app/models/userEntityData.model';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {HelperService} from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Output() entitySelected = new EventEmitter();
  translated: Translation;
  appIcons: any;
  empty: boolean = true;
  navLinks: NavItem[] = [];
  entitiesList: any;
  entitesName: any = [];
  abc: any;
  allEntitiesData: any;
  joinEntityData: { moduleName: string };
  defaultList: NavItem[] = [];
  entityUserData: EntityUserData;
  selectedEntity;
  Entity: any;
  moduleData = {
    moduleName: 'Safetybeat'
  };

  constructor(
    public core: CoreService,
    public adminServices: AdminControlService,
    public compiler: CompilerProvider,
    private navService: NavigationService,
    public helperService: HelperService
  ) {
    this.translated = this.helperService.translation;
    this.helperService.appLoggerDev(
      this.helperService.constants.status.SUCCESS,
      this.translated.LOGGER.MESSAGES.NAVIGATION_COMPONENT
    );
    this.appIcons = this.helperService.constants.appIcons;
    this.navLinks = this.defaultList;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.navService.data.subscribe((res) => {
      if (res !== 1) {
        this.allEntitiesData = res;
        this.entityUserData = this.allEntitiesData.entities;
        this.empty = false;
        let index = this.helperService.findIndex(this.entityUserData, function (entity) {
          return entity.active === true
        });
        this.selectedEntity =
          index !== -1 ? this.entityUserData[index] : this.entityUserData[0];
        this.switchSideMenu(this.selectedEntity);
      } else {
        this.adminServices
          .viewEntities(this.moduleData)
          .subscribe(entitesData => {
            this.allEntitiesData = entitesData;
            this.entityUserData = this.compiler.constructUserEntityData(
              this.allEntitiesData.data
            );
            this.navService.changeEntites(this.entityUserData);
          });
      }
    })
  }

  ngOnChanges() {
    this.empty = false;
  }

  ngOnDestroy() {
    this.helperService.hideLoggers();
  }

  switchList() {
    this.navLinks = [
      {
        route: '/home',
        iconName: this.appIcons.dashboard,
        displayName: 'Dashboard',
        disabled: true
      },
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
    ];
  }

  viewAllEntities() {
    let data = {
      moduleName: 'Safetybeat'
    };
    this.adminServices.viewEntities(data).subscribe((res) => {
      this.entitiesList = res;
      this.entityUserData = this.entitiesList.data.result;
      this.navService.changeEntites(this.entityUserData);
    });
  }

  switchListDefault(data) {
    this.navLinks = this.compiler.switchSideMenuDefault(data);
  }

  switchSideMenu(data: any) {
    this.Entity = data;
    this.navService.changeSelectedEntity(this.Entity);
    this.navService.changeRole(this.Entity.role);
    this.navService.changeRoleId(this.Entity.permissions.role);
    this.navLinks = this.compiler.switchSideMenuDefault(data);
  }
}
