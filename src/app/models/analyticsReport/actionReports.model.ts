import {FormGroup} from '@angular/forms';
import {EntityUserData} from '../userEntityData.model';
import {Subscription} from 'rxjs';


export interface ActionReport {
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

export interface CheckIn {
  site: number,
  numberOfCheckIn: number
}

export interface CheckOut {
  site: number,
  numberOfCheckOut: number
}
