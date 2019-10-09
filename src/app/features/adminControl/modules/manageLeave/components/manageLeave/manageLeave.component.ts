import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {ManageleaveService} from 'src/app/features/adminControl/modules/manageLeave/services/manageleave.service';
import {ManageLeave} from 'src/app/models/manageLeave.model';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {ProfileService} from 'src/app/features/profile/services/profile.service';
import {PaginationData} from 'src/app/models/site.model';
import {PermissionsModel} from 'src/app/models/adminControl/permissions.model';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';

@Component({
  selector: 'app-manageLeave',
  templateUrl: './manageLeave.component.html',
  styleUrls: ['./manageLeave.component.scss']
})
export class ManageLeaveComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  leaveModel: ManageLeave = <ManageLeave>{};

  constructor(
    public helperService: HelperService,
    private leaveService: ManageleaveService,
    private compiler: CompilerProvider,
    private profileService: ProfileService,
    public navService: NavigationService
  ) {
    this.initialize();
    this.getLeaveTypes();
  }

  ngOnInit() {
    this.leaveModel.selectedEntitySubscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res && res !== 1) {
        this.leaveModel.entityId = res.entityInfo.id;
        this.viewAllUserLeaves(this.leaveModel.firstIndex, this.leaveModel.search);
      }
    });
    this.leaveModel.subscription = this.navService.entityPermissions.subscribe((data: PermissionsModel) => {
      if (data) {
        this.leaveModel.permissions = data;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.leaveModel.subscription !== null && this.leaveModel.subscription !== undefined) {
      this.leaveModel.subscription.unsubscribe();
    }
    this.leaveModel.selectedEntitySubscription.unsubscribe();
  }

  initialize() {
    this.leaveModel.currentDate = new Date();
    this.leaveModel.loading = false;
    this.leaveModel.search = '';
    this.leaveModel.firstIndex = 0;
    this.leaveModel.pageSize = 10;
    this.leaveModel.displayedColumns = ['userName', 'leaveType', 'dateFrom', 'dateTo', 'reason', 'status', 'symbol'];
  }

  /**
   * this function is used to get all the leave types
   */
  getLeaveTypes() {
    this.profileService.getLeaveTypes().subscribe((res) => {
      if (res) {
        this.leaveModel.leaveTypes = res;
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }


  /**
   * this function is used to get all the leaves of any particular entity and then goes to the compiler
   * function to compile the data according to our requirements and then we apply pagination on it. and in the
   * error block we are handling error that will occur when the server is not responding.
   */

  viewAllUserLeaves(pageIndex, search) {
    this.leaveModel.dataSource = null;
    this.leaveModel.loading = true;
    let data = {
      entityId: this.leaveModel.entityId
    };
    let pagination: PaginationData = {
      offset: pageIndex * this.helperService.appConstants.paginationLimit,
      limit: this.helperService.appConstants.paginationLimit,
      search: search
    };
    this.leaveService.viewAllUserLeavesData(data, pagination).subscribe((res) => {
      this.leaveModel.pageCount = res.data.pageCount;
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.leaveModel.userLeavesData = this.compiler.manageLeaveTable(res);
        this.leaveModel.loading = false;
        this.leaveModel.dataSource = new MatTableDataSource(this.leaveModel.userLeavesData);
      } else {
        this.leaveModel.loading = false;
        // this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.leaveModel.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }


  approveLeave(data) {
    this.leaveModel.loading = true;
    let leaveData = {
      approveReject: true,
      approved: true,
      dateFrom: data.leavesData.dateFrom,
      dateTo: data.leavesData.dateTo,
      description: data.leavesData.description,
      entity: data.leavesData.entity,
      id: data.leavesData.id,
      leaveType: data.leavesData.leaveType.id,
      rejected: false
    };
    this.leaveService.acceptRejectUserLeaves(data.leavesData.id, leaveData).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.viewAllUserLeaves(this.paginator.pageIndex, this.leaveModel.search);
        this.leaveModel.loading = false;
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.SUCCESS);
      } else {
        this.leaveModel.loading = false;
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.leaveModel.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });

  }

  rejectLeave(data) {
    this.leaveModel.loading = true;
    let leaveData = {
      approveReject: true,
      approved: false,
      dateFrom: data.leavesData.dateFrom,
      dateTo: data.leavesData.dateTo,
      description: data.leavesData.description,
      entity: data.leavesData.entity,
      id: data.leavesData.id,
      leaveType: data.leavesData.leaveType.id,
      rejected: true
    };
    this.leaveService.acceptRejectUserLeaves(data.leavesData.id, leaveData).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.viewAllUserLeaves(this.paginator.pageIndex, this.leaveModel.search);
        this.leaveModel.loading = false;
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.SUCCESS);
      } else {
        this.leaveModel.loading = false;
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.leaveModel.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }


}
