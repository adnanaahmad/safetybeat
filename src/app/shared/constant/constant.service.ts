import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {
  constructor() { }

  static apiRoutes = {
    login: `${environment.apiUrl}/login/`,
    signup: `${environment.apiUrl}/registration/`,
    companyTypes: `${environment.apiUrl}/companyTypes/`,
    modules: `${environment.apiUrl}/modules/`,
    packages: `${environment.apiUrl}/packages/`,
    passwordReset: `${environment.apiUrl}/password/reset/`,
    organization: `${environment.apiUrl}/organization/`,
    user: `${environment.apiUrl}/users`,
    checkUsername: `${environment.apiUrl}/users/checkUsername/`,
    checkEmail: `${environment.apiUrl}/users/checkEmail/`,
    checkOrgName: `${environment.apiUrl}/organization/checkOrgName/`,
    checkBilling: `${environment.apiUrl}/organization/checkOrgEmail/`,
    resendverification: `${environment.apiUrl}/account/resend-verification/`,
    changeEmail: `${environment.apiUrl}/users/editEmail`,
    editProfile: `${environment.apiUrl}/users/editProfile`,
    changePassword: `${environment.apiUrl}/users/changePassword/`,
    getInvite: `${environment.apiUrl}/register/`,

    createEntity: `${environment.apiUrl}/entity/createEntity/`
  };
  static toast = {
    location: 'toast-top-left',
    time: 1500,
    time1: 3000
  };
  static config = {
    devMode: true,
    theme: {
      dark: 'dark-theme',
      light: 'light-theme',
      background: 'body-bg'
    }
  };
  static appTheme = {
    lightTheme: 'light-theme',
    darkTheme: 'dark-theme',
    oliveLight: 'olive-green',
    darkForest: 'dark-forest'
  };
  static appConstant = {
    email: 'email',
    userName: 'username',
    password: 'password',
    firstName: 'first_name',
    lastName: 'last_name',
    mobileNo: 'mobile_no',
    password1: 'password1',
    password2: 'password2',
    name: 'name',
    type: 'type',
    address: 'address',
    city: 'city',
    country: 'country',
    zipCode: 'zipCode',
    billingEmail: 'billingEmail',
    accountNo: 'accountNo',
    contactNo: 'contactNo',
    fax: 'fax'
  };
  static appIcons = {
    skipNext:'skip_next',
    group: 'group',
    moveVert: 'more_vert',
    contacts:'contacts',
    showChart:'show_chart',
    insertDriveFile:'insert_drive_file',
    changeHistory: 'change_history',
    dataUsage: 'data_usage',
    cropDin: 'crop_din',
    panoramaHorizontal: 'panorama_horizontal',
    allInclusive: 'all_inclusive',
    radioButtonUnchecked: 'radio_button_unchecked',
    panoramaWideAngle: 'panorama_wide_angle',
    myLocation: 'my_location',
    share: 'share',
    waves: 'waves',
    gpsNotFixed: 'gps_not_fixed',
    scatterPlot: 'scatter_plot',
    details: 'details',
    texture: 'texture',
    arrowBack: 'arrow_back',
    arrowForward: 'arrow_forward',
    bookmarkBorder: 'bookmark_border',
    check: 'check',
    lineStyle: 'line_style',
    domain: 'domain',
    person: 'person',
    supervisedUserCircle: 'supervised_user_circle',
    dashboard: 'dashboard',
    search: 'search',
    add: 'add',
    notificationImportant: 'notification_important',
    help: 'help',
    settings: 'settings',
    menu: 'menu',
    close: 'close',
    arrowDropDown: 'arrow_drop_down',
    workOff: 'work_off',
    style: 'style',
    localActivity: 'local_activity',
    questionAnswer: 'question_answer',
    save: 'save',
    note: 'note'
  };
}
