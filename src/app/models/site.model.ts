import {responseDetails, User} from './user.model';

export interface Site {
  id: number,
  name: string,
  location: string,
  safeZone: boolean,
  siteSafetyPlan: string,
  createdBy: number,
  entity: number,
  siteSafetyManager: number
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
  createdBy?: number;
  siteSafetyManager?: number;
}

export interface AddSiteApiResponse {
  data: object;
  responseDetails: responseDetails;
}

// export interface EditSiteApiResponse {
//   createdBy: number;
//   entity: number;
//   gpsTrackEnabled: boolean;
//   id: number;
//   latitude: number;
//   longitude: number;
//   location: string;
//   name: string;
//   radius: number;
//
// }

export interface ViewAllSitesData {
  offset: number;
  entityId: number;
  limit: number;
}
