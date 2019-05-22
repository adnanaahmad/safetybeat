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

export interface highChartTitle {
  type: string,
  title: string,
  subtitle: string,
}

export interface ActionReportData {
  site: number,
  CheckIns: CheckIn[],
  CheckOuts: CheckOut[]
}

export interface CheckIn {
  day: string,
  numberOfCheckIn: number
}

export interface CheckOut {
  day: string,
  numberOfCheckOut: number
}
