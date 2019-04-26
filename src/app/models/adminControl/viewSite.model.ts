import {Site} from '../site.model';
import {User} from '../user.model';


export interface ViewSite {
  siteSafetyManager: User;
  siteOption: boolean;
  entitySelectedRole: string;
  siteApi: any;
  siteInfo: Site;
  siteId: any;

}
