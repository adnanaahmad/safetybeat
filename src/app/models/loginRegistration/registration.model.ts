import {Translation} from '../translate.model';

export interface Registration {
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
  translated: Translation;
  types: any;
  modules: any;
  packages: any;
  success: any;
  data: any;
  appConstants: any;
  appIcons: any;
  formErrorMatcher: any;
}
