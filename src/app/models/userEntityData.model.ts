import { User } from "./user.model";

export interface EntityUserData {
  // user: User;
  entities: Entity[];
}

export interface Entity {
  entityInfo: EntityInfo;
  permissions: EntityPermissions;
  reportAccess: ReportAccess;
  administrator: Administrator;
  active:boolean;
  role:string;
}

export interface Administrator {
  email:string;
  first_name:string;
  last_name:string;
  username:string;
  contactNo:string;
}

export interface EntityInfo {
  id: number;
  name: string;
  code: string;
  headOffice: string;
  status: boolean;
  codeModifies: Date;
  createdBy: number;
  managedBy: number;
  role: number;
}

export interface EntityPermissions {
  dashboard: boolean;
  allUsers: boolean;
  myTeam: boolean;
  documents: boolean;
  entityControl: boolean;
  siteCenter: boolean;
  questionCenter: boolean;
  hazardCenter: boolean;
  permissionCenter: boolean;
  inviteUsers: boolean;
}

export interface ReportAccess {
  actionReport: boolean;
  averageDailyReport: boolean;
  checkinByActivity: boolean;
  checkinAndAlertByPerson: boolean;
  actionsVsAlerts: boolean;
  pulseReportByEntity: boolean;
  pulseReportByPerson: boolean;
  compliantCheckOut: boolean;
  siteActivityReport: boolean;
  hazardReports: boolean;
}
