import {FormGroup} from '@angular/forms';
import {EntityInfo} from '../userEntityData.model';
import {Subscription} from 'rxjs';

export interface EntitySetting {
  loading: boolean;
  entitiesList: any;
  entityManagedBy: any;
  selectedUser: any;
  allUsersList: any;
  allUsers: any;
  subscription: Subscription;
  entityForm: FormGroup;
  disabled: boolean;
  entitiesData: EntityInfo;
}
