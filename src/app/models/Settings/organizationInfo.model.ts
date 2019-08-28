import {FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Type} from '../loginRegistration/registration.model';

export interface OrganizationInfo {
  loading: boolean;
  organizationForm: FormGroup;
  orgID: any;
  pipe: DatePipe;
  enabled: boolean;
  types: Type[];
  type: any;
}
export interface Organization {
  accountNo: string
  address: string
  billingEmail: string
  dateJoined: string
  id: number
  name: string
  phoneNo: string
  type: string
  countryCode: string
}
