import {FormGroup} from '@angular/forms';
import {Translation} from '../translate.model';

export interface PasswordRecovery {
  data: any;
  resetPasswordForm: FormGroup;
  appConstants: any;
  translated: Translation;
  formErrorMatcher: any;

}
