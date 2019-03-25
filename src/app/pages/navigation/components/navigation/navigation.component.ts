import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { CoreService } from 'src/app/core/services/authorization/core.service';
import { TranslateService } from '@ngx-translate/core';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { Translation } from 'src/app/models/translate.model';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { NavItem } from 'src/app/models/navItems.model';
import { findIndex } from 'lodash';
import { AdminControlService } from 'src/app/pages/adminControl/services/adminControl.service';
import { Router } from '@angular/router';
import { EntityUserData } from 'src/app/models/userEntityData.model';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';
import { NavigationService } from '../../services/navigation.service';

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
  constructor(
    public core: CoreService,
    public translate: TranslateService,
    public adminServices: AdminControlService,
    private logging: LoggingService,
    private router: Router,
    public compiler: CompilerProvider,
    private navService: NavigationService
  ) {
    translate
      .get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER'])
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
    let index = findIndex(this.entityUserData.entities, function(entity){
      return entity.active===true
    });
    this.selectedEntity = (index!=-1)?this.entityUserData.entities[index]:this.entityUserData.entities[0];
    this.switchSideMenu(this.selectedEntity);
    this.viewAllEntities();
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
  switchListDefault(data) {
    this.navLinks = this.compiler.switchSideMenuDefault(data)
  }

  switchSideMenu(data: any) {
    this.Entity = data;
    this.navService.changeRole(this.Entity.role);
    this.navLinks = this.compiler.switchSideMenuDefault(data)
  }

  viewAllEntities() {
    // var data = {
    //   'moduleName': 'Safetybeat'
    // };
    // this.adminServices.viewEntities(data).subscribe((res)=>{
    //   this.entitiesList = res;
    //   this.allEntitiesData = this.entitiesList.data.result;
    // })
    this.navService.data.subscribe((res)=>{
      debugger;
      this.allEntitiesData = res;
    }),(error)=>{
      debugger;
    }
  }
}
