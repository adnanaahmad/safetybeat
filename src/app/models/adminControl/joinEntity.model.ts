import {FormGroup} from '@angular/forms';

export interface JoinEntity {
  joinEntityForm: FormGroup;
  joinEntityData: JoinEntityApiData;
  entityResponse: any;
  loading: boolean;
}

export interface JoinEntityApiData {
  moduleName: string;
  entityCode: string;
}
