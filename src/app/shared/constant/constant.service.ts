import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class ConstantService {
  constructor() { }

  static apiRoutes = {
    login: `${environment.apiUrl}/login/`,
    signup: `${environment.apiUrl}/registration/`,
    companyTypes: `${environment.apiUrl}/companyTypes/`,
    modules: `${environment.apiUrl}/modules/`,
    packages: `${environment.apiUrl}/packages/`,
    passwordReset: `${environment.apiUrl}/users/resetPassword/`,
    organization: `${environment.apiUrl}/organization/`,
    user: `${environment.apiUrl}/users/viewUser/`,
    checkUsername: `${environment.apiUrl}/users/checkUsername/`,
    checkEmail: `${environment.apiUrl}/users/checkEmail/`,
    checkOrgName: `${environment.apiUrl}/organization/checkOrgName/`,
    checkBilling: `${environment.apiUrl}/organization/checkOrgEmail/`,
    resendverification: `${environment.apiUrl}/sendEmailVerification/`,
    changeEmail: `${environment.apiUrl}/users/editEmail/`,
    editProfile: `${environment.apiUrl}/users`,
    editEntity: `${environment.apiUrl}/entity`,
    changePassword: `${environment.apiUrl}/users/changePassword/`,
    getInvite: `${environment.apiUrl}/registration/`,
    createEntity: `${environment.apiUrl}/entity/createEntity/`,
    viewAllEntities: `${environment.apiUrl}/entity/viewAllEntities/`,
    joinEntity: `${environment.apiUrl}/entity/joinEntity/`,
    allUsersOfOrganization: `${environment.apiUrl}/users/allUserOfOrganization`,
    getRoles: `${environment.apiUrl}/role/`,
    forgotPassword: `${environment.apiUrl}/users/forgotPassword/`,
    validateUser: `${environment.apiUrl}/validateCode/sendVerificationCode/`,
    verifyCode: `${environment.apiUrl}/validateCode/receiveVerificationCode/`,
    viewAllSites: `${environment.apiUrl}/api/sites/viewSites/`,
    addSite: `${environment.apiUrl}/api/sites/addSite/`
  };
  static apiMethod = {
    get: 'get',
    post: 'post',
    put: 'put',
    delete: 'delete'
  }
  static localStorageKeys = {
    token: 'sb_User_Token',
    entityUserData: 'sb_Entity_User_Data',
    theme: 'sb_Theme_Selected'
  };
  static toast = {
    location: "toast-top-left",
    time: 1500,
    time1: 3000
  };
  static config = {
    devMode: true,
    theme: {
      dark: "dark-theme",
      light: "light-theme",
      background: "body-bg",
      modalClass: "verify-modal",
      addSiteClass: "addsite-modal"
    }
  };
  static appTheme = {
    lightTheme: "light-theme",
    darkTheme: "dark-theme",
    oliveLight: "olive-green",
    darkForest: "dark-forest"
  };
  static appConstant = {
    email: "email",
    userName: "username",
    password: "password",
    firstName: "first_name",
    lastName: "last_name",
    mobileNo: "mobile_no",
    password1: "password1",
    password2: "password2",
    name: "name",
    type: "type",
    address: "address",
    city: "city",
    country: "country",
    zipCode: "zipCode",
    billingEmail: "billingEmail",
    accountNo: "accountNo",
    contactNo: "contactNo",
    fax: "fax",
    entityName: "entityName",
    headOffice: "headOffice",
    status: "status",
    joinCode: "joinCode",
    role: "role",
    code: "code"
  };
  static appIcons = {
    skipNext: "skip_next",
    group: "group",
    moveVert: "more_vert",
    contacts: "contacts",
    showChart: "show_chart",
    insertDriveFile: "insert_drive_file",
    changeHistory: "change_history",
    dataUsage: "data_usage",
    cropDin: "crop_din",
    panoramaHorizontal: "panorama_horizontal",
    allInclusive: "all_inclusive",
    radioButtonUnchecked: "radio_button_unchecked",
    panoramaWideAngle: "panorama_wide_angle",
    myLocation: "my_location",
    share: "share",
    waves: "waves",
    gpsNotFixed: "gps_not_fixed",
    scatterPlot: "scatter_plot",
    details: "details",
    texture: "texture",
    arrowBack: "arrow_back",
    arrowForward: "arrow_forward",
    bookmarkBorder: "bookmark_border",
    check: "check",
    lineStyle: "line_style",
    domain: "domain",
    person: "person",
    supervisedUserCircle: "supervised_user_circle",
    dashboard: "dashboard",
    search: "search",
    add: "add",
    notificationImportant: "notification_important",
    help: "help",
    settings: "settings",
    menu: "menu",
    close: "close",
    arrowDropDown: "arrow_drop_down",
    workOff: "work_off",
    style: "style",
    localActivity: "local_activity",
    questionAnswer: "question_answer",
    save: "save",
    note: "note",
    createEntity: "playlist_add",
    joinEntity: "playlist_add_check",
    fingerPrint: "fingerprint",
    folderShared: "folder_shared",
    groupAdd: "group_add",
    payment: "payment",
    exit_to_app: "exitToApp",
    edit: "edit",
    viewSite: "remove_red_eye",
    siteQuestionCenter: "question_answer",
    log: "library_books"
  };
  static particlesIcons = [
    'more_vert',
    'data_usage',
    'change_history',
    'crop_din',
    'panorama_horizontal',
    'texture',
    'all_inclusive',
    'radio_button_unchecked',
    'panorama_wide_angle',
    'my_location',
    'share',
    'waves',
    'gps_not_fixed',
    'scatter_plot',
    'details',
    'drag_indicator',
    'av_timer',
    'filter_list',
    'wifi_tethering',
    'blur_on'
  ]
  static status = {
    CUSTOM: "custom",
    DEFAULT: "default",
    INFO: "info",
    SUCCESS: "success",
    WARNING: "warning",
    ERROR: "error"
  }
}
