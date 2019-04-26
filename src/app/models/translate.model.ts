export interface Translation {
  AUTH: Auth;
  BUTTONS: Buttons;
  MESSAGES: Messages;
  LOGGER: Logger;
  STRINGS: Strings;
  SITETITLE: SiteTitle;
  STATUS: Status;
  TABLEHEADINGS: TableHeadings;
  CONFIRMATION: Confirmation;
}

export interface Strings {
  USERNAME: string;
  FIRSTNAME: string;
  LASTNAME: string;
  EMAIL: string;
  MOBILE: string;
  LIGHTDEFAULT: string;
  EVILDARK: string;
  OLIVEGREEN: string;
  DARKFOREST: string;
  OTHERSETTINGS: string;
  CHANGETHEME: string;
  EXPAND: string;
  REMOVE: string;
  USERINFO: string;
  SITEADDRESS: string;
  SITESAFETYPLAN: string;
  SITESAFETYMANAGER: string;
}

export interface Auth {
  USERNAME: string;
  PASSWORD: string;
  EMAIL: string;
  FIRSTNAME: string;
  LASTNAME: string;
  CONFIRM_PASSWORD: string;
  MOBILENO: string;
  PASSWORD1: string;
  PASSWORD2: string;
  ADDRESS: string;
  ZIPCODE: string;
  CITY: string;
  COUNTRY: string;
  ACCOUNTNO: string;
  BILLING_EMAIL: string;
  FAX: string;
  ROLE: string;
  USERNAME_REQ: string;
  PASSWORD_REQ: string;
  ROLE_REQ: string;
  FIRSTNAME_REQ: string;
  LASTNAME_REQ: string;
  EMAIL_VALID: string;
  EMAIL_REQ: string;
  EMAIL_EXISTS: string;
  CONFIRMPASSWORD_REQ: string;
  MOBILE_REQ: string;
  ADDRESS_REQ: string;
  CITY_REQ: string;
  COUNTRY_REQ: string;
  ZIPCODE_REQ: string;
  BILLINGEMAIL_REQ: string;
  BILLING_EMAIL_VALID: string;
  BILLING_EMAIL_EXISTS: string;
  ACCOUNTNO_REQ: string;
  FAXNO_REQ: string;
  USER: string;
  TOKEN: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  MOBILE_NO: string;
  ORGANIZATION_NAME: string;
  ORGANIZATIONNAME_REQ: string;
  ORG_NAME_EXISTS: string;
  CURRENT_PASSWORD: string;
  TRIAL: string;
  OWNER: string;
  LOGOUTSUCCESSION: string;
}

export interface Icons {
  MOVE_VERT: string;
  CHANGE_HISTORY: string;
  DATA_USAGE: string;
  CROP_DIN: string;
  PANORAMA_HORIZONTAL: string;
  ALL_INCLUSIVE: string;
  RADIO_BUTTON_UNCHECKED: string;
  PANORAMA_WIDE_ANGLE: string;
  MY_LOCATION: string;
  SHARE: string;
  WAVES: string;
  GPS_NOT_FIXED: string;
  SCATTER_PLOT: string;
  DETAILS: string;
  TEXTURE: string;
}

export interface Strings {
  EXPAND: string;
  REMOVE: string;
  EMAIL: string;
  USERNAME: string;
  PASSWORD: string;
  FIRSTNAME: string;
  LASTNAME: string;
  MOBILENO: string;
  PASSWORD1: string;
  PASSWORD2: string;
  NAME: string;
  TYPE: string;
  ADDRESS: string;
  CITY: string;
  COUNTRY: string;
  ZIPCODE: string;
  BILLINGEMAIL: string;
  ACCOUNTNO: string;
  PHONENO: string;
  FAX: string;
  PACKAGE_DESCRIPTION_1: string;
  PACKAGE_DESCRIPTION_2: string;
  PACKAGE_DESCRIPTION_3: string;
}

export interface Buttons {
  LOGIN: string;
  REGISTER: string;
  FORGOTPASSWORD: string;
  CANCEL: string;
  RESET: string;
  NEXT: string;
  BACK: string;
  SUBMIT: string;
  LOGINTEXT: string;
  RESEND_EMAIL: string;
  CHANGE_EMAIL: string;
  EDIT_ACCOUNT: string;
  CHANGE_PASSWORD: string;
  NO_THANKS: string;
  FIELDCOMMUNICATION: string;
  CHANGEPASSWORD: string;
  LEAVE: string;
  SAFETYBEAT: string;
  ENTRIES: string;
  ACTIVITIES: string;
  PROFIILE_INFO: string;
  JOIN_ENTITY: string;
  CREATE_ENTITY: string;
  SKIP: string;
  MAP: string;
  HOURS: string;
  INVITE_USER: string;
  INVITETEAM: string;
  ADD_SITE: string;
  IMPORT_SITE: string;
  SAVE: string;
  UPGRADE: string;
  GETSTARTED: string;
  LEARNMORE: string;
  DELETE: string;
}

