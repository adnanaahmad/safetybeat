import {Translation} from '../translate.model';
import {FormGroup} from '@angular/forms';

export interface CreateEntity {
  translated: Translation;
  appConstants: any;
  title: String;
  addrKeys: string[];
  addr: any;
  city: string;
  country: string;
  zipCode: string;
  appIcons: any;
  createEntityForm: FormGroup;
  entityDetails: any;
  entityResponse: any;
  roleId: number;
  entites: any;
  displaySubmitButton: boolean;
  loading: boolean;
}

