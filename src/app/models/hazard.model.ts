import {FormGroup} from '@angular/forms';
import {Site} from './site.model';

export interface HazardModel {
  entityId: number;
  dataSource: any;
  displayedColumns: string[];
}
 export interface AddHazardModel {
   addHazardForm: FormGroup;
}
export interface Hazard {
  hazard: NewHazard;
  site: Site
}
export interface NewHazard {
  addedBy: any
  dateTime: any
  description: string
  id: number
  resolved: boolean
  resolvedBy: string
  risk: any
  site: any
  title: string
}
