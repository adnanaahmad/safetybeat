export interface User {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    mobile_no: string;
    password: string;
}
export interface loginCredentials {
    username: string;
    password: string;
}
export interface LoginResponse {
    user: User;
    token: string;
}
export interface RegisterUser {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    mobile_no: string;
    password: string;
    password2: string;
}
export interface RegisterOrganization {
    name: string;
    type: string;
    address: string;
    zipCode: string;
    city: string;
    country: string;
    fax: string;
    billingEmail: string;
    accountNo: string;
    phoneNo: string;
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
    detail: string;
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
