import {Translation} from '../translate.model';
import {Subscription} from 'rxjs';

export interface UserModel {
  subscription: Subscription;
  translated: Translation;
  appIcons: any;
  displayedColumns: string[];
  allUsers: any;
  allUsersList: any;
  dataSource: any;
  empty: boolean;
}
