import {Subscription} from 'rxjs';
import {PermissionsModel} from './permissions.model';
import {responseDetails, User} from '../user.model';
import {Administrator, Entity, EntityInfo, EntityPermissions, ReportAccess} from '../userEntityData.model';
import {MatTableDataSource} from '@angular/material';
import {FormGroup} from '@angular/forms';


export interface EntityControl {
  pageCount: number;
  search: string;
  pageSize: number;
  firstIndex: number;
  entityId: number;
  permissions: PermissionsModel;
  dataSource: MatTableDataSource<Entity>;
  allUsersData: Array<User>;
  currentUserData: User;
  subscription: Subscription;
  displayLoader: boolean;
  entitySelectedRole: string;
  displayedColumns: string[];
  allEntitiesData: Array<Entity>;
  empty: boolean;
  createEntityOption: boolean;
  joinOption: boolean;
  allUsersList: Array<User>;
}

export interface EntityUserData {
  acceptedConnection: boolean;
  nature: string;
  pendingConnection: boolean;
  role: string;
  status: boolean;
  user: User;
}

export interface AllUsersOfEntityResponse {
  data: apiData
  reponseDetails: responseDetails;
}

export interface apiData {
  allUser: Array<User>;
  pageCount: number;
}

export interface ViewAllEntitiesResponse {
  data: {
    pageCount: number;
    allEntities: Array<Entity>
  };
  responseDetails: responseDetails;
}

export interface InviteTeamData {
  entityInfo: EntityInfo;
  permissions: EntityPermissions;
  reportAccess: ReportAccess;
  administrator: Administrator;
  managedBy: Array<Administrator>;
  active: boolean;
  role: string;
  manDown: string;
}

export interface RefreshEntityCodeResponse {
  data: {
    entityCode: string;
  }
  responseDetails: responseDetails;
}

export interface CheckInCategory {
  checkInTypes: Array<CheckInTypesCat>;
  addCheckInTypeForm: FormGroup;

}


export interface CheckInTypesCat {
  id: number;
  name: string;
  entity: number;
}
