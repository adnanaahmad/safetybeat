import {SitesInfo} from '../site.model';
import {Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material';
import {PermissionsModel} from './permissions.model';

export interface SiteCentre {
  permissions: PermissionsModel;
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

