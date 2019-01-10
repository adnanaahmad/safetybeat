export interface Translation {
    AUTH: Auth,
    BUTTONS: Buttons,
    MESSAGES: Messages,
    LOGGER: Logger
}
export interface Auth {
    USERNAME: string,
    PASSWORD: string,
    EMAIL: string,
    FIRSTNAME: string,
    LASTNAME: string,
    CONFIRM_PASSWORD: string,
    MOBILENO: string,
    PASSWORD1: string,
    PASSWORD2: string,
    ADDRESS: string,
    ZIPCODE: string,
    CITY: string,
    COUNTRY: string,
    ACCOUNTNO: string,
    BILLING_EMAIL: string,
    FAX: string,
    USERNAME_REQ: string,
    PASSWORD_REQ: string,
    FIRSTNAME_REQ: string,
    LASTNAME_REQ: string,
    EMAIL_VALID: string,
    EMAIL_REQ: string,
    EMAIL_EXISTS: string,
    CONFIRMPASSWORD_REQ: string,
    MOBILE_REQ: string,
    ADDRESS_REQ: string,
    CITY_REQ: string,
    COUNTRY_REQ: string,
    ZIPCODE_REQ: string,
    BILLINGEMAIL_REQ: string,
    BILLING_EMAIL_VALID: string,
    BILLING_EMAIL_EXISTS: string,
    ACCOUNTNO_REQ: string,
    FAXNO_REQ: string,
    USER: string,
    TOKEN: string,
    FIRST_NAME: string,
    LAST_NAME: string,
    MOBILE_NO: string,
    ORGANIZATION_NAME: string,
    ORGANIZATIONNAME_REQ: string,
    ORG_NAME_EXISTS: string
}
export interface Buttons {
    LOGIN: string,
    REGISTER: string,
    FORGOTPASSWORD: string,
    CANCEL: string,
    RESET: string,
    NEXT: string,
    BACK: string,
    SUBMIT: string,
    LOGINTEXT: string
}
export interface Messages {
    SIGNINMESSAGE: string,
    OR: string,
    SIGNUPMESSAGE: string,
    RESETMESSAGE: string,
    PASSWORD_ERROR: string,
    MATCH_ERROR: string,
    RESET_MSG: string,
    EMAIL_MSG: string,
    ORGANIZATION_MSG: string,
    TYPE_MSG: string,
    MODULE_MSG: string,
    MODULESELECT_MSG: string,
    PACKAGESELECT_MSG: string,
    USERDETAILS_MSG: string,
    LOADING_URL: string,
    LOGIN_SUCCESS: string,
    LOGIN_FAIL: string,
    LOGIN_MSG: string,
    LOGINFAIL_MSG: string,
    LOGOUT_SUCCESS: string,
    LOGOUT_MSG: string,
    RESET_SUCCESS: string,
    RESETMSG: string,
    USERNAME_EXISTS: string
}
export interface Logger {
    STATUS: LoggerStatus,
    MESSAGES: LoggerMessage,
}
export interface LoggerStatus {
    DEFAULT: string,
    INFO: string,
    SUCCESS: string,
    WARNING: string,
    ERROR: string
}
export interface LoggerMessage {
    LOGGEDIN: string,
    CREDENTIAL_REQ: string,
    TRUE: string,
    FALSE: string,
    STATUS: string,
    FORGOT_REQ: string,
    FORGOTSUCCESS: string,
    REGISTRATIONDATA_SUCCESS: string,
    REGISTRATION_REQ: string,
    REGISTRATION_SUCCESS: string,
    PROFILE_SUCCESS: string,
    PROFILE_ERROR: string,
    LOGIN_COMPONENT: string,
    REGISTRATION_COMPONENT: string,
    FORGOT_COMPONENT: string,
    PARTICLE_COMPONENT: string,
    DASHBOARD_COMPONENT: string,
    NAVIGATION_COMPONENT: string,
    SIDE_NAV: string,
    PROFILE_COMPONENT: string
}