import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';

export interface Login {
  subscription: Subscription;
  loginForm: FormGroup;
  loading: boolean;
  data: any;
  entities: any;
}
