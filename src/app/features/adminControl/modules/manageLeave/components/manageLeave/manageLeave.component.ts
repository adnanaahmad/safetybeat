import {Component, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {ManageleaveService} from '../../services/manageleave.service';

export interface PeriodicElement {
  userName: string;
  status: string;
  leaveType: string;
  dateFrom: string;
  dateTo: string;
  reason: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
      userName: 'Adnan',
      status: 'Pending',
      leaveType: 'Annual',
      dateFrom: 'abc',
      dateTo: 'def',
      reason: 'meri merzi',
      symbol: 'H'
    },
    {
      userName: 'Adnan',
      status: 'Pending',
      leaveType: 'Annual',
      dateFrom: 'abc',
      dateTo: 'def',
      reason: 'meri merzi',
      symbol: 'H'
    },
    {
      userName: 'Adnan',
      status: 'Pending',
      leaveType: 'Annual',
      dateFrom: 'abc',
      dateTo: 'def',
      reason: 'meri merzi',
      symbol: 'H'
    },
    {
      userName: 'Adnan',
      status: 'Pending',
      leaveType: 'Annual',
      dateFrom: 'abc',
      dateTo: 'def',
      reason: 'meri merzi',
      symbol: 'H'
    },
    {
      userName: 'Adnan',
      status: 'Pending',
      leaveType: 'Annual',
      dateFrom: 'abc',
      dateTo: 'def',
      reason: 'meri merzi',
      symbol: 'H'
    }
  ]
;

@Component({
  selector: 'app-manageLeave',
  templateUrl: './manageLeave.component.html',
  styleUrls: ['./manageLeave.component.scss']
})
export class ManageLeaveComponent implements OnInit {
  array = [
    {id: 1, name: 'adnan'},
    {id: 2, name: 'zohaib'},
    {id: 3, name: 'shoaib'},
    {id: 4, name: 'sohaib'},
    {id: 5, name: 'sobi'}
  ];
  displayedColumns: string[] = ['userName', 'status', 'leaveType', 'dateFrom', 'dateTo', 'reason', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public helperService: HelperService,
    private leaveServiceL: ManageleaveService
  ) {
    this.viewAllUserLeaves();
  }

  ngOnInit() {
  }

  viewAllUserLeaves() {
    let data = {
      entityId: this.helperService.getEntityId()
    };
    this.leaveServiceL.viewAllUserLeavesData(data).subscribe((res) => {
      debugger;
    });
  }


}
