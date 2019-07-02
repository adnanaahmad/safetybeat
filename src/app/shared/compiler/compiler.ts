import {Injectable} from '@angular/core';
import {EntityUserData, Entity} from 'src/app/models/userEntityData.model';
import {HelperService} from '../helperService/helper.service';
import {User, UserData} from 'src/app/models/user.model';
import {Site, SitesInfo} from 'src/app/models/site.model';
import {Organization} from 'src/app/models/Settings/organizationInfo.model';
import {GeneralInfo} from 'src/app/models/general.model';
import {Packages} from 'src/app/models/loginRegistration/packageDetails.model';
import {Hazard} from 'src/app/models/hazard.model';
import {DocList, DocumentObj, Folder} from '../../models/navigation/documents.model';
import {ActionReportData, UserActionReportData} from '../../models/analyticsReport/actionReports.model';
import {recentActivities} from 'src/app/models/profile/profile.model';
import {Team, TeamList} from 'src/app/models/adminControl/myTeam.model';
import {EntityQuestion, QuestionsData} from 'src/app/models/adminControl/questionCenter.model';

@Injectable()
export class CompilerProvider {
  newMenu: any = [];
  navList: any = [];
  appIcons: any;

  constructor(
    public helperService: HelperService
  ) {
    this.appIcons = this.helperService.constants.appIcons;
  }

  static constructPackageDetail(packageApiReponse: any): Packages[] {
    return packageApiReponse.data;
  }

