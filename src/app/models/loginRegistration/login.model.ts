import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {EntityUserData} from '../userEntityData.model';
import {UserData} from '../user.model';

export interface Login {
  index: any;
  userData: UserData;
  showEntitySwitcher: boolean;
  allEntitiesData: any;
  navLinks: any;
  selectedEntity: any;
  entityUserData: EntityUserData;
  subscription: Subscription;
  loginForm: FormGroup;
  loading: boolean;
  data: any;
  entities: any;
}
