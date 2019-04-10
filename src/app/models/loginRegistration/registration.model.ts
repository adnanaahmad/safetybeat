import {FormGroup} from '@angular/forms';

export interface RegistrationComp {
  userForm: FormGroup;
  organizationForm: FormGroup;
  organizationTypeForm: FormGroup;
  moduleForm: FormGroup;
  email: FormGroup;
  title: string;
  addr: any;
  addrKeys: string[];
  organizationData: any;
  registrationData: any;
  devMode: boolean;
  userEmail: any;
  city: string;
  country: string;
  zipCode: string;
  displayNextButton: boolean;
  loading: boolean;
  registerData: any;
  types: any;
  modules: any;
  packages: any;
  success: any;
  data: any;
  formErrorMatcher: any;
}
