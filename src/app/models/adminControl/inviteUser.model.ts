import {responseDetails} from '../user.model';
import {FormGroup} from '@angular/forms';
import {SitesInfo} from '../site.model';
import {Subscription} from 'rxjs';
import {TeamList} from './myTeam.model';

export interface InviteUser {
  selectedTeam: any;
  teamsList: Array<TeamList>;
  showTeams: boolean;
  elements: any;
  dataSource: any;
  selectedSite: any;
  allUsersList: any;
  allUsers: any;
  selectedRole: any;
  subscription: Subscription;
  inviteUserForm: FormGroup;
  email: FormGroup;
  success: any;
  roleList: any;
  InviteUserData: any;
  entityID: any;
  loading: boolean;
  siteList: SitesInfo[];
  showSites: boolean;
}

export interface inviteUserData {
  first_name: string;
  last_name: string;
  email: string;
  contactNo: string;
  role: Role;
  invitation: boolean;
  moduleName: string;
  entityId: number;
  sites: number;
  team: number;
}

export interface Role {
  id: number;
  name: string;
}


export interface InviteTeamResponse {
  data: string;
  responseDetails: responseDetails;
}

export interface InviteTeamData {
  email: Array<string>;
  entityCode: string;
}

export interface InviteUserModelData {
  entityId: number;
  role: Array<Role>
}
