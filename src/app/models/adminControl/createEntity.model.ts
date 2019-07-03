import {FormGroup} from '@angular/forms';
import {entityData} from '../entity.model';
import {responseDetails} from '../user.model';
import {Subscription} from 'rxjs';

export interface CreateEntity {
  createEntityForm: FormGroup;
  entityDetails: EntityDetails;
  roleId: number;
  loading: boolean;
  subscription: Subscription;
}

export interface EntityDetails {
  moduleName: string;
  entityData: entityData;
  active: boolean;
}

export interface CreateEntityResponse {
  data: Array<object>;
  responseDetails: responseDetails;
}

