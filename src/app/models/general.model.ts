import {FormGroup} from '@angular/forms';
import {User} from './user.model';

export interface GeneralModel {
  userData: User;
  resultData: any;
  enabled: boolean,
  generalForm: FormGroup,
  id: number
}
export interface GeneralInfo {
  username: string,
  email: string,
  first_name: string,
  last_name: string,
  contactNo: number
}
