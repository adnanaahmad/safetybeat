import {SitesInfo} from '../site.model';

export interface SiteCentre {
  siteOption: boolean;
  entitySelectedRole: string;
  dataSource: any;
  sitesList: any;
  sitesData: SitesInfo[];
  entityData: any;
  entityId: any;
  empty: boolean;
  viewSiteResponse: any;
}

