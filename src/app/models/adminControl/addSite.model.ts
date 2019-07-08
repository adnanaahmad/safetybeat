import {Site} from 'src/app/models/site.model';
import {FormGroup} from '@angular/forms';
import {User} from '../user.model';

export interface AddSite {
  selectedUserSite: any;
  entityUsers: User[];
  site: Site;
  siteSafetyManager: User;
  createdBy: User;
  modalType: boolean;
  addSiteForm: FormGroup;
  loading: boolean;
}