export interface Messages {
  GENERAL_UPDATED: string;
  GENERAL_FAIL: string;
  ORG_DETAILS: string;
  INCORRECT_PASS: string;
  CHANGEPASSWORD: string;
  WELCOME: string;
  WELCOME_MSG: string;
  NOACCOUNT: string;
  VERIFY_ACCOUNT: string;
  VERIFY_MSG: string;
  SIGNEDUP_EMAIL_MSG: string;
  VERIFY_REQ: string;
  CHANGE_EMAIL: string;
  EMAIL_RESET_PLACEHOLDER: string;
  QUESTION_QUERY: string;
  REACH_MSG: string;
  HELP_EMAIL: string;
  SIGNINMESSAGE: string;
  OR: string;
  SIGNUPMESSAGE: string;
  RESETMESSAGE: string;
  PASSWORD_ERROR: string;
  MATCH_ERROR: string;
  RESET_MSG: string;
  EMAIL_MSG: string;
  ORGANIZATION_MSG: string;
  TYPE_MSG: string;
  MODULE_MSG: string;
  MODULESELECT_MSG: string;
  PACKAGESELECT_MSG: string;
  USERDETAILS_MSG: string;
  LOADING_URL: string;
  LOGIN_SUCCESS: string;
  LOGIN_FAIL: string;
  LOGIN_MSG: string;
  LOGINFAIL_MSG: string;
  LOGOUT_SUCCESS: string;
  LOGOUT_MSG: string;
  LOGOUT_FAIL_MSG: string;
  LOGOUT_FAIL: string;
  RESET_SUCCESS: string;
  RESETMSG: string;
  USERNAME_EXISTS: string;
  EMAIL_CHANGED: string;
  NOT_REGISTETRED: string;
  INVALID_PASSWORD: string;
  RESETFAIL: string;
  RESETFAIL_MSG: string;
  CHANGEPASSWORD_FAIL: string;
  CHANGEPASSWORD_SUCCESS: string;
  ANONYMOUS: string;
  SAFETYBEAT: string;
  NOTFOUND_HEADING: string;
  NOTFOUND_DESCRIPTION: string;
  ALREADY_ACCOUNT: string;
  PROFIILE_INFO: string;
  ORGSIGNUP: string;
  ORGSIGNUPMESSAGE: string;
  ENTITYNAME_REQ: string;
  OFFICELOCATION_REQ: string;
  CREATEENTITY_MSG: string;
  INVITE_USER: string;
  ENTITYNAME: string;
  HEADOFFICE_LOCATION: string;
  STATUS: string;
  JOINENTITY_MSG: string;
  ENTITYCODE: string;
  ENTITYCODE_REQ: string;
  JOINENTITY_SUCCESS: string;
  ALREADYJOINED_ENTITY: string;
  ENTITYNOTFOUND: string;
  ENTITYJOINFIAL: string,
  INVITETEAMSUCCESS: string;
  INVITETEAMFAIL: string;
  INVITETEAMTITLE: string;
  INVITETEAMPLACEHOLDER: string;
  BACKEND_ERROR: string;
  ORGTYPEMESSAGE: string;
  VERIFICATIONCODEEMAIL: string;
  ADDSITE_MSG: string;
  SITE_NAME: string;
  INVALIDADDRESS: string;
  NOUSER: string;
  NOUSERTITLE: string;
  EMAIL_NOT_REGISTERED: string;
  INVALID_EMAIL: string;
  NO_RECORD_AVAILABLE: string;
  IMPORTSITE_MSG: string;
  CSVIMPORT_MSG: string;
  SITE_CREATED: string;
  SITE_FAILED: string;
  INVITE_SUCCESS: string;
  INVITE_FAILURE: string;
  SAFETY_PLAN_REQ: string;
  SITE_NAME_REQ: string;
  ENTITY_DELETE: string;
  ENTITY_DELETE_TITLE: string;
  ENTITY_DELETE_FAIL: string;
  ENTITY_DELETE_FAIL_TITLE: string;
  SITE_IMPORT_SUCCESS: string;
  SITE_IMPORT_FAILURE: string;
  IMPORTSITE_NOTE: string;
  TRIAL_EXPIRED: string;
  TRIAL_LEFT_1: string;
  TRIAL_LEFT_2: string;
  TRIAL_EXP_USER: string;
  SITE_IS_SAFE: string;
  SITE_IS_NOT_SAFE: string;
  VIEW_SITE_SUCCESS: string;
  VIEW_SITE_FAILURE: string;
  DELETE_SITE_SUCCESS: string;
  DELETE_SITE_FAILURE: string;
  EDIT_SITE_MSG: string;
  SAFETYBEAT_PRICING: string;
  PRICING_TAGLINE: string;
  CALLTOACTION_TITLE: string;
  CALLTOACTION_DESCRIPTION: string;
  FAQS_TITLE: string;
  ENTITY_UPDATED: string;
  INVALID_ENTITY: string;
  ENTITY_UPDATED_T: string;
  INVALID_DATA: string;
  VERIFY_ERR: string;
  VERIFIED: string;
  CHANGE_ACCESS_LEVEL: string;
  REMOVE_CONNECTIONS: string;
  VIEW_CONNECTIONS: string;
  ADD_CONNECTIONS: string;
  SAFETY_MANAGER_REQ: string;
  USER_NOT_FOUND: string;
  SITE_EDIT_SUCCESS: string;
  SITE_EDIT_FAILURE: string;
}

