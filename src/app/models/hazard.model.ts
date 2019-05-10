import {FormGroup} from '@angular/forms';
import {Site} from './site.model';
import {User} from './user.model';

export interface HazardModel {
  serverUrl: string;
  entityId: number;
  dataSource: any;
  displayedColumns: string[];
}
 export interface AddHazardModel {
   addHazardForm: FormGroup;
   risks: string[];
   formType: string;
  image: File;
}
export interface Hazard {
  hazard: NewHazard;
  site: Site;
  user: User;
  risk: RiskType;
}
export interface NewHazard {
  title: string;
  risk: string;
  addedBy: any;
  dateTime: any;
  description: string;
  id: number;
  resolved: boolean;
  resolvedBy: string;
  site: any;
  image: File;
}
export interface RiskType {
  id: number
  name: string
}
