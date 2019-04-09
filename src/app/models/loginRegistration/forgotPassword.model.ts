import {FormGroup} from '@angular/forms';
import {Translation} from '../translate.model';

export interface ForgotPasswordComp {
  forgotPassForm: FormGroup;
  translated: Translation;
  email: FormGroup;
  success: any;
  appConstants: any;
  formErrorMatcher: any;
};
