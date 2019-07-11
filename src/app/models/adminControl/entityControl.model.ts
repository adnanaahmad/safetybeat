import {Subscription} from 'rxjs';
import {PermissionsModel} from './permissions.model';

export interface EntityControl {
  permissions: PermissionsModel;
  subscription: Subscription;
  displayLoader: boolean;
  entitySelectedRole: string;
  dialogConfig: any;
  displayedColumns: string[];
  dataSource: any;
  allEntitiesData: any;
  entitiesList: any;
  empty: boolean;
  createEntityOption: boolean;
  joinOption: boolean;
  allUsers: any;
  allUsersList: any;
}
