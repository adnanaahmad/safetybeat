import {Component, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {ManageleaveService} from '../../services/manageleave.service';
import {ManageLeave} from 'src/app/models/manageLeave.model';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';

@Component({
  selector: 'app-manageLeave',
  templateUrl: './manageLeave.component.html',
  styleUrls: ['./manageLeave.component.scss']
})
export class ManageLeaveComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  leaveModel: ManageLeave = <ManageLeave>{};

  constructor(
    public helperService: HelperService,
    private leaveServiceL: ManageleaveService,
    private compiler: CompilerProvider,
  ) {
    this.viewAllUserLeaves();
  }

  ngOnInit() {
    this.leaveModel.displayedColumns = ['userName', 'leaveType', 'dateFrom', 'dateTo', 'reason', 'status', 'symbol'];

  }

  /**
   * this function is used to get all the leaves of any particular entity and then goes to the compiler
   * function to compile the data according to our requirements and then we apply pagination on it. and in the
   * error block we are handling error that will occur when the server is not responding.
   */

  viewAllUserLeaves() {
    let data = {
      entityId: this.helperService.getEntityId()
    };
    this.leaveServiceL.viewAllUserLeavesData(data).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.leaveModel.userLeavesData = this.compiler.manageLeaveTable(res);
        this.leaveModel.dataSource = new MatTableDataSource(this.leaveModel.userLeavesData);
        this.leaveModel.dataSource.paginator = this.paginator;
      } else {
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }


}
