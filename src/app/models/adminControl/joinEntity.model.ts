import {FormGroup} from '@angular/forms';

export interface JoinEntity {
  joinEntityForm: FormGroup;
  joinEntityData: JoinEntityApiData;
  entityResponse: any;
}

export interface JoinEntityApiData {
  moduleName: string;
  entityCode: string;
}
