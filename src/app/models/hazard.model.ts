import {FormGroup} from '@angular/forms';
import {Site} from './site.model';
import {User} from './user.model';

export interface HazardModel {
  hazardOption: boolean;
  entitySelectedRole: string;
  entityId: number;
  dataSource: any;
  displayedColumns: string[];
}

export interface AddHazardModel {
  removeImage: string;
  editModal: boolean;
  image: File;
  addHazardForm: FormGroup;
}
export interface Hazard {
  hazard: NewHazard;
  site: Site;
  addedBy: User;
  resolvedBy: User;
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
