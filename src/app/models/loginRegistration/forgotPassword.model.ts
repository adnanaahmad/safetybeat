import {FormGroup} from '@angular/forms';

export interface ForgotPasswordComp {
  forgotPassForm: FormGroup;
  email: FormGroup;
  success: any;
  formErrorMatcher: any;
};
