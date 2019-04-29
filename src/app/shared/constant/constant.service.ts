import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {
  constructor() {
  }

  /**
   * all the apiRoutes are declared here.
   */

  static apiRoutes = {
    login: `${environment.apiUrl}/login/`,
    signup: `${environment.apiUrl}/registration/`,
    companyTypes: `${environment.apiUrl}/companyTypes/`,
    modules: `${environment.apiUrl}/modules/`,
    packages: `${environment.apiUrl}/packages/`,
    passwordReset: `${environment.apiUrl}/users/resetPassword/`,
    organization: `${environment.apiUrl}/organization/`,
    user: `${environment.apiUrl}/users/viewUser/`,
    userInfo: `${environment.apiUrl}/users/`,
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
    inviteTeam: `${environment.apiUrl}/entity/iniviteUserToEntity/`,
    viewAllSites: `${environment.apiUrl}/api/sites/viewSites/`,
    addSite: `${environment.apiUrl}/api/sites/addSite/`,
    logout: `${environment.apiUrl}/rest-auth/logout/`,
    packageInfo: `${environment.apiUrl}/packages/packageDetail/`,
    importSite: `${environment.apiUrl}/api/uploadFile/importSite/`,
    getOrganization: `${environment.apiUrl}/organization/getOrganizationInfo`,
    editOrganization: `${environment.apiUrl}/organization`,
    entitiesUsers: `${environment.apiUrl}/entity/allUserOfEntity/`,
    deactivateUser: `${environment.apiUrl}/users/deactivateUser/`,
    activateUser: `${environment.apiUrl}/users/activateUser/`,
    viewSiteInfo: `${environment.apiUrl}/api/sites/`
  };
  /**
   * all the api methods are declared here.
   */
  static apiMethod = {
    get: 'get',
    post: 'post',
    put: 'put',
    delete: 'delete'
  };
  /**
   * all the storage keys are declared here.
   */
  static localStorageKeys = {
    token: 'sb_User_Token',
    entityUserData: 'sb_Entity_User_Data',
    theme: 'sb_Theme_Selected',
    packageInfo: 'sb_Package_Info',
    role: 'sb_role',
    entityId: 'sb_entityId',
  };
  /**
   * settings for the toaster is declared here.
   */
  static toast = {
    location: 'toast-top-left',
    time: 1500,
    time1: 3000
  };
  /**
   * theme configuration is declared here.
   */
  static config = {
    devMode: true,
    theme: {
      dark: 'dark-theme',
      light: 'light-theme',
      background: 'body-bg',
      modalClass: 'verify-modal',
      addSiteClass: 'addsite-modal'
    }
  };
  /**
   * all the themes are declared here.
   */

  static appTheme = {
    lightTheme: 'light-theme',
    darkTheme: 'dark-theme',
    oliveLight: 'olive-green',
    darkForest: 'dark-forest'
  };
  /**
   * all the constants are declared here.
   */
  static appConstant = {
    moduleName: 'Safetybeat',
    key: 'AIzaSyBnOzbMr90FUKJOFHDErlHbX1WGIkBLYPE',
    email: 'email',
    userName: 'username',
    password: 'password',
    firstName: 'first_name',
    lastName: 'last_name',
    countryCode: 'countryCode',
    password1: 'password1',
    password2: 'password2',
    currentPassword: 'currentPassword',
    name: 'name',
    type: 'type',
    address: 'address',
    city: 'city',
    country: 'country',
    zipCode: 'zipCode',
    billingEmail: 'billingEmail',
    accountNo: 'accountNo',
    contactNo: 'contactNo',
    fax: 'fax',
    entityName: 'entityName',
    headOffice: 'headOffice',
    status: 'status',
    joinCode: 'joinCode',
    role: 'role',
    sites: 'sites',
    entities: 'entities',
    code: 'code',
    managedBy: 'managedBy',
    siteName: 'siteName',
    siteSafetyPlan: 'siteSafetyPlan',
    siteAddress: 'siteAddress',
    safeZone: 'safeZone',
    siteSafetyManager: 'siteSafetyManager',
    linearForm: true,
    emailValid: 'VALID',
    yes: 'YES',
    codeValidations: [100, 101, 102, 103, 104],
    dateJoined: 'dateJoined',
    phoneNo: 'phoneNo',
    avatar: './assets/images/avatar.png',
    paths: {
      home: '/home',
      login: '/login',
      package: '/package',
      welcomeScreen: '/welcomeScreen',
      viewSite: '/home/adminControl/siteCenter/viewSite',
    },
    roles: {
      owner: 'Owner',
      teamLead: 'TeamLead',
      entityManager: 'EntityManager',
      siteSafetyManager: 'SiteSafetyManager'
    },
    connections: {
      view: 'view',
      add: 'add',
      remove: 'remove'
    },
    enterKey: 13,
    importSite: 'importSite',
    csvFile: 'csvFile'
  };
  /**
   * all the material icon names are declared here.
   */
  static appIcons = {
    skipNext: 'skip_next',
    group: 'group',
    moveVert: 'more_vert',
    contacts: 'contacts',
    showChart: 'show_chart',
    insertDriveFile: 'insert_drive_file',
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
    note: 'note',
    createEntity: 'playlist_add',
    joinEntity: 'playlist_add_check',
    fingerPrint: 'fingerprint',
    folderShared: 'folder_shared',
    groupAdd: 'group_add',
    payment: 'payment',
    exit_to_app: 'exitToApp',
    edit: 'edit',
    viewSite: 'remove_red_eye',
    siteQuestionCenter: 'question_answer',
    log: 'library_books',
    import: 'play_for_work',
    deleteSweep: 'delete_sweep'
  };
  /**
   * all the particle container icon names are declared here.
   */
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
  ];
  /**
   * status of the snackbar and toaster are declared here.
   */
  static status = {
    CUSTOM: 'custom',
    DEFAULT: 'default',
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    OK: 'OK'
  };
  /**
   * default map configuration is declared here.
   */
  static defaultMapConfig = {
    zoom: 15,
    center: {lat: 33.738, lng: 73.084},
    zoomControl: true
  };
}
