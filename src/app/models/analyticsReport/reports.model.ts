import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {FilterModel} from 'src/app/models/filter.model';
import {User} from '../user.model';
import {Site} from '../site.model';


export interface Report {
  minDate: Date;
  maxDate: Date;
  dateValid: boolean;
  pulseDiv: HTMLElement;
  statusDiv: HTMLElement;
  severityDiv: HTMLElement;
  containerDiv: HTMLElement;
  averageActionForm: FormGroup;
  resolvedHazards: number;
  unResolvedHazards: number;
  siteReportDetails: Array<SiteDetailsReport>;
  siteReportData: Array<SiteReportData>;
  sites: Site[];
  siteReportForm: FormGroup;
  loading: boolean;
  days: FilterModel;
  dateEnableObj: FilterModel;
  lastWeekObj: FilterModel;
  entityId: number;
  entityName: string;
  subscription: Subscription;
  actionReportForm: FormGroup;
  actionReportData: Array<ActionReportData>;
  filters: Array<FilterModel>;
  checkInByActivityReportData: Array<CheckInByActivityData>;
  entityUsers: User[];
  checkInActivityForm: FormGroup;
  pulseByEntityReportData: PulseByEntityReportData;
  pulseEntityForm: FormGroup;
  hazardReportByStatusData: HazardReportByStatusData;
  hazardReportData: HazardReportData;
  hazardReportForm: FormGroup;
}

export interface ActionReportApiData {
  entityName: string;
  dateFrom: Date;
  dateTo: Date;
  site: number;
  filter: string;
  user: number;
}

export interface HighChartType {
  type: string,
  title: string,
  subtitle: string,
}

export interface ActionReportData {
  date: string,
  checkins: number,
  checkouts: number,
  pulse: number

}

export interface CheckInByActivityData {
  date: string,
  maintenance: number,
  installation: number
}

export interface PulseByEntityReportData {
  date: string,
  meeting: number,
  visiting: number,
  travelling: number,
  onBreak: number,
  other: number
}

export interface HazardReportData {
  date: string,
  minor: number,
  moderate: number,
  major: number,
  extreme: number,
}


export interface HazardReportByStatusData {
  minorResolved: number,
  majorResolved: number,
  moderateResolved: number,
  extremeResolved: number,
  minorUnResolved: number,
  majorUnResolved: number,
  moderateUnResolved: number,
  extremeUnResolved: number,
  resolved: number,
  unResolved: number,
  minor: number,
  moderate: number,
  major: number,
  extreme: number,
  totalHazards: number
}

export interface SiteReportData {
  siteName: string,
  siteCheckIns: number,
  siteCheckOuts: number
}

export interface SiteDetailsReport {
  date: string,
  siteCheckIns: number,
  siteCheckOuts: number
}

