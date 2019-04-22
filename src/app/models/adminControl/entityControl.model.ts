import {Subscription} from 'rxjs';

export interface EntityControl {
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
