import {FormGroup} from '@angular/forms';

export interface Permissions {
  permissions: PermissionsModel
}

export interface PermissionsModel {
  entityId: number;
  ImportSite: boolean,
  actionReport: boolean,
  actionsVsAlerts: boolean,
  addHazard: boolean,
  addSite: boolean,
  analyticsReports: boolean,
  averageDailyReport: boolean,
  changeAccessLevel: boolean,
  changePermissions: boolean,
  checkinAndAlertByPerson: boolean,
  checkinByActivity: boolean,
  compliantCheckOut: boolean,
  createEntity: boolean,
  createFolder: boolean,
  deactivateUser: boolean,
  default: boolean,
  deleteDocument: boolean,
  deleteEntity: boolean,
  deleteFolder: boolean,
  deleteHazard: boolean,
  deleteSite: boolean,
  deleteTeam: boolean,
  documents: boolean,
  downloadDocument: boolean,
  editHazard: boolean,
  editSite: boolean,
  editTeam: boolean,
  entityControl: boolean,
  hazardCentre: boolean,
  hazardReports: boolean,
  id: number,
  inviteUser: boolean,
  memberCentre: boolean,
  myTeam: boolean,
  permissionCentre: boolean,
  pulseReportByEntity: boolean,
  pulseReportByPerson: boolean,
  questionCentre: boolean,
  registerTeam: boolean,
  renameFolder: boolean,
  role: number,
  siteActivityReport: boolean,
  siteCentre: boolean,
  uploadDocument: boolean,
  viewEntity: boolean,
  viewEntityCode: boolean,
  viewHazard: boolean,
  viewSite: boolean,
  viewTeam: boolean,
  viewUserProfile: boolean,
  joinEntity: boolean,
  inviteMember: boolean,
  addQuestion: boolean,
  createQuestion: boolean,
  deleteQuestion: boolean,
  editQuestion: boolean,
  userId: number
}

export interface ChangePermissionsObj {
  checkAllEntityControls: boolean;
  checkAllForMemberCentre: boolean;
  unChanged: boolean;
  permissionsForm: FormGroup;
  permissionsData: PermissionsModel;
  loading: boolean;

}
