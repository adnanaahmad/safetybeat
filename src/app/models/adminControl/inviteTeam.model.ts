import {Observable} from 'rxjs';

export interface InviteTeamModel {
  currentUserData: any;
  showMessage: boolean;
  loading: boolean;
  selectable: boolean;
  removable: boolean;
  addOnBlur: boolean;
  separatorKeysCodes: number[];
  userCtrl: any;
  filteredUsers: Observable<any[]>;
  users: any[];
  allUsers: any[];
}
