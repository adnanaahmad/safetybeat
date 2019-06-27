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
    viewAllEntitiesOfUser: `${environment.apiUrl}/entity/viewAllEntitiesOfUser/`,
    joinEntity: `${environment.apiUrl}/entity/joinEntity/`,
    allUsersOfOrganization: `${environment.apiUrl}/users/allUserOfOrganization/`,
    getRoles: `${environment.apiUrl}/role/`,
    forgotPassword: `${environment.apiUrl}/users/forgotPassword/`,
    profilePic: `${environment.apiUrl}/users/uploadProfileImage/`,
    validateUser: `${environment.apiUrl}/validateCode/sendVerificationCode/`,
    verifyCode: `${environment.apiUrl}/validateCode/receiveVerificationCode/`,
    inviteTeam: `${environment.apiUrl}/entity/iniviteUserToEntity/`,
    viewAllSites: `${environment.apiUrl}/api/sites/viewSites/`,
    addSite: `${environment.apiUrl}/api/sites/addSite/`,
    logout: `${environment.apiUrl}/rest-auth/logout/`,
    packageInfo: `${environment.apiUrl}/packages/packageDetail/`,
    updatePackage: `${environment.apiUrl}/packages/updatePackage/`,
    importSite: `${environment.apiUrl}/api/uploadFile/importSite/`,
    getOrganization: `${environment.apiUrl}/organization/getOrganizationInfo`,
    editOrganization: `${environment.apiUrl}/organization`,
    entitiesUsers: `${environment.apiUrl}/entity/allUserOfEntity/`,
    deactivateUser: `${environment.apiUrl}/users/deactivateUser/`,
    activateUser: `${environment.apiUrl}/users/activateUser/`,
    viewSiteInfo: `${environment.apiUrl}/api/sites/`,
    connectionAdding: `${environment.apiUrl}/api/connections/`,
    connectionConfirm: `${environment.apiUrl}/api/connections/confirmConnection/`,
    viewHazardInfo: `${environment.apiUrl}/api/hazard/`,
    riskList: `${environment.apiUrl}/api/riskType/`,
    allHazards: `${environment.apiUrl}/api/hazard/viewAllHazards/`,
    removeConnection: `${environment.apiUrl}/api/connections/removeConnection/`,
    getQuestionTypes: `${environment.apiUrl}/api/questionTypes/`,
    addQuestion: `${environment.apiUrl}/api/questions/`,
    getAllQuestions: `${environment.apiUrl}/api/questions/viewAllQuestions/`,
    viewAllConnections: `${environment.apiUrl}/api/connections/viewAllConnections/`,
    getAllDocuments: `${environment.apiUrl}/api/documents/viewAllDocuments/`,
    getRootDocuments: `${environment.apiUrl}/api/documents/rootFolderDocuments/`,
    documents: `${environment.apiUrl}/api/documents/`,
    getFolders: `${environment.apiUrl}/api/folders/folderList/`,
    createFolder: `${environment.apiUrl}/api/folders/`,
    actionsReport: `${environment.apiUrl}/api/analyticsReport/actionsReport/`,
    actionsReportForUser: `${environment.apiUrl}/api/analyticsReport/actionsReportForUser/`,
    recentActivities: `${environment.apiUrl}/api/siteCheckIns/recentActivitiesOfUser/`,
    deleteDoc: `${environment.apiUrl}/api/documents/`,
    team: `${environment.apiUrl}/api/teams/`,
    viewAllTeams: `${environment.apiUrl}/api/teams/viewAllTeams/`,
    parentChildQuestions: `${environment.apiUrl}/api/parentChildQuestion/`,
    viewAllEntityQuestions: `${environment.apiUrl}/api/parentChildQuestion/viewAllEntityQuestions/`,

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
    codeValidations: [100, 101, 102, 103, 104, 105],
    dateJoined: 'dateJoined',
    phoneNo: 'phoneNo',
    avatar: './assets/images/avatar.png',
    questionDescription: 'questionDescription',
    questionWarning: 'questionWarning',
    questionType: 'questionType',
    safeQuestionYes: 'Y',
    safeQuestionNo: 'N',
    safeQuestionBoth: 'B',
    canProceedQuestionYes: 'Yes',
    canProceedQuestionNo: 'No',
    parentYes: 'Yes',
    parentNo: 'No',
    safeQuestion: 'safeQuestion',
    canProceed: 'canProceed',
    parent: 'parent',
    dateFrom: 'dateFrom',
    dateTo: 'dateTo',
    site: 'site',
    Root: 'root',
    paths: {
      home: '/home',
      profile: '/home/profile',
      login: '/login',
      package: '/package',
      welcomeScreen: '/welcomeScreen',
      viewSite: '/home/adminControl/siteCenter/viewSite'
    },
    roles: {
      owner: 'Owner',
      teamLead: 'TeamLead',
      entityManager: 'EntityManager',
      siteSafetyManager: 'SiteSafetyManager'
    },
    questionTypeValues: {
      openEnded: 'OpenEnded',
      closeEnded: 'CloseEnded'
    },
    connections: {
      view: 'view',
      add: 'add',
      remove: 'remove',
      confirm: 'confirm',
      nature: 'Outgoing'
    },
    enterKey: 13,
    importSite: 'importSite',
    csvFile: 'csvFile',
    profileImage: 'profileImage',
    noHazard: './assets/images/no-hazard.png',
    title: 'title',
    teamLead: 'teamLead',
    team: 'team',
    childYes: 'childYes',
    childNo: 'childNo'
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
    view: 'remove_red_eye',
    siteQuestionCenter: 'question_answer',
    log: 'library_books',
    import: 'play_for_work',
    deleteSweep: 'delete_sweep',
    arrowRight: 'keyboard_arrow_right',
    arrowLeft: 'keyboard_arrow_left',
    warning: 'warning',
    permIdentity: 'perm_identity',
    clear: 'clear',
    security: 'security',
    place: 'place',
    check_circle: 'check_circle',
    schedule: 'schedule',
    description: 'description',
    email: 'email',
    vpnKey: 'vpn_key',
    deleteForever: 'delete_forever',
    lock: 'lock',
    powerSettings: 'power_settings_new',
    keyboardArrowDown: 'keyboard_arrow_down',
    business: 'business',
    screenLock: 'screen_lock_portrait',
    permSettings: 'perm_data_setting',
    themeSettings: 'brightness_medium',
    clock: 'access_time',
    cloudDownload: 'cloud_download',
    folder: 'folder',
    cloudUpload: 'cloud_upload',
    createFolder: 'create_new_folder',
    phone: 'phone',
    activities: 'tab_unselected',
    connections: 'linear_scale'
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
    gestureHandling: 'none',
    zoomControl: false
  };
}
