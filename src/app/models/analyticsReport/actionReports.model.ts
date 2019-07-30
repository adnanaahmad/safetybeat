import {FormGroup, Validators} from '@angular/forms';
import {EntityUserData} from 'src/app/models/userEntityData.model';
import {Subscription} from 'rxjs';
import {SitesInfo} from 'src/app/models/site.model';
import {FilterModel} from 'src/app/models/filter.model';


export interface ActionReport {
  days: FilterModel;
  dateEnableObj: FilterModel;
  lifetimeObj: FilterModel;
  entityId: number;
  showChart: boolean;
  sitesData: SitesInfo[];
  entityName: string;
  entityUserData: EntityUserData;
  allEntitiesData: any;
  subscription: Subscription;
  actionReportForm: FormGroup;
  actionReportData: Array<ActionReportData>;
  filters: Array<FilterModel>;
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
  checkedInAt__date: string,
  numberOfcheckIn: number
  numberOfcheckOut: number
}

