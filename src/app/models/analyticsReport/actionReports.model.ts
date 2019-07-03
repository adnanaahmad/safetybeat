import {FormGroup, Validators} from '@angular/forms';
import {EntityUserData} from '../userEntityData.model';
import {Subscription} from 'rxjs';
import {SitesInfo} from '../site.model';


export interface ActionReport {
  entityId: number;
  showChart: boolean;
  userActionReportData: UserActionReportData;
  sitesData: SitesInfo[];
  entityName: string;
  entityUserData: EntityUserData;
  allEntitiesData: any;
  subscription: Subscription;
  actionReportForm: FormGroup;
  actionReportData: ActionReportData[];
  filters: any;
  noSites: boolean;
}

export interface ActionReportApiData {
  entityName: string;
  dateFrom: string;
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

export interface InputElement {
  element: string;
  type: string;
  placeholder: string;
  formControlName: string;
  validators: Array<Validators>;
  errorMessage: string;
  disabled: boolean;
  value?: string | number;
  matFormFieldCss?: string;
  event?: string;
  label?: string;
  cssClass?: string;
  group?: Array<string>;
}

export interface SelectElement {
  element: string;
  formControlName: string;
  validators: Validators ;
  options: Array<string>;
  errorMessage: string;
  value?: string;
  disabled: boolean;
  matFormFieldCss?: string;
  event?: string;
  label?: string;
  cssClass?: string;
  placeholder?: string;
  hideRequired?: boolean;
}
