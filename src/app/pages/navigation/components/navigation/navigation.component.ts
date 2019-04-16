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
import {SitesInfo} from 'src/app/models/site.model';
import {NavigationModel} from '../../../../models/navigation/navigation.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Output() entitySelected = new EventEmitter();
  moduleData = {
    moduleName: 'Safetybeat'
  };
  navModel: NavigationModel = <NavigationModel>{};
  private sitesList: any;
  private sitesData: SitesInfo[];

  constructor(
    public core: CoreService,
    public adminServices: AdminControlService,
    public compiler: CompilerProvider,
    private navService: NavigationService,
    public helperService: HelperService
  ) {
    this.initialize();
    this.helperService.appLoggerDev(
      this.helperService.constants.status.SUCCESS,
      this.navModel.translated.LOGGER.MESSAGES.NAVIGATION_COMPONENT
    );

  }

  ngOnInit() {
  }

  initialize() {
    this.navModel.translated = this.helperService.translated;
    this.navModel.navLinks = [];
    this.navModel.defaultList = [];
    this.navModel.empty = true;
    this.navModel.appIcons = this.helperService.constants.appIcons;
    this.navModel.navLinks = this.navModel.defaultList;
  }

  ngAfterViewInit() {
    this.navService.data.subscribe((res) => {
      if (res !== 1) {
        this.navModel.allEntitiesData = res;
        this.navModel.entityUserData = this.navModel.allEntitiesData.entities;
        this.navModel.empty = false;
        let index = this.helperService.findIndex(this.navModel.entityUserData, function (entity) {
          return entity.active === true
        });
        this.navModel.selectedEntity =
          index !== -1 ? this.navModel.entityUserData[index] : this.navModel.entityUserData[0];
        this.switchSideMenu(this.navModel.selectedEntity);
      } else {
        this.adminServices
          .viewEntities(this.moduleData)
          .subscribe(entitesData => {
            this.navModel.allEntitiesData = entitesData;
            this.navModel.entityUserData = this.compiler.constructUserEntityData(
              this.navModel.allEntitiesData.data
            );
            this.navService.changeEntites(this.navModel.entityUserData);
          });
      }
    });
  }

  ngOnChanges() {
    this.navModel.empty = false;
  }

  ngOnDestroy() {
    this.helperService.hideLoggers();
  }

  switchList() {
    this.navModel.navLinks = [
      {
        route: '/home',
        iconName: this.navModel.appIcons.dashboard,
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
      this.navModel.entitiesList = res;
      this.navModel.entityUserData = this.navModel.entitiesList.data.result;
      this.navService.changeEntites(this.navModel.entityUserData);
    });
  }

  switchListDefault(data) {
    this.navModel.navLinks = this.compiler.switchSideMenuDefault(data);
  }

  /**
   * thuiguyg
   * @params data
   */
  switchSideMenu(data: any) {
    this.navModel.Entity = data;
    let entityData = {
      'entityId': this.navModel.Entity.entityInfo.id,
    }
    this.adminServices.viewSites(entityData).subscribe((res) => {
      this.sitesList = res;
      this.sitesData = this.compiler.constructSiteData(this.sitesList);
      this.adminServices.changeSites(this.sitesData);
    });
    this.navService.changeSelectedEntity(this.navModel.Entity);
    this.navService.changeRole(this.navModel.Entity.role);
    this.navService.changeRoleId(this.navModel.Entity.permissions.role);
    this.navModel.navLinks = this.compiler.switchSideMenuDefault(data);
  }
}
