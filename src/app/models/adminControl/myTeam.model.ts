import {responseDetails, User} from '../user.model';
import {TeamList} from 'src/app/models/adminControl/myTeam.model'
import {Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material';

export interface MyTeamModel {
  subscription: Subscription;
  allTeams: Array<TeamList>;
  dataSource: MatTableDataSource<TeamList>;
}

export interface Team {
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
  entity: number;
}

export interface AllTeamsApiResponse {
  data: TeamList;
  responseDetails: responseDetails;
}

