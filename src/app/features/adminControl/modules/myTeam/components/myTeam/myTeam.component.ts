import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {GetAllTeamsData, MyTeamModel, TeamList} from 'src/app/models/adminControl/myTeam.model';
import {RegisterTeamComponent} from 'src/app/features/adminControl/modules/myTeam/dialogs/registerTeam/registerTeam.component';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {ViewTeamComponent} from 'src/app/features/adminControl/modules/myTeam/dialogs/viewTeam/viewTeam.component';
import {ConfirmationModalComponent} from 'src/app/dialogs/conformationModal/confirmationModal.component';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {PermissionsModel} from 'src/app/models/adminControl/permissions.model';
import {PaginationData} from 'src/app/models/site.model';
import { ArchivedTeamComponent } from 'src/app/features/adminControl/modules/myTeam/dialogs/archived-team/archived-team.component';


@Component({
  selector: 'app-my-team',
  templateUrl: './myTeam.component.html',
  styleUrls: ['./myTeam.component.scss']
})
export class MyTeamComponent implements OnInit, OnDestroy {

  myTeam: MyTeamModel = <MyTeamModel>{};
  displayedColumns: Array<string> = ['title', 'teamLead', 'symbol'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  allUsers: any = [];

  constructor(public helperService: HelperService,
              public compiler: CompilerProvider,
              private memberService: MemberCenterService,
              private navService: NavigationService,
              private adminServices: AdminControlService) {
    this.myTeam.loading = false;
  }

  ngOnInit() {
    this.myTeam.firstIndex = 0;
    this.myTeam.search = '';
    this.myTeam.pageSize = 10;
    this.myTeam.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {
        this.myTeam.entityId = res.entityInfo.id;
        this.getAllUsers();
        this.paginator.pageIndex = this.myTeam.firstIndex;
        this.getAllTeams(this.paginator.pageIndex , this.myTeam.search);
      }
    });
    this.myTeam.subscription = this.navService.entityPermissions.subscribe((data: PermissionsModel) => {
      if (data) {
        this.myTeam.permissions = data;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.myTeam.subscription !== null && this.myTeam.subscription !== undefined) {
      this.myTeam.subscription.unsubscribe();
    }
  }

  getAllUsers() {
    this.allUsers = null;
    let data = {
      entityId: this.myTeam.entityId
    };
    this.memberService.getUsersList(data).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.allUsers = this.compiler.constructUserDataOfTeam(res.data);
      } else {
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  registerTeam() {
    this.helperService.createDialog(RegisterTeamComponent, {
      disableClose: true,
      data: {Modal: false, allUsersOfTeam: this.allUsers}
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getAllTeams(this.paginator.pageIndex, this.myTeam.search);
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  getAllTeams(pageIndex, search) {
    this.myTeam.pageCount = 0;
    this.myTeam.loading = true;
    let data: GetAllTeamsData = {
      entityId: this.myTeam.entityId
    };
    let paginationData: PaginationData = {
      offset: pageIndex * this.helperService.appConstants.paginationLimit,
      limit: this.helperService.appConstants.paginationLimit,
      search: search
    };
    this.adminServices.allTeamsData(data, paginationData).subscribe(res => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.myTeam.pageCount = res.data.pageCount;
        this.myTeam.allTeams = res.data.teamsList;
        this.myTeam.dataSource = new MatTableDataSource(this.myTeam.allTeams);
        this.myTeam.loading = false;
        if (this.myTeam.allTeams.length === 0 && this.paginator.pageIndex !== 0) {
          this.goToPreviousTable();
        }
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
        this.myTeam.dataSource = null;
        this.myTeam.loading = false;
      }
    }, (error) => {
      this.myTeam.dataSource = null;
      this.myTeam.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_TEAMS_FAILURE,
        this.helperService.constants.status.ERROR);
    });
  }

  viewTeam(teamsData) {
    this.helperService.createDialog(ViewTeamComponent, {
      data: teamsData
    });
  }

  confirmationModal(teamId: number) {
    this.helperService.createDialog(ConfirmationModalComponent,
      {data: {message: this.helperService.translated.CONFIRMATION.ARCHIVE_TEAM}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.archiveTeam(teamId);
      }
    });
  }

  archiveTeam(teamId) {
    this.adminServices.archiveTeam(teamId).subscribe((res) => {
      this.getAllTeams(this.paginator.pageIndex, this.myTeam.search);
      this.helperService.createSnack(
        this.helperService.translated.MESSAGES.ARCHIVED_TEAM_SUCCESS, this.helperService.constants.status.SUCCESS);
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  editTeam(teamInfo: TeamList) {
    this.helperService.createDialog(RegisterTeamComponent, {
      disableClose: true,
      data: {Modal: true, teamList: teamInfo, allUsersOfTeam: this.allUsers}
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getAllTeams(this.paginator.pageIndex, this.myTeam.search);
    });
  }

  /**
   * this function is used to open the archived teams dialog.
   */
  getArchivedTeams() {
    this.helperService.createDialog(ArchivedTeamComponent, {
      disableClose: true,
      data: {Modal: false, 'teamData': this.myTeam.allTeams}
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
        this.getAllTeams(this.paginator.pageIndex, this.myTeam.search);
    });
  }
  /**
   * this function is used to navigate user to previous table if current table is empty.
   */
  goToPreviousTable() {
    this.paginator.pageIndex = this.paginator.pageIndex - 1;
    this.getAllTeams(this.paginator.pageIndex, this.myTeam.search);
  }
}
