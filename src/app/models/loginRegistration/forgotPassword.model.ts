import {FormGroup} from '@angular/forms';

export interface ForgotPasswordComp {
  loading: boolean;
  forgotPassForm: FormGroup;
  email: FormGroup;
  success: any;
};
