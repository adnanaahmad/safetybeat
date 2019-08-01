import {MatTableDataSource} from '@angular/material';

export interface ManageLeave {
  displayedColumns: Array<string>;
  userLeavesData: any;
  dataSource: MatTableDataSource<any>
}

export interface DataSource {
  userName: string;
  status: string;
  leaveType: string;
  dateFrom: string;
  dateTo: string;
  reason: string;
  symbol: string;
}

export interface AllUserLeavesApiData {
  entityId: number;
}
