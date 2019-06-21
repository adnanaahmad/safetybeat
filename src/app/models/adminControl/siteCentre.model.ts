import {Site, SitesInfo} from '../site.model';
import {Subscription} from 'rxjs';

export interface SiteCentre {
  data: any;
  entitiesData: any;
  allEntities: any;
  siteOption: boolean;
  entitySelectedRole: string;
  dataSource: any;
  sitesList: any;
  sitesData: SitesInfo[];
  entityData: any;
  entityId: any;
  empty: boolean;
  viewSiteResponse: any;
  subscription: Subscription;
  lastIndex: number;
  firstIndex: number;
  paginationData: any[];
}

