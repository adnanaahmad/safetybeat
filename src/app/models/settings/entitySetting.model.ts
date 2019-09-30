import {FormGroup} from '@angular/forms';
import {EntityInfo} from '../userEntityData.model';
import {Subscription} from 'rxjs';
import {User} from '../user.model';


export interface EntitySetting {
  entityUsers: Array<User>;
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
