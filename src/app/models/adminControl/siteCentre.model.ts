import {SitesInfo} from '../site.model';
import {Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material';
import {PermissionsModel} from './permissions.model';
import {User} from '../user.model';

export interface SiteCentre {
  entityId: number;
  siteId: number;
  allUsersData: Array<User>;
  allUsersList: Array<User>;
  currentUserData: User;
  permissions: PermissionsModel;
  dataSource: MatTableDataSource<SitesInfo>;
  pageCount: number;
  pageSize: number;
  search: string;
  siteOption: boolean;
  entitySelectedRole: string;
  sitesData: SitesInfo[];
  subscription: Subscription;
  firstIndex: number;
  loading: boolean;
}

