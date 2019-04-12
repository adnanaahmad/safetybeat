import {FormGroup} from '@angular/forms';

export interface RegistrationComp {
  userForm: FormGroup;
  organizationForm: FormGroup;
  organizationTypeForm: FormGroup;
  email: FormGroup;
  organizationData: any;
  registrationData: any;
  userEmail: any;
  loading: boolean;
  registerData: any;
  types: Type[];
  modules: any;
  packages: any;
  success: any;
  data: any;
  formErrorMatcher: any;
}

export interface Type {
  id: number;
  name: string;
}
