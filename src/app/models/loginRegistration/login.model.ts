import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {EntityUserData} from '../userEntityData.model';

export interface Login {
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
