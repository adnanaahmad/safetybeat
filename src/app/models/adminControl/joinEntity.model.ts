import {Translation} from '../translate.model';
import {FormGroup} from '@angular/forms';

export interface JoinEntity {
  joinEntityForm: FormGroup;
  translated: Translation;
  appConstants: any;
  joinEntityData: any;
  entityResponse: any;
  entities: any;
}
