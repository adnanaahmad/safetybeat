import {Injectable} from '@angular/core';
import {EntityUserData, Entity} from 'src/app/models/userEntityData.model';
import {HelperService} from '../helperService/helper.service';
import {User, UserData} from 'src/app/models/user.model';
import {ActionApiResponse, Site, SitesInfo} from 'src/app/models/site.model';
import {Organization} from 'src/app/models/Settings/organizationInfo.model';
import {GeneralInfo} from 'src/app/models/general.model';
import {Packages} from 'src/app/models/loginRegistration/packageDetails.model';
import {OrgData, RegUserData, UserFormData, OrgFormData, RegistrationObject} from 'src/app/models/loginRegistration/registration.model';
import {DocumentObj, Folder} from 'src/app/models/navigation/documents.model';
import {ActionReportData} from 'src/app/models/analyticsReport/reports.model';
import {recentActivities} from 'src/app/models/profile/profile.model';
import {TeamList} from 'src/app/models/adminControl/myTeam.model';
import {EntityQuestion} from 'src/app/models/adminControl/questionCenter.model';
import {QuestionsData} from 'src/app/models/adminControl/questionCenter.model';
import {UserLeavesApiResponse} from 'src/app/models/profile.model';

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

  constructAllHazardsData(hazardApiResponse: any): Array<any> {
    return hazardApiResponse.filter((hazardData: any) => !hazardData.isArchived);
  }

  constructAllArchivedHazardsData(hazardApiResponse: any): Array<any> {
    return hazardApiResponse.filter((hazardData: any) => hazardData.isArchived);
  }

  constructAllSitesData(siteApiResponse: any): Array<SitesInfo> {
    return siteApiResponse.filter((siteData: any) => !siteData.isArchived);
  }

  constructAllSitesArchivedData(siteApiResponse: any): Array<SitesInfo> {
    return siteApiResponse.filter((siteData: any) => siteData.isArchived);
  }

  constructAllTeamsArchivedData(teamApiResponse: any): Array<any> {
    var archivedTeams = []
    teamApiResponse.forEach((teamData: any) =>  {
      archivedTeams.push(teamData.team);
    });
    return archivedTeams;
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

  constructAllTeamsData(allTeamsApiResponse: any): Array<TeamList> {
    return allTeamsApiResponse.data.teamList;
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
        thumbnail: obj.user.thumbnail,
        accessLevel: obj.role,
        id: obj.user.id,
        status: obj.status,
        pendingConnection: obj.pendingConnection,
        nature: obj.nature,
        buttonText: buttonText,
        permissions: obj.permissions
      };
      usersArray.push(user);
    });
    return usersArray;
  }

  constructUserDataOfTeam(users) {
    let usersArray = [];
    this.helperService.iterations(users, function (obj) {
      let user = {
        name: obj.first_name + ' ' + obj.last_name,
        email: obj.email,
        contact: obj.contactNo,
        profileImage: obj.profileImage,
        thumbnail: obj.thumbnail,
        id: obj.id,
        username: obj.username
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

  constructUserForTeam(users) {
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
    this.helperService.iterations(connectionArray.data.acceptedConnections, function (obj) {
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
    return recentActivitiesRes.recentActivities;
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
        disabled: data.permissions.dashboard,
        bottom: false
      },
      {
        displayName: 'Entity Control',
        route: '/home/adminControl/entityControl',
        iconName: this.appIcons.log,
        toolTip: 'Entity Control Center',
        disabled: data.permissions.entityControl,
        bottom: false
      },
      {
        displayName: 'Member Centre',
        route: '/home/adminControl/memberCenter',
        iconName: this.appIcons.person,
        toolTip: 'Member Center',
        disabled: data.permissions.memberCentre,
        bottom: false
      },
      {
        displayName: 'Manage Leaves',
        route: '/home/adminControl/manageLeaves',
        iconName: this.appIcons.manageLeaves,
        toolTip: 'Manage Leaves',
        disabled: data.permissions.manageLeaves,
        bottom: false
      },
      {
        displayName: 'My Team',
        route: '/home/adminControl/myTeam',
        iconName: this.appIcons.group,
        toolTip: 'My Team',
        disabled: data.permissions.myTeam,
        bottom: false
      },
      {
        displayName: 'Site Centre',
        route: '/home/adminControl/siteCenter',
        iconName: this.appIcons.domain,
        toolTip: 'Site Center',
        disabled: data.permissions.siteCentre,
        bottom: false
      },
      {
        displayName: 'Question Centre',
        route: '/home/adminControl/questionCenter',
        iconName: this.appIcons.help,
        toolTip: 'Question Center',
        disabled: data.permissions.questionCentre,
        bottom: false
      },
      {
        displayName: 'Hazard Centre',
        route: '/home/adminControl/hazardCenter',
        iconName: this.appIcons.warning,
        toolTip: 'Hazard Center',
        disabled: data.permissions.hazardCentre,
        bottom: false
      },
      {
        route: '/home/adminControl/documents',
        iconName: this.appIcons.insertDriveFile,
        displayName: 'Documents',
        toolTip: 'Documents',
        disabled: data.permissions.documents,
        bottom: false
      },
      {
        displayName: 'Analytics Reports',
        disabled: data.permissions.analyticsReports,
        iconName: this.appIcons.showReports,
        toolTip: 'Reports',
        bottom: false,
        children: [
          {
            displayName: 'Action Report',
            route: '/home/adminControl/analyticsReport/actionReport',
            disabled: data.permissions.actionReport,
            bottom: false
          },
          {
            displayName: 'Checkin by Activity',
            route: '/home/adminControl/analyticsReport/checkInActivityReport',
            disabled: data.permissions.checkinByActivity,
            bottom: false
          },
          {
            displayName: 'Pulse Report',
            route: '/home/adminControl/analyticsReport/entityPulseReport',
            disabled: data.permissions.pulseReportByEntity,
            bottom: false
          },
          {
            displayName: 'Site Activity Report',
            route: '/home/adminControl/analyticsReport/siteActivityReport',
            disabled: data.permissions.siteActivityReport,
            bottom: false
          },
          {
            displayName: 'Hazard Reports',
            route: '/home/adminControl/analyticsReport/hazardReport',
            disabled: data.permissions.hazardReports,
            bottom: false
          }
        ]
      },
      {
        route: '/home',
        iconName: this.helperService.constants.appIcons.questionAnswer,
        disabled: data.permissions.supportCentre,
        toolTip: 'Support Center',
        bottom: true
      },
      {
        route: '/home/settings',
        iconName: this.helperService.constants.appIcons.settings,
        disabled: data.permissions.settings,
        toolTip: 'Settings',
        bottom: true
      }
    ];
    return this.navList;
  }

  constructActions(actionsArray: Array<ActionApiResponse>) {
    let actionData = [];
    this.helperService.iterations(actionsArray, function (obj) {
      let action = {
        title: obj.title,
        actionUser: obj.actionUser.id,
        completeByTime: obj.completeByTime,
        description: obj.description
      };
      actionData.push(action);
    });
    return actionData;
  }

  manageLeaveTable(actionsArray: UserLeavesApiResponse) {
    let actionData = [];
    this.helperService.iterations(actionsArray.data.userLeaves, function (obj) {
      let action = {
        leavesData: obj,
        userData: obj.requestedBy,
        userName: obj.requestedBy.first_name + ' ' + obj.requestedBy.last_name,
        status: obj.approved ? 'approved' : obj.rejected ? 'rejected' : 'pending',
        leaveType: obj.leaveType.name,
        dateFrom: new Date(obj.dateFrom),
        dateTo: new Date(obj.dateTo),
        reason: obj.description
      };
      actionData.push(action);
    });
    return actionData;
  }
}
