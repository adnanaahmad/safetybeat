import { Injectable } from '@angular/core';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { EntityUserData, Entity } from 'src/app/models/userEntityData.model';
import { HelperService } from '../helperService/helper.service';

@Injectable()
export class CompilerProvider {
  newMenu: any = []
  navList: any = []
  constructor(
    public helperService: HelperService
  ) { }
  /**
   * @param event
   * To check if the input is number or not
   */
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.key;
    return !(
      charCode > 31 &&
      (charCode < 48 || charCode > 57) &&
      charCode !== 43
    );
  }
  constructUserData(profileApiResponse: any) {
    let user = {
      username: profileApiResponse.username,
      first_name: profileApiResponse.first_name,
      last_name: profileApiResponse.last_name,
      email: profileApiResponse.email,
      mobile_no: profileApiResponse.mobile_no
    };
    return user;
  }
  insertSpaces(string) {
    string = string.replace(/([a-z])([A-Z])/g, '$1 $2');
    string = string.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    return string;
  }
  constructProfileData(loginApiResponse: any) {
    let profileData = {
      userid: loginApiResponse.userId,
      orgid: loginApiResponse.orgId,
      role: loginApiResponse.role
    };

    return profileData;
  }

  constructUserEntityData(loginApiResponse: any): EntityUserData {
    debugger
    let allEntities: Entity[] = [];
    this.helperService.iterations(loginApiResponse, function (entity) {
      let data: Entity = {
        entityInfo: entity.entity,
        permissions: entity.permissions,
        reportAccess: entity.reportAccess,
        administrator: entity.administrator,
        active: entity.active,
        role: entity.role
      };
      allEntities.push(data);
    });
    let userEntityData: EntityUserData = {
      // user: loginApiResponse.user,
      entities: allEntities
    };
    return userEntityData;
  }

  switchSideMenu(data, name) {
    this.navList = [
      {
        route: '/home',
        iconName: ConstantService.appIcons.dashboard,
        displayName: 'Dashboard',
        disabled: data.permissions.dashboard
      },
      {
        route: '/home/profile/user',
        iconName: ConstantService.appIcons.group,
        displayName: 'Users',
        disabled: data.permissions.allUsers
      },
      {
        displayName: 'Entity Control',
        route: '/home/adminControl/entityControl',
        disabled: data.permissions.entityControl
      },
      {
        displayName: 'Member Center',
        route: '/home/adminControl/memberCenter',
        disabled: data.permissions.myTeam
      },
      {
        displayName: 'Site Center',
        route: '/home/adminControl/siteCenter',
        disabled: data.permissions.siteCenter
      },
      {
        displayName: 'Question Center',
        route: '/home/adminControl/questionCenter',
        disabled: data.permissions.questionCenter
      },
      {
        displayName: 'Permission Center',
        route: '/home/adminControl/permissionCenter',
        disabled: data.permissions.permissionCenter
      },
      {
        displayName: 'Hazard Center',
        route: '/home/adminControl/hazardCenter',
        disabled: data.permissions.hazardCenter
      },
      {
        displayName: 'Invite Users',
        disabled: data.permissions.inviteUsers
      },
      {
        route: '/home/documents',
        iconName: ConstantService.appIcons.insertDriveFile,
        displayName: 'Documents',
        disabled: data.permissions.documents
      },
      {
        displayName: 'Analytics Reports',
        disabled: data.permissions.analyticsReports,
        children: [
          {
            displayName: 'Action Report',
            route: '/home/analyticsReport/actionReport',
            disabled: data.reportAccess.actionReport
          },
          {
            displayName: 'Average Daily Actions',
            route: '/home/analyticsReport/averageDailyActionsReport',
            disabled: data.reportAccess.averageDailyReport
          },
          {
            displayName: 'Checkin by Activity',
            route: '/home/analyticsReport/checkInActivityReport',
            disabled: data.reportAccess.checkinByActivity
          },
          {
            displayName: 'Checkin and Alert by Person',
            route: '/home/analyticsReport/alertsPersonReport',
            disabled: data.reportAccess.checkinAndAlertByPerson
          },
          {
            displayName: 'Actions vs Alerts',
            route: '/home/analyticsReport/actionAlertsReport',
            disabled: data.reportAccess.actionsVsAlerts
          },
          {
            displayName: 'Pulse Report by Entity',
            route: '/home/analyticsReport/entityPulseReport',
            disabled: data.reportAccess.pulseReportByEntity
          },
          {
            displayName: 'Pulse Report by Person',
            route: '/home/analyticsReport/personPulseReport',
            disabled: data.reportAccess.pulseReportByPerson
          },
          {
            displayName: 'Compliant Checkout',
            route: '/home/analyticsReport/compliantCheckoutReport',
            disabled: data.reportAccess.compliantCheckOut
          },
          {
            displayName: 'Site Activity Report',
            route: '/home/analyticsReport/siteActivityReport',
            disabled: data.reportAccess.siteActivityReport
          },
          {
            displayName: 'Hazard Reports',
            route: '/home/analyticsReport/hazardReport',
            disabled: data.reportAccess.hazardReports
          }
        ]
      }
    ];
    var self = this;
    this.helperService.iterations(this.navList, function (obj) {
      if (obj.displayName == name) {
        self.newMenu = obj.children
      }
    })
    return this.newMenu

  }
  switchSideMenuDefault(data) {
    this.navList = [
      {
        route: '/home',
        iconName: ConstantService.appIcons.dashboard,
        displayName: 'Dashboard',
        disabled: data.permissions.dashboard
      },
      {
        route: '/home/profile/user',
        iconName: ConstantService.appIcons.group,
        displayName: 'Users',
        disabled: data.permissions.allUsers
      },
      {
        displayName: 'Entity Control',
        route: '/home/adminControl/entityControl',
        disabled: data.permissions.entityControl
      },
      {
        displayName: 'Member Center',
        route: '/home/adminControl/memberCenter',
        disabled: data.permissions.myTeam
      },
      {
        displayName: 'Site Center',
        route: '/home/adminControl/siteCenter',
        disabled: data.permissions.siteCenter
      },
      {
        displayName: 'Question Center',
        route: '/home/adminControl/questionCenter',
        disabled: data.permissions.questionCenter
      },
      {
        displayName: 'Permission Center',
        route: '/home/adminControl/permissionCenter',
        disabled: data.permissions.permissionCenter
      },
      {
        displayName: 'Hazard Center',
        route: '/home/adminControl/hazardCenter',
        disabled: data.permissions.hazardCenter
      },
      {
        displayName: 'Invite Users',
        disabled: data.permissions.inviteUsers
      },
      {
        route: '/home/documents',
        iconName: ConstantService.appIcons.insertDriveFile,
        displayName: 'Documents',
        disabled: data.permissions.documents
      },
      {
        displayName: 'Analytics Reports',
        disabled: data.permissions.analyticsReports,
        children: [
          {
            displayName: 'Action Report',
            route: '/home/analyticsReport/actionReport',
            disabled: data.reportAccess.actionReport
          },
          {
            displayName: 'Average Daily Actions',
            route: '/home/analyticsReport/averageDailyActionsReport',
            disabled: data.reportAccess.averageDailyReport
          },
          {
            displayName: 'Checkin by Activity',
            route: '/home/analyticsReport/checkInActivityReport',
            disabled: data.reportAccess.checkinByActivity
          },
          {
            displayName: 'Checkin and Alert by Person',
            route: '/home/analyticsReport/alertsPersonReport',
            disabled: data.reportAccess.checkinAndAlertByPerson
          },
          {
            displayName: 'Actions vs Alerts',
            route: '/home/analyticsReport/actionAlertsReport',
            disabled: data.reportAccess.actionsVsAlerts
          },
          {
            displayName: 'Pulse Report by Entity',
            route: '/home/analyticsReport/entityPulseReport',
            disabled: data.reportAccess.pulseReportByEntity
          },
          {
            displayName: 'Pulse Report by Person',
            route: '/home/analyticsReport/personPulseReport',
            disabled: data.reportAccess.pulseReportByPerson
          },
          {
            displayName: 'Compliant Checkout',
            route: '/home/analyticsReport/compliantCheckoutReport',
            disabled: data.reportAccess.compliantCheckOut
          },
          {
            displayName: 'Site Activity Report',
            route: '/home/analyticsReport/siteActivityReport',
            disabled: data.reportAccess.siteActivityReport
          },
          {
            displayName: 'Hazard Reports',
            route: '/home/analyticsReport/hazardReport',
            disabled: data.reportAccess.hazardReports
          }
        ]
      }
    ];
    return this.navList

  }
}
