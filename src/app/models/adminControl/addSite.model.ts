import {Translation} from '../translate.model';
import {Site, SitesInfo} from '../site.model';

export interface AddSite {
  translated: Translation;
  entityData: any;
  entityId: any;
  appConstants: any;
  addSiteResponse: any;
  sitesList: any;
  sitesData: SitesInfo[];
}
