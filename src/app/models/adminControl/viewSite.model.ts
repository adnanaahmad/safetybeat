import {Site, SiteObj, SitesInfo} from '../site.model';
import {responseDetails, User} from '../user.model';
import {checkInCheckOut} from '../profile/profile.model';
import {MatTableDataSource} from '@angular/material';


export interface ViewSite {
  siteSafetyManager: User;
  siteOption: boolean;
  entitySelectedRole: string;
  siteApi: any;
  siteInfo: SiteObj;
  siteId: any;
  activityTable: MatTableDataSource<any>;
  activityPageCount: number;
  activityLoading: boolean;
  activityColumns: Array<string>;
  hazardTable: MatTableDataSource<any>;
  hazardPageCount: number;
  hazardLoading: boolean;
  hazardColumns: Array<string>;
  search: string;
  firstIndex: number;
  pageSize: number;
}
export interface SiteActivityApiResponse {
  data: {
    pageCount: number;
    siteLogs: Array<siteLogs>;
  };
  responseDetails: responseDetails;
}
export interface siteLogs {
  checkInCheckOut: checkInCheckOut;
  user: User;
  duration: string;
}
export interface ViewSiteActivityData {
  siteId: number;
}
export interface ViewSiteHazardData {
  siteId: number;
}
