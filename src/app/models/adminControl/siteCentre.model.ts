import {Translation} from '../translate.model';
import {SitesInfo} from '../site.model';

export interface SiteCentre {
  translated: Translation;
  dataSource: any;
  appIcons: any;
  sitesList: any;
  sitesData: SitesInfo[];
  entityData: any;
  entityId: any;
  empty: boolean;
}

