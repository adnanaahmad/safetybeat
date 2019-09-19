import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {GetAllArchivedTeamsData, MyTeamModel, TeamList} from 'src/app/models/adminControl/myTeam.model';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {MatPaginator, MatDialogRef, MatTableDataSource} from '@angular/material';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {PermissionsModel} from 'src/app/models/adminControl/permissions.model';
import {PaginationData} from 'src/app/models/site.model';

@Component({
  selector: 'app-archived-team',
  templateUrl: './archived-team.component.html',
  styleUrls: ['./archived-team.component.scss']
})
export class ArchivedTeamComponent implements OnInit, OnDestroy {
  myTeam: MyTeamModel = <MyTeamModel>{};
  displayedColumns: Array<string> = ['title', 'teamLead', 'symbol'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  allUsers: any = [];

  constructor(public helperService: HelperService,
              public compiler: CompilerProvider,
              private memberService: MemberCenterService,
              public dialogRef: MatDialogRef<ArchivedTeamComponent>,
              private navService: NavigationService,
              private adminServices: AdminControlService) {
  }

  /**
   * this function is used to initialize the global variables that we have made in the models.
   */
  initialize() {
    this.myTeam.search = '';
    this.myTeam.firstIndex = 0;
    this.myTeam.pageSize = 6;
    this.myTeam.dataSource = null;
    this.myTeam.teamsData = [];
    this.myTeam.loading = false;
  }

  ngOnInit() {
    this.myTeam.firstIndex = 0;
    this.myTeam.search = '';
    this.myTeam.pageSize = 6;
    this.myTeam.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {
        this.myTeam.entityId = res.entityInfo.id;
        this.getAllUsers();
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

  getAllTeams(pageIndex, search) {
    this.myTeam.pageCount = 0;
    let data: GetAllArchivedTeamsData = {
      entityId: this.myTeam.entityId,
      archived: true
    };
    let paginationData: PaginationData = {
      offset: pageIndex * this.helperService.appConstants.paginationLimitForArchive,
      limit: this.helperService.appConstants.paginationLimitForArchive,
      search: search
    };
    if (typeof (search) === 'string' && search.length === 0) {
      this.myTeam.loading = true;
    }
    this.adminServices.allTeamsData(data, paginationData).subscribe(res => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.myTeam.pageCount = res.data.pageCount;
        this.myTeam.allTeams = res.data.teamsList;
        this.myTeam.teamsData = this.compiler.constructAllTeamsArchivedData(res.data.teamsList);
        this.myTeam.dataSource = new MatTableDataSource(this.myTeam.teamsData);
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


  /**
   * Unarchive site
   * @params siteData
   */
  unarchiveTeam(teamData: any) {
    this.adminServices.unarchiveTeam(teamData.id).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.getAllTeams(this.paginator.pageIndex, this.myTeam.search);
        this.helperService.createSnack(
          this.helperService.translated.MESSAGES.UNARCHIVED_TEAM_SUCCESS, this.helperService.constants.status.SUCCESS);
        this.dialogRef.close();
      } else {
        this.helperService.createSnack(
          this.helperService.translated.MESSAGES.UNARCHIVED_TEAM_FAIL, this.helperService.constants.status.ERROR);
        this.dialogRef.close();
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      this.dialogRef.close();
    });
  }

  /**
   * this function is used to close the dialog when the user clicks on the cancel button.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  goToPreviousTable() {
    this.paginator.pageIndex = this.paginator.pageIndex - 1;
    this.getAllTeams(this.paginator.pageIndex, this.myTeam.search);
  }
}
