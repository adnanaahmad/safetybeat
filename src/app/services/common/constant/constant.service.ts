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
    createEntity: `${environment.apiUrl}/entity/`,
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
    addSite: `${environment.apiUrl}/api/sites/`,
    logout: `${environment.apiUrl}/rest-auth/logout/`,
    packageInfo: `${environment.apiUrl}/packages/packageDetail/`,
    updatePackage: `${environment.apiUrl}/packages/updatePackage/`,
    importSite: `${environment.apiUrl}/api/sites/importSite/`,
    getOrganization: `${environment.apiUrl}/organization/getOrganizationInfo`,
    editOrganization: `${environment.apiUrl}/organization`,
    entitiesUsers: `${environment.apiUrl}/entity/allUserOfEntity/`,
    allEntityUsers: `${environment.apiUrl}/entity/allEntityUsers/`,
    deactivateUser: `${environment.apiUrl}/users/deactivateUser/`,
    activateUser: `${environment.apiUrl}/users/activateUser/`,
    viewSiteInfo: `${environment.apiUrl}/api/sites/`,
    archiveSite: `${environment.apiUrl}/api/sites/archiveSite/`,
    connectionAdding: `${environment.apiUrl}/api/connections/`,
    connectionConfirm: `${environment.apiUrl}/api/connections/confirmConnection/`,
    viewHazardInfo: `${environment.apiUrl}/api/hazard/`,
    archiveHazard: `${environment.apiUrl}/api/hazard/archiveHazard/`,
    riskList: `${environment.apiUrl}/api/riskType/`,
    allHazards: `${environment.apiUrl}/api/hazard/viewAllHazardsOfEntity/`,
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
    checkinByActivityReport: `${environment.apiUrl}/api/analyticsReport/checkInByActivityReport/`,
    pulseByEntity: `${environment.apiUrl}/api/analyticsReport/pulseReportByEntity/`,
    hazardReport: `${environment.apiUrl}/api/analyticsReport/hazardReport/`,
    siteActivityReport: `${environment.apiUrl}/api/analyticsReport/siteActivityReport/`,
    recentActivities: `${environment.apiUrl}/api/siteCheckIns/recentActivitiesOfUser/`,
    averageDailyActionsReport: `${environment.apiUrl}/api/analyticsReport/averageDailyActionsReport/`,
    deleteDoc: `${environment.apiUrl}/api/documents/`,
    team: `${environment.apiUrl}/api/teams/`,
    viewAllTeams: `${environment.apiUrl}/api/teams/viewAllTeams/`,
    parentChildQuestions: `${environment.apiUrl}/api/parentChildQuestion/`,
    allEntityQuestions: `${environment.apiUrl}/api/parentChildQuestion/viewAllEntityQuestions/`,
    sendSiteCode: `${environment.apiUrl}/api/sites/sendSiteCode/`,
    refreshSiteCode: `${environment.apiUrl}/api/sites/refreshSiteCode/`,
    refreshEntityCode: `${environment.apiUrl}/entity/refreshEntityCode/`,
    userPermissions: `${environment.apiUrl}/permissions/`,
    filters: `${environment.apiUrl}/api/filters/`,
    requests: `${environment.apiUrl}/api/connections/connectionRequests/`,
    directMessages: `${environment.apiUrl}/api/notification/`,
    leaveTypes: `${environment.apiUrl}/api/leaveTypes/`,
    addLeave: `${environment.apiUrl}/api/leaves/`,
    userLeaves: `${environment.apiUrl}/api/leaves/viewAllUserLeaves/`,
    allUserLeaves: `${environment.apiUrl}/api/leaves/allUserLeaves/`,
    saveFirebaseToken: `${environment.apiUrl}/users/saveFirebaseToken/`,
    updateProfile: `${environment.apiUrl}/users/updateProfile/`,
    checkInType: `${environment.apiUrl}/api/checkInType/`,
    checkInTypeEntity: `${environment.apiUrl}/api/checkInTypeEntity/`,
    getCheckInTypes: `${environment.apiUrl}/api/checkInType/getCheckInTypes/`
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
    user: 'user',
    spinnerConstant: 50,
    spinnerConstantModal: 30,
    leaveType: 'leaveType',
    entity: 'entity',
    paginationLimitForProfile: 7,
    paginationLimit: 10,
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
    radius: 'radius',
    siteSafetyPlan: 'siteSafetyPlan',
    siteAddress: 'siteAddress',
    safeZone: 'safeZone',
    gpsTrack: 'gpsTrackEnabled',
    siteSafetyManager: 'siteSafetyManager',
    linearForm: true,
    emailValid: 'VALID',
    yes: 'YES',
    no: 'NO',
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
    input: 'input',
    dateFrom: 'dateFrom',
    dateTo: 'dateTo',
    filter: 'filter',
    range: 'range',
    allUsers: 'allUsers',
    allSites: 'allSites',
    allTeams: 'allTeams',
    noSite: 'noSite',
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
    permissions: [{
      name: 'Entity Control',
      key: 'entityControl',
      values: [{key: 'createEntity', value: 'Create Entity'}, {key: 'viewEntity', value: 'View Entity'},
        {key: 'deleteEntity', value: 'Delete Entity'}, {key: 'joinEntity', value: 'Join Entity'},
        {key: 'inviteMember', value: 'Invite Member'}, {key: 'viewEntityCode', value: 'View Entity Code'},
        {key: 'refreshEntityCode', value: 'Refresh Entity Code'}]
    },
      {
        name: 'Site Centre',
        key: 'siteCentre',
        values: [{key: 'ImportSite', value: 'Import Site'}, {key: 'viewSite', value: 'View Site'},
          {key: 'editSite', value: 'Edit Site'}, {key: 'deleteSite', value: 'Delete Site'},
          {key: 'addSite', value: 'Add Site'}, {key: 'refreshSiteCode', value: 'Refresh Site Code'},
          {key: 'viewSiteCode', value: 'View Site Code'}, {key: 'shareSiteCode', value: 'Share Site Code'},
          {key: 'refreshSiteCode', value: 'Refresh Site Code'}]
      },

      {
        name: 'Hazard Centre',
        key: 'hazardCentre',
        values: [{key: 'addHazard', value: 'Add Hazard'}, {key: 'editHazard', value: 'Edit Hazard'},
          {key: 'deleteHazard', value: 'Delete Hazard'}, {key: 'viewHazard', value: 'View Hazard'}]
      },
      {
        name: 'Documents',
        key: 'documents',
        values: [{key: 'deleteDocument', value: 'Delete Document'}, {key: 'uploadDocument', value: 'Upload Document'},
          {key: 'downloadDocument', value: 'Download Document'}, {key: 'createFolder', value: 'Create Folder'},
          {key: 'deleteFolder', value: 'Delete Folder'}, {key: 'renameFolder', value: 'Rename Folder'}]
      },
      {
        name: 'My Team',
        key: 'myTeam',
        values: [{key: 'registerTeam', value: 'Register Team'}, {key: 'editTeam', value: 'Edit Team'},
          {key: 'deleteTeam', value: 'Delete Team'}, {key: 'viewTeam', value: 'View Team'}]
      },
      {
        name: 'MemberCentre',
        key: 'memberCentre',
        values: [{key: 'changeAccessLevel', value: 'Change Access Level'}, {key: 'viewUserProfile', value: 'View User Profile'},
          {key: 'inviteUser', value: 'Invite User'}, {key: 'deactivateUser', value: 'Deactivate User'}]
      },
      {
        name: 'Manage Leaves',
        key: 'manageLeaves',
        values: [{key: 'approveLeaves', value: 'Approve Leaves'},
          {key: 'viewLeaves', value: 'View Leaves'}]
      },
      {
        name: 'Profile',
        key: 'viewProfile',
        values: [{key: 'addLeaves', value: 'Add Leaves'}, {key: 'deleteLeaves', value: 'Delete Leaves'},
           {key: 'editLeaves', value: 'Edit Leaves'}]
      },
      {
        name: 'Question Centre',
        key: 'questionCentre',
        values: [{key: 'addQuestion', value: 'Add Question'}, {key: 'createQuestion', value: 'Create Question'},
          {key: 'deleteQuestion', value: 'Delete Question'}, {key: 'editQuestion', value: 'Edit Question'}]
      }],
    reports: 'analyticsReports',
    reportsPermissions: [{key: 'actionReport', value: 'Action Report'}, {key: 'actionsVsAlerts', value: 'Action Vs Alerts'},
      {key: 'averageDailyReport', value: 'Average Daily Actions'}, {
        key: 'checkinAndAlertByPerson',
        value: 'Check-In And Alert By Person'
      },
      {key: 'checkinByActivity', value: 'Check-In By Activity'},
      {key: 'compliantCheckOut', value: 'Compliant Check-Out'}, {key: 'pulseReportByEntity', value: 'Pulse Report By Entity'},
      {key: 'pulseReportByPerson', value: 'Pulse Report By Person'}, {key: 'siteActivityReport', value: 'Site Activity Report'},
      {key: 'hazardReports', value: 'Hazard Reports'}],
    rolesData: [{key: 'User', value: 'User'}, {key: 'Owner', value: 'Owner'},
      {key: 'TeamLead', value: 'Team Lead'}, {key: 'EntityManager', value: 'Entity Manager'},
      {key: 'SiteSafetyManager', value: 'Site Safety Manager'}, {key: 'SubContractor', value: 'Sub Contractor'}],
    enterKey: 13,
    importSite: 'importSite',
    csvFile: 'csvFile',
    profileImage: 'profileImage',
    noHazard: './assets/images/no-hazard.png',
    title: 'title',
    teamLead: 'teamLead',
    team: 'team',
    childYes: 'childYes',
    childNo: 'childNo',
    childYesSafe: 'childYesSafe',
    childNoSafe: 'childNoSafe'
  };
  /**
   * all the material icon names are declared here.
   */
  static appIcons = {
    manageLeaves: 'calendar_today',
    refresh: 'refresh',
    showReports: 'bar_chart',
    skipNext: 'skip_next',
    group: 'group',
    moveVert: 'more_vert',
    contacts: 'contacts',
    showChart: 'show_chart',
    insertDriveFile: 'insert_drive_file',
    date: 'date_range',
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
    connections: 'linear_scale',
    userCircled: 'account_circle',
    teamLead: 'stars',
    Launch: 'launch',
    themeSwitcher: 'color_lens',
    error: 'error',
    archived: 'archive',
    undo: 'undo'
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
  /**
   * dictionary is used because component path's name and permission keys for components are not the same
   */
  static componentPermission = {
    actionAlertsReport: 'actionsVsAlerts',
    actionReport: 'actionReport',
    alertsPersonReport: '',
    averageDailyActionsReport: 'averageDailyReport',
    checkInActivityReport: 'checkinByActivity',
    compliantCheckoutReport: 'compliantCheckOut',
    entityPulseReport: 'pulseReportByEntity',
    hazardReport: 'hazardReports',
    siteActivityReport: 'siteActivityReport',
    dashboard: 'dashboard',
    analyticsReport: 'analyticsReports',
    myTeam: 'myTeam',
    documents: 'documents',
    questionCenter: 'questionCentre',
    permissionCenter: 'permissionCentre',
    memberCenter: 'memberCentre',
    hazardCenter: 'hazardCentre',
    siteCenter: 'siteCentre',
    manageLeaves: 'manageLeaves',
    entityControl: 'entityControl',
    settings: 'settings',
  }
}
