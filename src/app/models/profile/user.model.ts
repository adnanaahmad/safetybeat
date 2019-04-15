import {Translation} from '../translate.model';

export interface UserModel {
  translated: Translation;
  appIcons: any;
  displayedColumns: string[];
  allUsers: any;
  allUsersList: any;
  dataSource: any;
  empty: boolean;
}
