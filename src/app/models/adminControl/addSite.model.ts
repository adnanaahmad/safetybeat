import {Site} from 'src/app/models/site.model';
import {FormGroup} from '@angular/forms';
import {User} from '../user.model';
import {Subscription} from 'rxjs';

export interface AddSite {
  subscription: Subscription;
  entityId: number;
  gpsTrackEnabled: boolean;
  radius: number;
  enableRadius: boolean;
  selectedUserSite: any;
  entityUsers: User[];
  site: Site;
  siteSafetyManager: User;
  currentUser: User;
  createdBy: User;
  modalType: boolean;
  addSiteForm: FormGroup;
  loading: boolean;
}

