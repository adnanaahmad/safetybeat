import {Observable} from 'rxjs';
import {User} from '../user.model';
import {FormControl} from '@angular/forms';

export interface InviteTeamModel {
  showMessage: boolean;
  loading: boolean;
  selectable: boolean;
  removable: boolean;
  addOnBlur: boolean;
  separatorKeysCodes: number[];
  userCtrl: FormControl;
  filteredUsers: Observable<Array<User>>;
  users: Array<User>;
  allUsers: Array<User>;
}

export interface InviteTeamModelData {
  inviteTeamData: {
    entityData: string;
    usersData: Array<User>
  }
}
