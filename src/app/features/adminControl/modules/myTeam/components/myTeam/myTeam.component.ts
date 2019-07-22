import {Component, OnInit, ViewChild} from '@angular/core';
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

@Component({
  selector: 'app-my-team',
  templateUrl: './myTeam.component.html',
  styleUrls: ['./myTeam.component.scss']
})
export class MyTeamComponent implements OnInit {

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
    this.getAllUsers();
    this.getAllTeams();
    this.navService.entityPermissions.subscribe((data: PermissionsModel) => {
      if (data) {
        this.myTeam.permissions = data;
      }
    });
  }

  getAllUsers() {
    let data = {
      entityId: JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key))
    };
    this.memberService.getUsersList(data).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.allUsers = this.compiler.constructUserDataOfTeam(res.data);
      } else {
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  registerTeam() {
    this.helperService.createDialog(RegisterTeamComponent, {
      disableClose: true,
      data: {Modal: false, allUsersOfTeam: this.allUsers}
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getAllTeams();
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  getAllTeams() {
    this.myTeam.loading = true;
    let data: GetAllTeamsData = {
      entityId: JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key))
    };
    let paginationData: PaginationData = {
      offset: null,
      limit: null,
      search: ''
    };
    this.adminServices.allTeamsData(data, paginationData).subscribe(res => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.myTeam.allTeams = this.compiler.constructAllTeamsData(res);
        this.myTeam.dataSource = new MatTableDataSource(this.myTeam.allTeams);
        this.myTeam.dataSource.paginator = this.paginator;
        this.myTeam.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_TEAMS_SUCCESS,
          this.helperService.constants.status.SUCCESS);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
        this.myTeam.dataSource = null;
        this.myTeam.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.TEAMS_NOT_FOUND,
          this.helperService.constants.status.ERROR);
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
      {data: {message: this.helperService.translated.CONFIRMATION.DELETE_TEAM}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.deleteTeam(teamId);
      }
    });
  }

  deleteTeam(teamId) {
    this.adminServices.deleteTeam(teamId).subscribe((res) => {
      this.getAllTeams();
      this.helperService.createSnack(
        this.helperService.translated.MESSAGES.DELETE_TEAM_SUCCESS, this.helperService.constants.status.SUCCESS);
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);

    });
  }

  editTeam(teamInfo: TeamList) {
    this.helperService.createDialog(RegisterTeamComponent, {
      disableClose: true,
      data: {Modal: true, teamList: teamInfo, allUsersOfTeam: this.allUsers}
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getAllTeams();
    });
  }

}
