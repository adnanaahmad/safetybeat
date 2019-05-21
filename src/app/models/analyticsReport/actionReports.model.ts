import {FormGroup} from '@angular/forms';
import {EntityUserData} from '../userEntityData.model';
import {Subscription} from 'rxjs';


export interface ActionReport {
  entityName: string;
  entityUserData: EntityUserData;
  allEntitiesData: any;
  subscription: Subscription;
  actionReportForm: FormGroup;
}

export interface ActionReportApiData {
  entityName: string;
  dateFrom: string;
  dateTo: Date;
}
