import {Site} from 'src/app/models/site.model';
import {FormGroup} from '@angular/forms';
import {User} from '../user.model';

export interface AddSite {
  site: Site;
  siteSafetyManager: User;
  createdBy: User;
  modalType: boolean;
  addSiteForm: FormGroup;
  entityData: any;
  entityId: any;
  addSiteResponse: any;
  loading: boolean;
}

