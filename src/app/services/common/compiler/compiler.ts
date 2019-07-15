import {Injectable} from '@angular/core';
import {EntityUserData, Entity} from 'src/app/models/userEntityData.model';
import {HelperService} from '../helperService/helper.service';
import {User, UserData} from 'src/app/models/user.model';
import {Site, SitesInfo} from 'src/app/models/site.model';
import {Organization} from 'src/app/models/Settings/organizationInfo.model';
import {GeneralInfo} from 'src/app/models/general.model';
import {Packages} from 'src/app/models/loginRegistration/packageDetails.model';
import {OrgData, RegUserData, UserFormData, OrgFormData, RegistrationObject} from 'src/app/models/loginRegistration/registration.model';
import {AllHazardsApiData, Hazard} from 'src/app/models/hazard.model';
import {DocList, DocumentObj, Folder} from '../../../models/navigation/documents.model';
import {ActionReportData, UserActionReportData} from '../../../models/analyticsReport/actionReports.model';
import {recentActivities} from 'src/app/models/profile/profile.model';
import {TeamList} from 'src/app/models/adminControl/myTeam.model';
import {EntityQuestion} from '../../../models/adminControl/questionCenter.model';
import {QuestionsData} from 'src/app/models/adminControl/questionCenter.model';

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

  static constructPackageDetail(packageApiReponse: any): Array<Packages> {
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

  constructEntitiesForProfile(loginApiResponse: any) {
    let array: any[] = [];
  }

  /**
   * this function is used to return the sitesData after constructing the sitesData according to the SitesInfo.
   * @params siteApiResponse
   */

  constructSiteData(siteApiResponse: any): Array<SitesInfo> {
    return siteApiResponse.data;
  }

  constructorSiteInfo(siteData: any): Site {
    return siteData;
  }

  constructAllSitesData(siteApiResponse: any): Array<SitesInfo> {
    return siteApiResponse;
  }

  constructSiteList(siteApiResponse: any): Site[] {
    return siteApiResponse.data;
  }

  constructAllDocumentsData(documentsApiResponse: any): Array<DocList> {
    return documentsApiResponse.data;
  }

  constructDocuments(documentsApiResponse: any): Array<DocumentObj> {
    return documentsApiResponse.data;
  }

  constructFolderList(documentsApiResponse: any): Array<Folder> {
    return documentsApiResponse.data;
  }

  constructActionReportData(actionReportApiResponse: any): Array<ActionReportData> {
    return actionReportApiResponse;
  }

  constructUserActionReportData(actionReportApiResponse: any): UserActionReportData {
    return actionReportApiResponse.data;
  }

  constructAllTeamsData(allTeamsApiResponse: any): Array<TeamList> {
    return allTeamsApiResponse.data;
  }

  constructAllQuestionsData(questionsApiResponse: any): QuestionsData {
    return questionsApiResponse.data;
  }

  constructAllEntityQuestionsData(questionsApiResponse: any): Array<EntityQuestion> {
    return questionsApiResponse.data;
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
    this.helperService.iterations(users, function (obj) {
      let buttonText = 'Add Connection';
      if (obj.pendingConnection) {
        buttonText = (obj.nature) ? 'Confirm Connection' : 'Cancel Request';
      } else {
        buttonText = (obj.nature) ? 'Add Connection' : 'Remove Connection';
      }
      let user = {
        name: obj.user.first_name + ' ' + obj.user.last_name,
        email: obj.user.email,
        contact: obj.user.contactNo,
        profileImage: obj.user.profileImage,
        accessLevel: obj.role,
        id: obj.user.id,
        status: obj.status,
        pendingConnection: obj.pendingConnection,
        nature: obj.nature,
        buttonText: buttonText
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

  constructRecentActivitiesData(recentActivitiesRes: any): Array<recentActivities> {
    return recentActivitiesRes.data;
  }


  constructOrganizationObject(organizationApiResponse: any): Organization {
    let organizationData: Organization = organizationApiResponse.data;
    return organizationData;
  }

  constructGeneralInfoObject(generalApiResponse: any): GeneralInfo {
    // let generalData: GeneralInfo = generalApiResponse.data;
    // return generalData;
    return generalApiResponse.data as GeneralInfo;
  }


  constructOrgdata(orgForm: OrgFormData, userForm: UserFormData, registerObj: RegistrationObject): OrgData {
    return {
      'name': orgForm.name,
      'address': this.helperService.address,
      'accountNo': '12344532',
      'billingEmail': registerObj.userEmail.email,
      'phoneNo': '+' + userForm.countryCode + '-' + userForm.contactNo,
      'type': registerObj.organizationTypeForm.value.type
    } as OrgData;
  }

  constructRegUserdata(registerObj: RegistrationObject, userForm: UserFormData): RegUserData {
    return {
      'email': registerObj.userEmail.email,
      'first_name': userForm.first_name,
      'last_name': userForm.last_name,
      'password1': userForm.password1,
      'password2': userForm.password2,
      'contactNo': '+' + userForm.countryCode + '-' + userForm.contactNo,
      'organization': registerObj.organizationData,
      'invitation': false,
      'moduleName': 'Safetybeat',
      'package': 'Trial',
      'roleId': 'Owner'
    } as RegUserData;
  }

  /**
   * this function returns the default side menu
   * @params data
   */

  switchSideMenuDefault(data) {
    this.navList = [
      {
        route: '/home/adminControl/dashboard',
        iconName: this.appIcons.dashboard,
        displayName: 'Dashboard',
        disabled: true
      },
      {
        displayName: 'Member Centre',
        route: '/home/adminControl/memberCenter',
        iconName: this.appIcons.person,
        toolTip: 'Member Center',
        disabled: data.permissions.memberCentre
      },
      {
        displayName: 'Entity Control',
        route: '/home/adminControl/entityControl',
        iconName: this.appIcons.log,
        toolTip: 'Entity Control Center',
        disabled: data.permissions.entityControl
      },
      {
        displayName: 'My Team',
        route: '/home/adminControl/myTeam',
        iconName: this.appIcons.group,
        toolTip: 'My Team',
        disabled: data.permissions.myTeam
      },
      {
        displayName: 'Site Centre',
        route: '/home/adminControl/siteCenter',
        iconName: this.appIcons.domain,
        toolTip: 'Site Center',
        disabled: data.permissions.siteCentre
      },
      {
        displayName: 'Question Centre',
        route: '/home/adminControl/questionCenter',
        iconName: this.appIcons.help,
        toolTip: 'Question Center',
        disabled: data.permissions.questionCentre
      },
      {
        displayName: 'Hazard Centre',
        route: '/home/adminControl/hazardCenter',
        iconName: this.appIcons.warning,
        toolTip: 'Hazard Center',
        disabled: data.permissions.hazardCentre
      },
      {
        route: '/home/adminControl/documents',
        iconName: this.appIcons.insertDriveFile,
        displayName: 'Documents',
        toolTip: 'Documents',
        disabled: data.permissions.documents
      },
      {
        displayName: 'Analytics Reports',
        disabled: data.permissions.analyticsReports,
        iconName: this.appIcons.showReports,
        toolTip: 'Reports',
        children: [
          {
            displayName: 'Action Report',
            route: '/home/adminControl/analyticsReport/actionReport',
            disabled: data.permissions.actionReport
          },
          {
            displayName: 'Average Daily Actions',
            route: '/home/adminControl/analyticsReport/averageDailyActionsReport',
            disabled: data.permissions.averageDailyReport
          },
          {
            displayName: 'Checkin by Activity',
            route: '/home/adminControl/analyticsReport/checkInActivityReport',
            disabled: data.permissions.checkinByActivity
          },
          {
            displayName: 'Checkin and Alert by Person',
            route: '/home/adminControl/analyticsReport/alertsPersonReport',
            disabled: data.permissions.checkinAndAlertByPerson
          },
          {
            displayName: 'Actions vs Alerts',
            route: '/home/adminControl/analyticsReport/actionAlertsReport',
            disabled: data.permissions.actionsVsAlerts
          },
          {
            displayName: 'Pulse Report by Entity',
            route: '/home/adminControl/analyticsReport/entityPulseReport',
            disabled: data.permissions.pulseReportByEntity
          },
          {
            displayName: 'Pulse Report by Person',
            route: '/home/adminControl/analyticsReport/personPulseReport',
            disabled: data.permissions.pulseReportByPerson
          },
          {
            displayName: 'Compliant Checkout',
            route: '/home/adminControl/analyticsReport/compliantCheckoutReport',
            disabled: data.permissions.compliantCheckOut
          },
          {
            displayName: 'Site Activity Report',
            route: '/home/adminControl/analyticsReport/siteActivityReport',
            disabled: data.permissions.siteActivityReport
          },
          {
            displayName: 'Hazard Reports',
            route: '/home/adminControl/analyticsReport/hazardReport',
            disabled: data.permissions.hazardReports
          }
        ]
      }
    ];
    return this.navList;

  }
}