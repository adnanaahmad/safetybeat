import {FormGroup} from '@angular/forms';

export interface Login {
  loginForm: FormGroup;
  loading: boolean;
  data: any;
  formErrorMatcher: any;
  entities: any;
}
