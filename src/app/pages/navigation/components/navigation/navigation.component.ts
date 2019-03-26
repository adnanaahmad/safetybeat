import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { CoreService } from 'src/app/core/services/authorization/core.service';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { Translation } from 'src/app/models/translate.model';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { NavItem } from 'src/app/models/navItems.model';
import { findIndex } from 'lodash';
import { AdminControlService } from 'src/app/pages/adminControl/services/adminControl.service';
import { EntityUserData } from 'src/app/models/userEntityData.model';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';
import { NavigationService } from '../../services/navigation.service';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit, OnDestroy {
  @Output() entitySelected =  new EventEmitter();;
  translated: Translation;
  appIcons: any;
  empty: boolean = false;
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
    'moduleName': 'Safetybeat'
  }
  constructor(
    public core: CoreService,
    public adminServices: AdminControlService,
    private logging: LoggingService,
    public compiler: CompilerProvider,
    private navService: NavigationService,
    public helperService: HelperService,
  ) {
    this.translated = this.helperService.translation;
    this.logging.appLoggerForDev(
      this.translated.LOGGER.STATUS.SUCCESS,
      this.translated.LOGGER.MESSAGES.NAVIGATION_COMPONENT
    );
    this.appIcons = ConstantService.appIcons;
    this.navLinks = this.defaultList;
  }

  ngOnInit() {
    debugger
    // this.viewAllEntities();
  }
  ngAfterViewInit(){
    this.navService.data.subscribe((res)=>{
      if(res!==1){
        debugger;
        this.allEntitiesData = res;
        this.entityUserData = this.allEntitiesData.entities;
        let index = findIndex(this.entityUserData, function(entity){
          return entity.active===true
        });
        this.selectedEntity = (index!=-1)?this.entityUserData[index]:this.entityUserData[0];
        this.switchSideMenu(this.selectedEntity);
      } else {
        this.adminServices.viewEntities(this.moduleData).subscribe((entitesData)=>{
          this.allEntitiesData = entitesData;
          this.entityUserData = this.compiler.constructUserEntityData(this.allEntitiesData.data);
          this.navService.changeEntites(this.entityUserData);
        })
      }

    })
  }
  ngOnDestroy() {
    this.logging.hideAllAppLoggers();
  }
  switchList() {
    this.navLinks = [
      {
        route: '/home',
        iconName: ConstantService.appIcons.dashboard,
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
      },
    ];
  }
  viewAllEntities() {
    var data = {
      'moduleName': 'Safetybeat'
    };
    this.adminServices.viewEntities(data).subscribe((res)=>{
      debugger
      this.entitiesList = res;
      this.entityUserData = this.entitiesList.data.result;
      this.navService.changeEntites(this.entityUserData);
    })
  }
  switchListDefault(data) {
    this.navLinks = this.compiler.switchSideMenuDefault(data)
  }

  switchSideMenu(data: any) {
    debugger
    this.Entity = data;
    this.navService.changeRole(this.Entity.role);
    this.navService.changeRoleId(this.Entity.permissions.role);
    this.navLinks = this.compiler.switchSideMenuDefault(data)
  }
}
