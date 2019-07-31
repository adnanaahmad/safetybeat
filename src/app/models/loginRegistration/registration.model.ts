import {FormGroup} from '@angular/forms';
import {User} from '../user.model';

export interface RegistrationComp {
  userForm: FormGroup;
  organizationForm: FormGroup;
  organizationTypeForm: FormGroup;
  email: FormGroup;
  organizationData: Organization;
  registerData: RegUserData;
  userEmail: any;
  loading: boolean;
  registerationData: any;
  types: Type[];
  modules: any;
  packages: any;
  success: any;
  data: any;
}

export interface RegistrationObject {
  userForm: FormGroup;
  organizationForm: FormGroup;
  organizationTypeForm: FormGroup;
  organizationData: Organization;
  registerData: RegUserData;
  userEmail: {
    email: string
  };
  loading: boolean;
  registerationData?: any;
  types: Type[];
  modules: string;
}

export interface RegistrationResponseObject {
  password1?: Array<string>;
  data: {
    token: string;
    userData: User;
    userId: number;
  }
  responseDetails: {
    code: number;
    message: string;
  }
}

export interface Organization {
  accountNo: string;
  address: string;
  name: string;
  phoneNo: string;
  type: number;
}

export interface Type {
  id: number;
  name: string;
}

export interface OrgData {
  name: string;
  address: string;
  billingEmail: string;
  accountNo: string;
  phoneNo: string;
  type: number;
}

export interface OrgFormData {
  address: string;
  name: string;
}

export interface UserFormData {
  countryCode: string;
  first_name: string;
  last_name: string;
  password1: string;
  password2: string;
  contactNo: string;
}

export interface RegUserData {
  email: string;
  first_name: string;
  last_name: string;
  password1: string;
  password2: string;
  contactNo: string;
  organization: Organization;
  invitation: boolean;
  moduleName: string;
  package: string;
  roleId: string;
}

export interface OrganizationType {
  id: number;
  name: string;
}
