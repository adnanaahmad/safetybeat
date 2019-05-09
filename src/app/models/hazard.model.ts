import {FormGroup} from '@angular/forms';
import {Site} from './site.model';

export interface HazardModel {
  entityId: number;
  dataSource: any;
  displayedColumns: string[];
}

export interface AddHazardModel {
  image: File;
  addHazardForm: FormGroup;
}
export interface Hazard {
  hazard: NewHazard;
  site: Site
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
