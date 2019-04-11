import {FormGroup} from '@angular/forms';

export interface CreateEntity {
  createEntityForm: FormGroup;
  entityDetails: any;
  entityResponse: any;
  roleId: number;
  entities: any;
  loading: boolean;
}