export interface Logger {
  STATUS: LoggerStatus;
  MESSAGES: LoggerMessage;
}

export interface LoggerStatus {
  DEFAULT: string;
  INFO: string;
  SUCCESS: string;
  WARNING: string;
  ERROR: string;
}

export interface LoggerMessage {
  LOGGEDIN: string;
  CREDENTIAL_REQ: string;
  TRUE: string;
  FALSE: string;
  STATUS: string;
  FORGOT_REQ: string;
  FORGOTSUCCESS: string;
  REGISTRATIONDATA_SUCCESS: string;
  REGISTRATION_REQ: string;
  REGISTRATION_SUCCESS: string;
  PROFILE_SUCCESS: string;
  PROFILE_ERROR: string;
  LOGIN_COMPONENT: string;
  REGISTRATION_COMPONENT: string;
  FORGOT_COMPONENT: string;
  PARTICLE_COMPONENT: string;
  DASHBOARD_COMPONENT: string;
  NAVIGATION_COMPONENT: string;
  SIDE_NAV: string;
  PROFILE_COMPONENT: string;
  VERIFICATION_COMPONENT: string;
  PROFILE_CREDENTIAL_REQ: string;
  PROFILE_UPDATED: string;
  PROFILE_NOTUPDATED: string;
  PASSWORD_CHANGE: string;
  PASSWORDCHANGE_UNSUCCESS: string;
  CHANGEPASSWORDFOR_DEV: string;
  ENTITYCONTROL: string;
  ORGANIZATIONDETAILS: string;
  CREATEENTITY: string;
  JOINENTITY: string;
  PASSWORDCHANGE: string;
  SETTING_COMPONENT: string;
  CREATEENTITY_ERROR: string;
  INVITEUSER_ERROR: string;
  ENTITYNOTCREATED: string;
  ROLES_RECIEVED: string;
  ROLES_RECIEVED_ERROR: string;
  ORG_SUCCESS: string;

}

export interface SiteTitle {
  MEMBERCENTER_TITLE: string;
  MEMBERCENTER_DESCRIPTION: string;
  ENTITYCONTROL_TITLE: string;
  ENTITYCONTROL_DESCRIPTION: string;
  USERS_TITLE: string;
  USERS_DESCRIPTION: string;
  SETTINGS_TITLE: string;
  SETTINGS_DESCRIPTION: string;
  SITE_CENTRE: string;
  SITE_CENTRE_DESCRIPTION: string;
}

export interface TableHeadings {
  ENTITY_ID: string;
  ENTITY_NAME: string;
  ENTITY_HEADOFFICE: string;
  ENTITY_CODE: string;
  ENTITY_STATUS: string;
  ACTIONS: string;
  NAME: string;
  EMAIL: string;
  CONTACT: string;
  ACCESS_LEVEL: string;
  SITE: string;
  LAST_ACTION: string;
  DATE_TIME: string;
  TIMEZONE: string;
  ADMINISTRATED_BY: string;
  SITE_NAME: string;
  SITE_ADDRESS: string;
  SITE_SAFE_ZONE: string;
  SITE_CREATED_BY: string;
  MANAGED_BY: string;
  SITE_SAFETY_MANAGER: string;
}

export interface Status {
  DEFAULT: string;
  INFO: string;
  SUCCESS: string;
  WARNING: string;
  ERROR: string;
  CUSTOM: string;
}

export interface Confirmation {
  ACTIVATE_USER: string;
  DEACTIVATE_USER: string;
  DELETE_SITE: string;
  DELETE_ENTITY: string;
  ADD_CONNECTION: string;
  REMOVE_CONNECTION: string
}
