import {FormGroup} from '@angular/forms';
import {Translation} from '../translate.model';
import {MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {TeamList} from '../adminControl/myTeam.model';
import {responseDetails} from '../user.model';
import {EntityInfo} from '../userEntityData.model';
import {Leaveinfodata, UserLeavesApiResponseData} from '../profile.model';
import {CalendarEvent} from 'angular-calendar';

export interface ProfileModel {
  userLeavesData: Array<Leaveinfodata>;
  leavesCount: number;
  eventData: CalendarEvent;
  events: Array<CalendarEvent>;
  loading: boolean;
  leave: UserLeavesApiResponseData;
  userLeaves: Array<UserLeavesApiResponseData>;
  startAt: Date;
  entity: EntityInfo;
  leaveTypes: Array<LeaveTypes>;
  selectedLeave: any;
  leaveForm: FormGroup;
  selectedFilter: any;
  data: ActivityFilterData;
  pageCount: number;
  pageSize: number;
  firstIndex: number;
  filters: Array<Filters>;
  filterForm: FormGroup;
  activitiesCount: number;
  teamsData: TeamList;
  noTeam: boolean;
  connectionCount: number;
  entityCount: number;
  noEntity: boolean;
  imageFile: File;
  profileImage: Blob;
  subscription: Subscription;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  entityName: string;
  role: string;
  userData: any;
  profileForm: FormGroup;
  translated: Translation;
  profileData: any;
  userId: number;
  username: string;
  name: string;
  firstname: string;
  lastname: string;
  contactNo: string;
  dataRecieved: any;
  disabled: boolean;
  password1: string;
  password2: string;
  appIcons: any;
  appConstants: any;
  entitiesList: any;
  email: any;
  profileFeatures: ProfileFeatures;
  receivedData: any;
  currentUserProfile: boolean;
  allConnectionsData: any;
  allConnectionsRes: any;
  recentActivities: any;
  noActivity: boolean;
  duration: string;
  noConnection: boolean;
  noRecords: boolean;
}


export interface ProfileFeatures {
  general: boolean;
  entities: boolean;
  leaves: boolean;
  profile: boolean;
  changePassword: boolean;
}

export interface recentActivities {
  checkInCheckOut: checkInCheckOut;
  siteData: siteData;
  duration: string
}

export interface checkInCheckOut {
  checkInType: any;
  checkedInAt: any;
  checkedOutAt: any;
  checkedOutType: any;
  id: number;
  site: number;
  user: number
}

export interface siteData {
  code: string;
  createdBy: number;
  entity: number;
  gpsTrackEnabled: boolean;
  id: number;
  latitude: any;
  location: string;
  longitude: any;
  name: string;
  radius: number;
  safeZone: boolean;
  siteSafetyManager: number;
  siteSafetyPlan: string;
}

export interface Filters {
  id: number;
  name: string;
  days: number;
}

export interface ActivityFilterData {
  days: number;
  userId: number;
  dateTo?: Date;
  dateFrom?: Date;
}

export interface ActivityApiResponse {
  data: {
    pageCount: number;
    recentActivities: Array<recentActivities>;
  };
  responseDetails: responseDetails;
}

export interface LeaveTypes {
  id: number;
  name: string;
}
