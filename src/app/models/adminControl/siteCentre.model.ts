import {Translation} from '../translate.model';
import {SitesInfo} from '../site.model';

export interface SiteCentre {
  siteOption: boolean;
  entitySelectedRole: string;
  translated: Translation;
  dataSource: any;
  appIcons: any;
  sitesList: any;
  sitesData: SitesInfo[];
  entityData: any;
  entityId: any;
  empty: boolean;
}

