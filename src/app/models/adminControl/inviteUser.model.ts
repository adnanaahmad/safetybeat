import {responseDetails} from '../user.model';
import {FormGroup} from '@angular/forms';

export interface InviteUser {
  inviteUserForm: FormGroup;
  email: FormGroup;
  success: any;
  roleList: any;
  InviteUserData: any;
  entityID: any;
}

export interface inviteUserData {
  first_name: string;
  last_name: string;
  email: string;
  contactNo: string;
  role: number;
  invitation: boolean;
  moduleName: string;
  entityId: number;
}


export interface InviteTeamResponse {
  data: string;
  responseDetails: responseDetails;
}

export interface InviteTeamData {
  email: string[];
  entityCode: string;
}
