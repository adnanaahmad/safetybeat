import {FormGroup} from '@angular/forms';
import {EntityUserData} from '../userEntityData.model';
import {Subscription} from 'rxjs';
import {SitesInfo} from '../site.model';


export interface ActionReport {
  userActionReportData: UserActionReportData;
  sitesData: SitesInfo[];
  entityName: string;
  entityUserData: EntityUserData;
  allEntitiesData: any;
  subscription: Subscription;
  actionReportForm: FormGroup;
  actionReportData: ActionReportData[];
}

export interface ActionReportApiData {
  entityName: string;
  dateFrom: string;
  dateTo: Date;
  site: number;
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
