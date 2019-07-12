import {FormGroup} from '@angular/forms';
import {Site} from './site.model';
import {PermissionsModel} from './adminControl/permissions.model';
import {responseDetails, User} from './user.model';
import {MatTableDataSource} from '@angular/material';

export interface HazardModel {
  permissions: PermissionsModel;
  hazardOption: boolean;
  entityId: number;
  dataSource: MatTableDataSource<Hazard>;
  displayedColumns: Array<string>;
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
  addedBy: string;
  dateTime: Date;
  description: string;
  id: number;
  resolved: boolean;
  resolvedBy: string;
  site: string;
  image: File;
}

export interface RiskType {
  id: number
  name: string
}

export interface AllHazardsApiData {
  data: Array<Hazard>;
  responseDetails: responseDetails;
}


export interface DeleteHazardApiResponse {
  data: object;
  responseDetails: responseDetails;
}

export interface AddHazardData {
  description: string;
  risk: string;
  title: string;
}

