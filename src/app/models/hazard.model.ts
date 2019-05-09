import {FormGroup} from '@angular/forms';
import {Site} from './site.model';
import {User} from './user.model';

export interface HazardModel {
  entityId: number;
  dataSource: any;
  displayedColumns: string[];
}
 export interface AddHazardModel {
   addHazardForm: FormGroup;
   risks: string[];
   formType: string
}
export interface Hazard {
  hazard: NewHazard;
  site: Site;
  user: User;
  risk: RiskType;
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
export interface RiskType {
  id: number
  name: string
}
