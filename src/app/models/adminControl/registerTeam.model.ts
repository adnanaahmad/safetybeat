import {FormGroup} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {TeamList} from './myTeam.model';
import {User} from '../user.model';


export interface RegisterTeamModel {
  entityId: number;
  filteredSelectedList: Array<any>;
  teamLeadID: any;
  teamLead: any;
  selectedUsers: Array<any>;
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

