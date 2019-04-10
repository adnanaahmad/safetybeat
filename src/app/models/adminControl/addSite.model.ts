import {Translation} from '../translate.model';
import {Site, SitesInfo} from '../site.model';
import {FormGroup} from '@angular/forms';

export interface AddSite {
  addr: any;
  addSiteForm: FormGroup;
  translated: Translation;
  entityData: any;
  entityId: any;
  appConstants: any;
  addSiteResponse: any;
  sitesList: any;
  sitesData: SitesInfo[];
  loading: boolean;
  displaySubmitButton: boolean;
}

