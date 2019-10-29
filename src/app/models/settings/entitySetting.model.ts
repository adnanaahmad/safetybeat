import {FormGroup} from '@angular/forms';
import {EntityInfo} from '../userEntityData.model';
import {Subscription} from 'rxjs';
import {responseDetails, User} from '../user.model';


export interface EntitySetting {
  intervalPristine: boolean;
  selectedEntityData: any;
  intervalForm: FormGroup;
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

export interface Intervals {
  data: IntervalsData;
  responseDetails: responseDetails;
}

export interface IntervalsData {
  default: boolean;
  entity: number;
  id: number;
  interval1: number;
  interval2: number;
  interval3: number;
  interval4: number;
  interval5: number;
}
