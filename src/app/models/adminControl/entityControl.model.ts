import {Subscription} from 'rxjs';
import {PermissionsModel} from './permissions.model';
import {responseDetails, User} from '../user.model';
import {Administrator, Entity, EntityInfo, EntityPermissions, ReportAccess} from '../userEntityData.model';
import {MatTableDataSource} from '@angular/material';

export interface EntityControl {
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
  data: Array<User>;
  reponseDetails: responseDetails;
}

export interface ViewAllEntitiesResponse {
  data: Array<Entity>;
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

export interface EntityCodeData {
  name: string;
  code: string;

}
