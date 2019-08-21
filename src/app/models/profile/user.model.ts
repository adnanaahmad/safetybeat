import {Translation} from '../translate.model';
import {Subscription} from 'rxjs';

export interface UserModel {
  loading: boolean;
  user: any;
  userData: any;
  subscription: Subscription;
  translated: Translation;
  appIcons: any;
  displayedColumns: string[];
  allUsers: any;
  allUsersList: any;
  dataSource: any;
  empty: boolean;
  userId: number;
}
