import {FormGroup} from '@angular/forms';

export interface CreateEntity {
  createEntityForm: FormGroup;
  entityDetails: any;
  entityResponse: any;
  roleId: any;
  entitiesList: any;
  entityUserData: any;
  loading: boolean;
}
