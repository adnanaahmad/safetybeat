import {responseDetails, User} from './user.model';
import {Observable} from 'rxjs';
import {Translation} from './translate.model';
import {FormControl} from '@angular/forms';

export interface Site {
  id: number,
  name: string,
  location: string,
  safeZone: boolean,
  siteSafetyPlan: string,
  isArchived: boolean,
  createdBy: User,
  entity: number,
  gpsTrackEnabled: boolean,
  latitude: number,
  longitude: number,
  code: string;
  radius?: number;
  siteSafetyManager: number
}

export interface SitesInfo {
  site: Site,
  createdBy: User
  siteSafetyManager: User
}

export interface SiteObj {
  id: number,
  name: string,
  location: string,
  safeZone: boolean,
  siteSafetyPlan: string,
  isArchived: boolean,
  entity: number,
  gpsTrackEnabled: boolean,
  latitude: number,
  longitude: number,
  code: string;
  radius?: number;
  createdBy: User
  siteSafetyManager: User
}

export interface SiteAddData {
  siteName: string;
  siteAddress: string;
  safeZone: boolean;
  siteSafetyPlan: string;
  gpsTrackEnabled: boolean;
  siteSafetyManager?: number;
  radius?: number;
}

export interface AddSiteData {
  entity: number;
  latitude: number;
  longitude: number;
  location: string;
  name: string;
  safeZone: boolean;
  siteSafetyPlan: string;
  gpsTrackEnabled: boolean;
  createdBy?: any;
  siteSafetyManager?: User;
  radius?: number;
}

export interface AddSiteApiResponse {
  data: object;
  responseDetails: responseDetails;
}

export interface PaginationData {
  offset: number;
  limit: number;
  search?: string;
}

export interface ViewAllSiteEntityData {
  entityId: number;
}

export interface ViewAllSiteArchivedData {
  entityId: number;
  archived: boolean
}

export interface ViewAllSitesApiResponse {
  data: ViewAllSitesApiData;
  responseDetails: responseDetails;
}

export interface ViewAllSitesApiData {
  pageCount: number;
  sitesList: Array<Site>
}

export interface SendSiteCode {
  filteredUsers: Observable<Array<User>>;
  separatorKeysCodes: Array<number>;
  users: Array<User>;
  allUsers: Array<User>;
  userCtrl: FormControl;
  translated: Translation;
  removable: boolean;
  loading: boolean;
}

export interface SendSiteCodeData {
  inviteSiteCodeData: {
    siteCodeData: string;
    usersData: Array<User>;
  }
}

export interface sendSiteCodeApiData {
  email: Array<string>;
  code: string;
}

export interface SendSiteCodeApiResponse {
  data: object;
  responseDetails: responseDetails;
}

export interface RefreshSiteCodeApiResponse {
  data: {
    code: string;
  }
  responseDetails: responseDetails;
}

export interface ActionApiResponse {
  actionUser: User;
  completeByTime: Date;
  description: string;
  title: string;
}
