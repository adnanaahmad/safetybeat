import {User} from '../user.model';
import {TeamList} from 'src/app/models/adminControl/myTeam.model'
import {Subscription} from 'rxjs';

export interface MyTeamModel {
  subscription: Subscription;
  allTeams: TeamList[];
  dataSource: any;
}

export interface Team {
  entity: number,
  id: number,
  teamLead: number,
  title: string
}

export interface TeamList {
  team: Team,
  teamLead: User,
  users: User[]
}

