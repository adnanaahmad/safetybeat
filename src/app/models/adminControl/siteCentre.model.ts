import {SitesInfo} from '../site.model';
import {Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material';

export interface SiteCentre {
  dataSource: MatTableDataSource<SitesInfo[]>;
  pageCount: number;
  pageSize: number;
  search: string;
  siteOption: boolean;
  entitySelectedRole: string;
  sitesData: SitesInfo[];
  subscription: Subscription;
  firstIndex: number;
}

