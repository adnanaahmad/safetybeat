import {responseDetails, User} from './user.model';

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
}

export interface entityUsersApiResponseData {
  allUser: Array<entityUsersApiResponseUserData>;
  pageCount: number;
}