  /**
   * @params event
   * To check if the input is number or not
   */
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.key;
    return !(
      charCode > 31 &&
      (charCode < 48 || charCode > 57)
    );
  }

  /**
   * @params event
   * To check if the input is character or not
   */
  charactersOnly(event): boolean {
    const charCode = event.which ? event.which : event.key;
    return !(
      charCode > 31 &&
      ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122))
    );
  }

  /**
   * this function is used to construct the usersData according to the model.
   * @params profileApiResponse
   */

  constructUserData(profileApiResponse: any) {
    let user: UserData = profileApiResponse.data;
    return user;
  }

  /**
   * this function is used to insert the spaces.
   * @params string
   */

  insertSpaces(string) {
    string = string.replace(/([a-z])([A-Z])/g, '$1 $2');
    string = string.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
    return string;
  }

  /**
   * this function is used to return the profile data after constructing according to the User Model.
   * @params profileApiResponse
   */

  constructProfileData(profileApiResponse: any) {
    let profileData: User = profileApiResponse;
    return profileData;
  }

  /**
   * this function is used to return the entity data after constructing the entity data according to the entity Model.
   * @params loginApiResponse
   */

  constructUserEntityData(loginApiResponse: any): EntityUserData {
    let allEntities: Entity[] = [];
    this.helperService.iterations(loginApiResponse, function (entity) {
      let data: Entity = {
        entityInfo: entity.entity,
        permissions: entity.permissions,
        reportAccess: entity.reportAccess,
        administrator: entity.administrator,
        managedBy: entity.managedBy,
        active: entity.active,
        role: entity.role,
        manDown: entity.mandown
      };
      allEntities.push(data);
    });
    let managedBy: any[] = [];
    this.helperService.iterations(allEntities, function (entity) {
      managedBy.push(entity.managedBy);
    });
    let userEntityData: EntityUserData = {
      entities: allEntities
    };
    return userEntityData;
  }

  /**
   * this function is used to return the sitesData after constructing the sitesData according to the SitesInfo.
   * @params siteApiResponse
   */

  constructSiteData(siteApiResponse: any): SitesInfo[] {
    return siteApiResponse.data;
  }

  constructorSiteInfo(siteData: any): Site {
    return siteData;
  }

  constructAllSitesData(siteApiResponse: any): SitesInfo[] {
    return siteApiResponse;
  }

  constructSiteList(siteApiResponse: any): Site[] {
    return siteApiResponse.data;
  }

  constructAllDocumentsData(documentsApiResponse: any): DocList[] {
    return documentsApiResponse.data;
  }

  constructDocuments(documentsApiResponse: any): DocumentObj[] {
    return documentsApiResponse.data;
  }

  constructFolderList(documentsApiResponse: any): Folder[] {
    return documentsApiResponse.data;
  }

  constructActionReportData(actionReportApiResponse: any): ActionReportData[] {
    return actionReportApiResponse;
  }

  constructUserActionReportData(actionReportApiResponse: any): UserActionReportData {
    return actionReportApiResponse.data;
  }

  constructAllTeamsData(allTeamsApiResponse: any): TeamList[] {
    return allTeamsApiResponse.data;
  }

  constructAllQuestionsData(questionsApiResponse: any): QuestionsData {
    return questionsApiResponse.data;
  }

  constructAllEntityQuestionsData(questionsApiResponse: any): EntityQuestion[] {
    return questionsApiResponse.data;
  }


  constructHazardArray(hazardResponse: any): Hazard[] {
    let hazardArray: Hazard[] = [];
    this.helperService.iterations(hazardResponse.data, function (hazard) {
      let obj: Hazard = {
        hazard: hazard.hazard,
        site: hazard.site,
        addedBy: hazard.addedBy,
        resolvedBy: hazard.resolvedBy,
        risk: hazard.risk,
      };
      hazardArray.push(obj);
    });
    return hazardArray;
  }

  /**
   * this function is used for switching the side menu according to the entity privileges given to the user.
   * @params data
   * @params name
   */

  constructUserInfo(userInfoApiResponse: any): User {
    return userInfoApiResponse;
  }

  entityUser(users) {
    let usersArray = [];
    this.helperService.iterations(users.data, function (obj) {
      let user = {
        name: obj.user.first_name + ' ' + obj.user.last_name,
        email: obj.user.email,
        contact: obj.user.contactNo,
        profileImage: obj.user.profileImage,
        accessLevel: obj.role,
        id: obj.user.id,
        status: obj.status,
        pendingConnection: obj.pendingConnection,
        acceptedConnection: obj.acceptedConnection,
        nature: obj.nature
      };
      usersArray.push(user);
    });
    return usersArray;
  }

  constructDataForTeams(users) {
    let usersArray = [];
    this.helperService.iterations(users, function (obj) {
      let user = {
        name: obj.first_name + ' ' + obj.last_name,
        email: obj.email,
        contact: obj.contactNo,
        photos: '',
        accessLevel: obj.role,
        id: obj.id
      };
      usersArray.push(user);
    });
    return usersArray;
  }

  constructAllConnectionData(connectionArray) {
    let connectionData = [];
    this.helperService.iterations(connectionArray.data, function (obj) {
      let connection = {
        name: obj.user.first_name + ' ' + obj.user.last_name,
        email: obj.user.email,
        contact: obj.user.contactNo,
        photos: obj.user.profileImage,
        id: obj.user.id,
      };
      connectionData.push(connection);
    });
    return connectionData;
  }

  constructRecentActivitiesData(recentActivitiesRes: any): recentActivities[] {
    return recentActivitiesRes.data;
  }


  constructOrganizationObject(organizationApiResponse: any): Organization {
    let organizationData: Organization = organizationApiResponse.data;
    return organizationData;
  }

  constructGeneralInfoObject(generalApiResponse: any): GeneralInfo {
    let generalData: GeneralInfo = generalApiResponse.data;
    return generalData;
  }

  switchSideMenu(data, name) {
    this.navList = [
      {
        route: '/home',
        iconName: this.appIcons.dashboard,
        displayName: 'Dashboard',
        disabled: data.permissions.dashboard
      },
      {
        displayName: 'Member Center',
        route: '/home/adminControl/memberCenter',
        disabled: data.permissions.myTeam
      },
      // {
      //   route: '/home/profile/user',
      //   iconName: this.appIcons.group,
      //   displayName: 'Users',
      //   disabled: data.permissions.allUsers
      // },
      {
        displayName: 'Entity Control',
        route: '/home/adminControl/entityControl',
        disabled: data.permissions.entityControl
      },
      {
        displayName: 'My Team',
        route: '/home/adminControl/myTeam',
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
      // {
      //   displayName: 'Invite Users',
      //   disabled: data.permissions.inviteUsers
      // },
      {
        route: '/home/documents',
        iconName: this.appIcons.insertDriveFile,
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
    let self = this;
    this.helperService.iterations(this.navList, function (obj) {
      if (obj.displayName === name) {
        self.newMenu = obj.children;
      }
    });
    return this.newMenu;
  }

  /**
   * this function returns the default side menu
   * @params data
   */

  switchSideMenuDefault(data) {
    this.navList = [
      {
        route: '/home',
        iconName: this.appIcons.dashboard,
        displayName: 'Dashboard',
        disabled: data.permissions.dashboard
      },
      {
        displayName: 'Member Centre',
        route: '/home/adminControl/memberCenter',
        disabled: data.permissions.myTeam
      },
      // {
      //   route: '/home/profile/user',
      //   iconName: this.appIcons.group,
      //   displayName: 'Users',
      //   disabled: data.permissions.allUsers
      // },
      {
        displayName: 'Entity Control',
        route: '/home/adminControl/entityControl',
        disabled: data.permissions.entityControl
      },
      {
        displayName: 'My Team',
        route: '/home/adminControl/myTeam',
        disabled: data.permissions.myTeam
      },
      {
        displayName: 'Site Centre',
        route: '/home/adminControl/siteCenter',
        disabled: data.permissions.siteCentre
      },
      {
        displayName: 'Question Centre',
        route: '/home/adminControl/questionCenter',
        disabled: data.permissions.questionCentre
      },
      {
        displayName: 'Permission Centre',
        route: '/home/adminControl/permissionCenter',
        disabled: data.permissions.permissionCentre
      },
      {
        displayName: 'Hazard Centre',
        route: '/home/adminControl/hazardCenter',
        disabled: data.permissions.hazardCentre
      },
      {
        route: '/home/documents',
        iconName: this.appIcons.insertDriveFile,
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
    return this.navList;

  }
}
