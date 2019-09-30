import {responseDetails, User} from './user.model';
import {LeaveTypes} from './profile/profile.model';

export interface UserProfile {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  mobile_no: string;
  password: string;
  id: number;
}

export interface EditUser {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  contactNo: string;
}

export interface EditEntity {
  name: string;
  code: string;
  headOffice: string;
  entityManager: any;
}

export interface changePassword {
  currentPassword: string;
  password1: string;
  password2: string;
}

export interface Reset {
  password1: string;
  password2: string;
}

export interface resetPassword {
  password: string;
  uid: string;
  token: string;
}

export interface UserLeavesApiResponse {
  data: Array<UserLeavesApiResponseData>;
  responseDetails: responseDetails;
}

export interface AllUsersLeavesApiResponse {
  data: {
    userLeaves: Array<UserLeavesApiResponseData>;
    pageCount: number;
  };
  responseDetails: responseDetails;
}

export interface UserLeavesApiResponseData {
  approveRejectBy: User;
  approved: boolean;
  dateFrom: Date;
  dateTo: Date;
  description: string;
  entity: number;
  id: number;
  leaveType: LeaveTypes;
  rejected: boolean;
  requestedBy: User;
}

export interface AddLeaveApiResponse {
  data: {
    leave: UserLeavesApiResponseData;
  };
  responseDetails: responseDetails;
}

export interface AddLeaveData {
  entity: number;
  description: string;
  leaveType: number;
  dateFrom: Date;
  dateTo: Date;
}


export interface Leaveinfodata {
  actions: User;
  end: string;
  start: string;
  title: string;
  leaveType: any;
  leaveId: number;
  approved: boolean;
  rejected: boolean;
}

export interface leaveDeleteData {
  leaveData: Leaveinfodata;
  delete: boolean;
}


export interface EditLeaveData {
  entity: number;
  description: string;
  leaveType: number;
  dateFrom: Date;
  dateTo: Date;
  approved: boolean;
  rejected: boolean;
  approveReject: boolean;
}
