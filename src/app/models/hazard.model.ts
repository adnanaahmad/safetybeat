import {FormGroup} from '@angular/forms';
import {ActionApiResponse, Site} from './site.model';
import {PermissionsModel} from './adminControl/permissions.model';
import {responseDetails, User} from './user.model';
import {MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';

export interface HazardModel {
  subscription: Subscription;
  permissions: PermissionsModel;
  hazardOption: boolean;
  entityId: number;
  dataSource: MatTableDataSource<any>;
  displayedColumns: Array<string>;
  loading: boolean;
  hazardsData: any;
}

export interface AddHazardModel {
  thumbnail: File;
  emails: string[];
  shareHazard: boolean;
  filteredSelectedUsers: any;
  addHazardFormFirst: FormGroup;
  removeImage: string;
  editModal: boolean;
  image: File;
  name: string;
  note: string;
  description: string;
  action: string;
  loading: boolean;
  hazardInfo: any;
  url: string;
  risks: Array<RiskType>;
  siteName: string;
  location: string;
  subscription: Subscription;
  entityName: string;
  msg: string;
  hazardTitle: string;
  actions: any;
  actionsArray: Array<ActionApiResponse>;
  allUsers: any;
  allUsersList: any;
  selectedUserList: any;
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
  createdTime: Date;
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
  data: AllHazardsApiResponseData;
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

export interface AllHazardsApiResponseData {
  hazardList: Array<HazardList>;
  pageCount: number;
}

export interface HazardList {
  addedBy: User;
  dateTime: Date;
  description: string;
  id: number;
  image: Blob;
  resolved: boolean;
  resolvedBy: User;
  risk: RiskType;
  site: Site;
  title: string;
  createdTime: Date;
  thumbnail: string;
}

