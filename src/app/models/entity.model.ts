import {responseDetails, User} from './user.model';
import {PermissionsModel} from './adminControl/permissions.model';

export interface entity {
  moduleName: string;
  name: string;
  headOffice: string;
  status: boolean;
  active: boolean;
}

export interface entityData {
  moduleName: string;
  name: string;
  headOffice: string;
  status: boolean;
  active: boolean;
}

export interface joinEntity {
  moduleName: string;
  entityCode: string;
}

export interface entityCode {
  joinCode: string;
}

export interface entityUsersApiResponse {
  data: entityUsersApiResponseData;
  responseDetails: responseDetails;
}

export interface entityUsersApiResponseUserData {
  acceptedConnection: boolean;
  nature: string;
  pendingConnection: boolean;
  role: string;
  status: boolean;
  user: User;
  permissions: PermissionsModel
  suspend: boolean;
}

export interface entityUsersApiResponseData {
  allUser: Array<entityUsersApiResponseUserData>;
  pageCount: number;
}

export interface entityUserApiData {
  search?: string;
  offset?: number;
  limit?: number
}
