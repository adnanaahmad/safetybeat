import {FormGroup} from '@angular/forms';
import {EntityUserData} from '../userEntityData.model';
import {Subscription} from 'rxjs';
import {Site, SitesInfo} from '../site.model';


export interface ActionReport {
  entityId: number;
  showChart: boolean;
  userActionReportData: UserActionReportData;
  sitesData: Site[];
  entityName: string;
  entityUserData: EntityUserData;
  allEntitiesData: any;
  subscription: Subscription;
  actionReportForm: FormGroup;
  actionReportData: ActionReportData[];
  filters: string[];
  noSites: boolean;
}

export interface ActionReportApiData {
  entityName: string;
  dateFrom: Date;
  dateTo: Date;
  site: number;
  filter: string;
}

export interface HighChartType {
  type: string,
  title: string,
  subtitle: string,
}

export interface ActionReportData {
  CheckIns: CheckIn,
  CheckOuts: CheckOut,
  site: string,
}

export interface UserActionReportData {
  CheckIns: userCheckIn[],
  CheckOuts: userCheckOut[],
  site: string,
}

export interface CheckIn {
  site: number,
  numberOfCheckIn: number
}

export interface CheckOut {
  site: number,
  numberOfCheckOut: number
}

export interface userCheckIn {
  user: number,
  numberOfCheckIn: number
}

export interface userCheckOut {
  user: number,
  numberOfCheckOut: number
}
