import {Subscription} from 'rxjs';
import {User} from '../../user.model';
import {PermissionsModel} from '../permissions.model';

export interface MemberCenter {
  permissions: PermissionsModel;
  pageSize: number;
  pageCount: number;
  entityId: any;
  search: string;
  firstIndex: number;
  responseObj: any;
  userStatus: boolean;
  subscription: Subscription;
  displayLoader: boolean;
  dialogConfig: any;
  displayedColumns: string[];
  dataSource: any;
  entityData: any;
  user: any;
  userId: number;
  currentRole: string,
  elements: Array<PeriodicElement>;
}

export interface PeriodicElement {
  name: string;
  email: string;
  contact: number;
  photos: string;
  accessLevel: string;
}

export interface allUserResponse {
  pageCount: number,
  allUser: Array<User>
}

