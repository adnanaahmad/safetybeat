import {FormGroup} from '@angular/forms';
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
  name: string;
  headOffice: string;
  status: boolean;
  active: boolean;
  role: string;
}

export interface CreateEntityResponse {
  data: Array<object>;
  responseDetails: responseDetails;
}

