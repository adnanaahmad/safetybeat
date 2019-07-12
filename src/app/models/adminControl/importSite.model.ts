import {FormGroup} from '@angular/forms';
import {SitesInfo} from '../site.model';

export interface ImportSite {
  importSiteResponse: any;
  entityId: number;
  entityData: any;
  importSiteForm: FormGroup;
  loading: boolean;
  csvFile: File;
  type: 'multipart/form-data';
  sitesList: any;
  sitesData: Array<SitesInfo>;
}
