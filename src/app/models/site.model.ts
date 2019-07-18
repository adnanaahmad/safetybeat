import {responseDetails, User} from './user.model';
import {Translation} from './translate.model';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';

export interface Site {
  id: number,
  name: string,
  location: string,
  safeZone: boolean,
  siteSafetyPlan: string,
  createdBy: User,
  entity: number,
  code: string;
  gpsTrackEnabled: boolean;
  radius?: number;
  siteSafetyManager: Array<User>
}

export interface SitesInfo {
  site: Site,
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
  search: string;
  limit: number;
}

export interface ViewAllSiteEntityData {
  entityId: number;
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
