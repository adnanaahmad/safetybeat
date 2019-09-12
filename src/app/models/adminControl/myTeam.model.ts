import {responseDetails, User} from '../user.model';
import {TeamList} from 'src/app/models/adminControl/myTeam.model'
import {Subscription} from 'rxjs';
import {PermissionsModel} from './permissions.model';
import {MatTableDataSource} from '@angular/material';

export interface MyTeamModel {
  entityId: number;
  pageSize: number;
  pageCount: number;
  search: string;
  firstIndex: number;
  loading: boolean;
  permissions: PermissionsModel;
  subscription: Subscription;
  allTeams: Array<TeamList>;
  teamsData?: Array<TeamList>;
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

export interface GetAllArchivedTeamsData {
  entityId: number;
  archived: boolean;
}

export interface AllTeamsApiResponse {
  data: {
    pageCount: number;
    teamsList: Array<TeamList>;
  };
  responseDetails: responseDetails;
}

