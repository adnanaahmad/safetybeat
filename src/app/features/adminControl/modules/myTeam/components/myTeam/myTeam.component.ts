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
    this.getAllUsers();
    this.myTeam.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {
        this.myTeam.entityId = res.entityInfo.id;
        this.getAllTeams(this.myTeam.firstIndex, this.myTeam.search);
      }
    });
    this.myTeam.subscription = this.navService.entityPermissions.subscribe((data: PermissionsModel) => {
      if (data) {
        this.myTeam.permissions = data;
      }
    });
  }

  ngOnDestroy(): void {
    this.myTeam.subscription.unsubscribe();
  }

  getAllUsers() {
    let data = {
      entityId: this.helperService.getEntityId()
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
      this.getAllTeams(this.myTeam.firstIndex, this.myTeam.search);
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  getAllTeams(pageIndex, search) {
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
      this.getAllTeams(this.myTeam.firstIndex, this.myTeam.search);
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
      this.getAllTeams(this.myTeam.firstIndex, this.myTeam.search);
    });
  }

}
