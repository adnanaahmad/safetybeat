import {Subscription} from 'rxjs';
import {responseDetails, User} from '../user.model';
import {Entity} from '../userEntityData.model';
import {MatTableDataSource} from '@angular/material';

export interface EntityControl {
  dataSource: MatTableDataSource<Entity>;
  allUsersData: Array<User>;
  currentUserData: User;
  subscription: Subscription;
  displayLoader: boolean;
  entitySelectedRole: string;
  displayedColumns: string[];
  allEntitiesData: Array<Entity>;
  entitiesList: any;
  empty: boolean;
  createEntityOption: boolean;
  joinOption: boolean;
  allUsers: any;
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
  data: Array<EntityUserData>;
  reponseDetails: responseDetails;
}

export interface ViewAllEntitiesResponse {
  data: Array<Entity>;
  responseDetails: responseDetails;
}
