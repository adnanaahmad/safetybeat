import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';

export interface CreateEntity {
  subscription: Subscription;
  createEntityForm: FormGroup;
  entityDetails: any;
  entityResponse: any;
  roleId: any;
  entitiesList: any;
  entityUserData: any;
  loading: boolean;
}
