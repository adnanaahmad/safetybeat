import {FormGroup} from '@angular/forms';
import {Translation} from '../translate.model';

export interface Login{
  loginForm: FormGroup;
  loading: boolean;
  data: any;
  translated: Translation;
  success: any;
  appConstants: any;
  formErrorMatcher: any;
  entities: any;
  devMode: boolean;
}
