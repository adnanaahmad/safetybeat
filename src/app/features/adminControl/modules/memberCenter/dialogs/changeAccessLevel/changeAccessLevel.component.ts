import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {ChangePermissionsObj, PermissionsModel} from 'src/app/models/adminControl/permissions.model';
import {FormBuilder} from '@angular/forms';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import {NavigationService} from '../../../../../navigation/services/navigation.service';

@Component({
  selector: 'app-changeAccessLevel',
  templateUrl: './changeAccessLevel.component.html',
  styleUrls: ['./changeAccessLevel.component.scss']
})
export class ChangeAccessLevelComponent implements OnInit, OnDestroy {
  permissions: ChangePermissionsObj = <ChangePermissionsObj>{};

  constructor(
    public dialogRef: MatDialogRef<ChangeAccessLevelComponent>,
    public helperService: HelperService,
    public memberService: MemberCenterService,
    private formBuilder: FormBuilder,
    private navService: NavigationService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.permissions.permissionsData = this.data.permissions;
    this.permissions.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res && res !== 1) {
        this.permissions.entityId = res.entityInfo.id;
      }
    })
  }

  ngOnInit() {
    this.permissions.loading = false;
    this.permissions.unChanged = true;
    this.permissions.permissionsForm = this.formBuilder.group({
      ImportSite: this.permissions.permissionsData.ImportSite,
      actionReport: this.permissions.permissionsData.actionReport,
      actionsVsAlerts: this.permissions.permissionsData.actionsVsAlerts,
      addHazard: this.permissions.permissionsData.addHazard,
      addSite: this.permissions.permissionsData.addSite,
      analyticsReports: this.permissions.permissionsData.analyticsReports,
      averageDailyReport: this.permissions.permissionsData.averageDailyReport,
      changeAccessLevel: this.permissions.permissionsData.changeAccessLevel,
      changePermissions: this.permissions.permissionsData.changePermissions,
      checkinAndAlertByPerson: this.permissions.permissionsData.checkinAndAlertByPerson,
      checkinByActivity: this.permissions.permissionsData.checkinByActivity,
      compliantCheckOut: this.permissions.permissionsData.compliantCheckOut,
      createEntity: this.permissions.permissionsData.createEntity,
      createFolder: this.permissions.permissionsData.createFolder,
      deactivateUser: this.permissions.permissionsData.deactivateUser,
      deleteDocument: this.permissions.permissionsData.deleteDocument,
      deleteEntity: this.permissions.permissionsData.deleteEntity,
      deleteFolder: this.permissions.permissionsData.deleteFolder,
      deleteHazard: this.permissions.permissionsData.deleteHazard,
      deleteSite: this.permissions.permissionsData.deleteSite,
      deleteTeam: this.permissions.permissionsData.deleteTeam,
      documents: this.permissions.permissionsData.documents,
      downloadDocument: this.permissions.permissionsData.downloadDocument,
      editHazard: this.permissions.permissionsData.editHazard,
      editQuestion: this.permissions.permissionsData.editQuestion,
      editSite: this.permissions.permissionsData.editSite,
      editTeam: this.permissions.permissionsData.editTeam,
      entityControl: this.permissions.permissionsData.entityControl,
      hazardCentre: this.permissions.permissionsData.hazardCentre,
      hazardReports: this.permissions.permissionsData.hazardReports,
      inviteUser: this.permissions.permissionsData.inviteUser,
      memberCentre: this.permissions.permissionsData.memberCentre,
      myTeam: this.permissions.permissionsData.myTeam,
      permissionCentre: this.permissions.permissionsData.permissionCentre,
      pulseReportByEntity: this.permissions.permissionsData.pulseReportByEntity,
      pulseReportByPerson: this.permissions.permissionsData.pulseReportByPerson,
      questionCentre: this.permissions.permissionsData.questionCentre,
      registerTeam: this.permissions.permissionsData.registerTeam,
      renameFolder: this.permissions.permissionsData.renameFolder,
      siteActivityReport: this.permissions.permissionsData.siteActivityReport,
      siteCentre: this.permissions.permissionsData.siteCentre,
      uploadDocument: this.permissions.permissionsData.uploadDocument,
      viewEntity: this.permissions.permissionsData.viewEntity,
      viewEntityCode: this.permissions.permissionsData.viewEntityCode,
      viewHazard: this.permissions.permissionsData.viewHazard,
      viewSite: this.permissions.permissionsData.viewSite,
      viewTeam: this.permissions.permissionsData.viewTeam,
      viewUserProfile: this.permissions.permissionsData.viewUserProfile,
      joinEntity: this.permissions.permissionsData.joinEntity,
      inviteMember: this.permissions.permissionsData.inviteMember,
      addQuestion: this.permissions.permissionsData.addQuestion,
      createQuestion: this.permissions.permissionsData.createQuestion,
      deleteQuestion: this.permissions.permissionsData.deleteQuestion,
      role: this.permissions.permissionsData.role,
      default: this.permissions.permissionsData.default,
      id: this.permissions.permissionsData.id,
      viewSiteCode: this.permissions.permissionsData.viewSiteCode,
      refreshSiteCode: this.permissions.permissionsData.refreshSiteCode,
      shareSiteCode: this.permissions.permissionsData.shareSiteCode,
      refreshEntityCode: this.permissions.permissionsData.refreshEntityCode,
      supportCentre: this.permissions.permissionsData.supportCentre,
      settings: this.permissions.permissionsData.settings,
      manageLeaves: this.permissions.permissionsData.manageLeaves,
      addLeaves: this.permissions.permissionsData.addLeaves,
      deleteLeaves: this.permissions.permissionsData.deleteLeaves,
      editLeaves: this.permissions.permissionsData.editLeaves,
      approveLeaves: this.permissions.permissionsData.approveLeaves,
      viewProfile: this.permissions.permissionsData.viewProfile,
      // canArchiveEntity: this.permissions.permissionsData.canArchiveEntity,
      // canArchiveTeam: this.permissions.permissionsData.canArchiveTeam,
      // canArchiveSite: this.permissions.permissionsData.canArchiveSite,
      // canArchiveHazard: this.permissions.permissionsData.canArchiveHazard,
    });
    this.permissions.permissionsForm.valueChanges.subscribe(result => {
      this.checkChange(this.permissions.permissionsForm)
    })
  }

  ngOnDestroy(): void {
    if (this.permissions.subscription !== null && this.permissions.subscription !== undefined) {
      this.permissions.subscription.unsubscribe();
    }
  }

  permissionsFormSubmit({value}: { value: PermissionsModel }) {
    this.permissions.loading = true;
    value.userId = this.data.id;
    value.entityId = this.permissions.entityId;
    this.memberService.updateUserPermission(value, this.permissions.permissionsData.id).subscribe((res) => {
        if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.permissions.loading = false;
          this.dialogRef.close();
          this.helperService.createSnack(this.helperService.translated.MESSAGES.PERMISSIONS_UPDATED,
            this.helperService.constants.status.SUCCESS);
        } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.permissions.loading = false;
          this.dialogRef.close();
          this.helperService.createSnack(this.helperService.translated.MESSAGES.PERMISSIONS_UPDATION_FAILED,
            this.helperService.constants.status.ERROR);
        } else {
          this.permissions.loading = false;
          this.dialogRef.close();
          this.helperService.createSnack(this.helperService.translated.MESSAGES.PERMISSIONS_UPDATION_FAILED,
            this.helperService.constants.status.ERROR);
        }
      }, (error) => {
        this.permissions.loading = false;
        this.dialogRef.close();
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG,
          this.helperService.constants.status.ERROR);
      }
    );
  }

  checkChange({value}: { value: PermissionsModel }) {
    this.permissions.unChanged = this.helperService.isEqual(value, this.data.permissions) ? true : false;
  }


  checkEnable(checked, permissions) {
    let self = this;
    if (checked) {
      self.helperService.iterations(permissions, function (value) {
        self.permissions.permissionsForm.get(value.key).setValue(true);
      })
    } else {
      self.helperService.iterations(permissions, function (value) {
        self.permissions.permissionsForm.get(value.key).setValue(false);
      })
    }
  }


}
