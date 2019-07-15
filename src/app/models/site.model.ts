import {responseDetails, User} from './user.model';

export interface Site {
  id: number,
  name: string,
  location: string,
  safeZone: boolean,
  siteSafetyPlan: string,
  createdBy: User,
  entity: number,
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
  siteSafetyManager?: number;
}

export interface AddSiteData {
  entity: number;
  latitude: number;
  longitude: number;
  location: string;
  name: string;
  safeZone: boolean;
  siteSafetyPlan: string;
  createdBy?: any;
  siteSafetyManager?: User;
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
