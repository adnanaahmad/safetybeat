import {FormGroup} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {TeamList} from './myTeam.model';


export interface RegisterTeamModel {
  addedUsers: any[];
  removeUsers: any[];
  teamInfo: TeamList;
  userInfo: any;
  editTeam: boolean;
  valid: boolean;
  loading: boolean;
  filteredUsers: Observable<any>;
  allUsersList: any;
  allUsers: any;
  users: any;
  removable: boolean;
  entityUsers: any[];
  userCtrl: any;
  separatorKeysCodes: number[];
  subscription: Subscription;
  registerTeamForm: FormGroup;
}

