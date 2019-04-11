import {SitesInfo} from 'src/app/models/site.model';
import {FormGroup} from '@angular/forms';

export interface AddSite {
  addSiteForm: FormGroup;
  entityData: any;
  entityId: any;
  addSiteResponse: any;
  sitesList: any;
  sitesData: SitesInfo[];
  loading: boolean;
}

