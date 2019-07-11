import {Component, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {GetAllTeamsData, MyTeamModel, TeamList} from 'src/app/models/adminControl/myTeam.model';
import {RegisterTeamComponent} from 'src/app/pages/adminControl/modules/myTeam/dialogs/registerTeam/registerTeam.component';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {MemberCenterService} from 'src/app/pages/adminControl/modules/memberCenter/services/member-center.service';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {ViewTeamComponent} from 'src/app/pages/adminControl/modules/myTeam/dialogs/viewTeam/viewTeam.component';
import {ConfirmationModalComponent} from 'src/app/Dialogs/conformationModal/confirmationModal.component';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {PermissionsModel} from 'src/app/models/adminControl/permissions.model';

@Component({
  selector: 'app-my-team',
  templateUrl: './myTeam.component.html',
  styleUrls: ['./myTeam.component.scss']
})
export class MyTeamComponent implements OnInit {

  myTeam: MyTeamModel = <MyTeamModel>{};
  displayedColumns: Array<string> = ['title', 'teamLead', 'symbol'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private allUsers: any[];

  constructor(public helperService: HelperService,
              public compiler: CompilerProvider,
              private memberService: MemberCenterService,
              private navService: NavigationService,
              private adminServices: AdminControlService) {

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
    let paginationData = {
      limit: null,
      offset: null,
      search: null
    };
    this.memberService.entityUsers(data, paginationData).subscribe((res) => {
      if (res) {
        this.allUsers = this.compiler.entityUser(res.data.allUser);
      }
    });
  }

  registerTeam() {
    this.helperService.createDialog(RegisterTeamComponent, {
      data: {Modal: false, allUsersOfTeam: this.allUsers}
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getAllTeams();
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  getAllTeams() {
    let data: GetAllTeamsData = {
      entity: JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key))
    };
    this.adminServices.allTeamsData(data).subscribe(res => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.myTeam.allTeams = this.compiler.constructAllTeamsData(res);
        this.myTeam.dataSource = new MatTableDataSource(this.myTeam.allTeams);
        this.myTeam.dataSource.paginator = this.paginator;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_TEAMS_SUCCESS,
          this.helperService.constants.status.SUCCESS);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
        this.myTeam.dataSource = null;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.TEAMS_NOT_FOUND,
          this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.myTeam.dataSource = null;
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
      this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
        this.helperService.translated.MESSAGES.DELETE_TEAM_SUCCESS);
    }, (error) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR,
        this.helperService.translated.MESSAGES.DELETE_TEAM_FAILURE);

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
