import {Site, SitesInfo} from '../site.model';
import {Subscription} from 'rxjs';

export interface SiteCentre {
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
}

