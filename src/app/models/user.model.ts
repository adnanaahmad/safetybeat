export interface UserData {
  user: User;
  packageInfo: PackageInfo[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  contactNo: string;
  profileImage: Blob;
  name: string;
  thumbnail: string;
}

export interface PackageInfo {
  package: string;
  module: string;
  expired: boolean;
  daysLeft: number;
  packageTotalDays?: number;
}

export interface responseDetails {
  code: number;
  message: string;
}

export interface validateUser {
  email: string
}

export interface loginCredentials {
  username: string;
  password: string;
}

export interface moduleRole {
  Safetybeat: string;
}

export interface LoginResponse {
  data: {
    firstLogin: boolean;
    token: string;
    user: User;
    packageInfo: Array<PackageInfo>
  }
  responseDetails: responseDetails;

}

export interface RegisterUser {
  first_name: string;
  last_name: string;
  email: string;
  contactNo: string;
  password1: string;
  password2: string;
}

export interface RegisterOrganization {
  name: string;
  type: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
  billingEmail: string;
  accountNo: string;
  contactNo: string;
}

export interface ModulePackage {
  name: string;
  package: object;
}

export interface registerData {
  user: RegisterUser;
  organization: RegisterOrganization;
  module_pkg: Array<ModulePackage>;
}

export interface ForgotPassword {
  email: string;
}

export interface ForgotPasswordResponse {
  data: {};
  responseDetails: responseDetails;
}

export interface packges {
  cost: string;
  id: number;
  noOfUsers: string;
  packageName: string;
}

export interface Verification {
  email: string
}

export interface VerificationResponse {
  detail: string;
}
