import {MatTableDataSource} from '@angular/material';
import {LeaveTypes} from './profile/profile.model';

export interface ManageLeave {
  currentDate: string;
  loading: boolean;
  pageCount: number;
  pageSize: number;
  firstIndex: number;
  search: string;
  leaveTypes: Array<LeaveTypes>;
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
