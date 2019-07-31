import {FormGroup} from '@angular/forms';
import {User} from './user.model';

export interface GeneralModel {
  loading: boolean;
  userData: User;
  resultData: any;
  enabled: boolean,
  generalForm: FormGroup,
  id: number,
  email: any,
  success: any
}
export interface GeneralInfo {
  username: string,
  email: string,
  first_name: string,
  last_name: string,
  contactNo: number,
  countryCode: number
}
