import {responseDetails, User} from '../user.model';
import {TeamList} from 'src/app/models/adminControl/myTeam.model'
import {Subscription} from 'rxjs';
import {PermissionsModel} from './permissions.model';
import {MatTableDataSource} from '@angular/material';

export interface MyTeamModel {
  permissions: PermissionsModel;
  subscription: Subscription;
  allTeams: Array<TeamList>;
  dataSource: MatTableDataSource<TeamList>;
}

export interface Team {
  createdBy: string,
  entity: number,
  id: number,
  teamLead: number,
  title: string
}

export interface TeamList {
  team: Team;
  teamLead: User;
  users: Array<User>;
}

export interface GetAllTeamsData {
  entityId: number;
}

export interface AllTeamsApiResponse {
  data: TeamList;
  responseDetails: responseDetails;
}

