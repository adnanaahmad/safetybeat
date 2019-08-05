import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {ProfileService} from 'src/app/features/profile/services/profile.service';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {LoginRegistrationService} from 'src/app/features/loginRegistration/services/LoginRegistrationService';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {ActivityFilterData, ProfileModel} from 'src/app/models/profile/profile.model';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {ActivatedRoute} from '@angular/router';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import {SiteMapComponent} from 'src/app/features/adminControl/modules/siteCenter/dialogs/siteMap/siteMap.component';
import {ConfirmationModalComponent} from 'src/app/dialogs/conformationModal/confirmationModal.component';
import {FormBuilder, Validators} from '@angular/forms';
import {PaginationData, Site} from 'src/app/models/site.model';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {AddleavesComponent} from 'src/app/features/profile/dialogs/addLeaves/addleaves.component';
import {LeaveinfoComponent} from 'src/app/features/profile/dialogs/leaveinfo/leaveinfo.component';
import {Leaveinfodata} from 'src/app/models/profile.model';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  profileModel: ProfileModel = <ProfileModel>{};
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  activitiesColumn: string[] = ['name', 'checkIn', 'checkOut', 'duration'];
  connectionsColumns: string[];
  refresh: Subject<any> = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  profileFeatures = {
    activities: true,
    connections: false,
    leaves: false,
    entities: false,
    myTeam: false
  };
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return [
          {title: 'links', cols: 3, rows: 3},
          {title: 'userData', cols: 3, rows: 3},
          {title: 'accountInfo', cols: 3, rows: 3}
        ];
      } else {
        return [
          {title: 'links', cols: 1, rows: 1},
          {title: 'userData', cols: 2, rows: 2},
          {title: 'accountInfo', cols: 1, rows: 1}
        ];
      }
    })
  );
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean;
  title: any;
  data: any;
  events: any;

  constructor(
    private profile: ProfileService,
    private route: ActivatedRoute,
    private loginService: LoginRegistrationService,
    public helperService: HelperService,
    private compiler: CompilerProvider,
    private navService: NavigationService,
    public profileService: ProfileService,
    public adminService: AdminControlService,
    private breakpointObserver: BreakpointObserver,
    public memberService: MemberCenterService,
    private formBuilder: FormBuilder
  ) {
    this.initialize();
    this.route.params.subscribe((data) => {
      if (!helperService.isEmpty(data)) {
        this.profileModel.receivedData = JSON.parse(data.data);
        this.profileModel.role = this.profileModel.receivedData.accessLevel;
        this.profileModel.userId = this.profileModel.receivedData.id;
        this.profileModel.currentUserProfile = false;
        this.getUserConnections(this.profileModel.receivedData.id);
      } else {
        this.profileModel.subscription = this.navService.selectedEntityData.subscribe((res) => {
          if (res !== 1) {
            this.profileModel.role = res.role;
            this.profileModel.entityName = res.entityInfo.name;
            this.profileModel.currentUserProfile = true;
          }
        });
        this.getCurrentUser();
        this.getFilters();
      }
    });
  }

  /**
   * this function is called when this component initialize and in this function we have subscribed
   * to the behavior subject of the profile data.
   */
  ngOnInit() {
    this.profileModel.subscription = this.navService.currentUserData.subscribe((res) => {
      if (res !== 1) {
        if (this.profileModel.currentUserProfile) {
          this.connectionsColumns = ['img', 'name', 'email', 'contact', 'remove_connection'];
          this.profileModel.profileData = res;
          this.profileModel.contactNo = this.profileModel.profileData.contactNo;
          this.profileModel.name = this.profileModel.profileData.first_name + ' ' + this.profileModel.profileData.last_name;
          this.profileModel.username = this.profileModel.profileData.username;
          this.profileModel.email = this.profileModel.profileData.email;
          this.profileModel.profileImage = this.profileModel.profileData.profileImage;
          this.profileModel.userId = this.profileModel.profileData.id;
          this.userLeaves(this.profileModel.userId);
          this.getUserConnections(this.profileModel.userId);
        } else {
          this.connectionsColumns = ['img', 'name', 'email', 'contact'];
          this.profileModel.contactNo = this.profileModel.receivedData.contact;
          this.profileModel.profileData = this.profileModel.receivedData;
          this.profileModel.name = this.profileModel.receivedData.name;
          this.profileModel.email = this.profileModel.receivedData.email;
          this.profileModel.profileImage = this.profileModel.profileData.profileImage;
          this.userLeaves(this.profileModel.profileData.id);
        }
      } else {
        this.getCurrentUser();
      }
    });

    this.getFilters();
    this.profileModel.filterForm = this.formBuilder.group({
      filter: [''],
      dateTo: ['', Validators.required],
      dateFrom: ['', Validators.required]
    });
    this.getLeaveTypes();
  }

  ngAfterViewInit() {
    this.profileModel.dataSource.paginator = this.paginator;
  }


  initialize() {
    this.profileModel.refresh = new Subject<any>();
    this.profileModel.userLeavesData = [];
    this.profileModel.firstIndex = 0;
    this.profileModel.pageSize = 7;
    this.profileModel.entityCount = 0;
    this.profileModel.connectionCount = 0;
    this.profileModel.noTeam = false;
    this.profileModel.translated = this.helperService.translated;
    this.profileModel.appIcons = this.helperService.constants.appIcons;
    this.profileModel.appConstants = this.helperService.constants.appConstant;
    this.profileModel.currentUserProfile = true;
    this.profileModel.disabled = false;
    this.profileModel.noActivity = false;
    this.profileModel.noConnection = false;
    this.profileModel.displayedColumns = [
      'name',
      'headOffice',
      'role',
      'administrator'
    ];
  }

  /**
   * this function will be overrided that's why we have keep this here
   * @params date
   * @params events
   */
  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    this.profileModel.userLeavesData = [];
    if (events.length !== 0) {
      let self = this;
      self.helperService.iterations(events, function (obj) {
        let data: Leaveinfodata = {
          actions: obj.actions,
          end: new Date(obj.end).toDateString(),
          start: new Date(obj.start).toDateString(),
          title: obj.title
        };
        self.profileModel.userLeavesData.push(data);
      });
      this.helperService.createDialog(LeaveinfoComponent, {data: this.profileModel.userLeavesData});
    }
  }

  /**
   * this function is used for opening the dialog when we click on the date from calendar.
   */
  selectDate() {
    const dateSelected = this.viewDate;
  }

  /**
   * this function is used to set view like weekly,monthly or daily
   * @params view
   */
  setView(view: CalendarView) {
    this.view = view;
  }

  /**
   * this fucntion will also be overrided
   */

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }


  onChangeFeatures(feature: any) {
    let self = this;
    this.helperService.iterations(this.profileFeatures, function (value, key) {
      if (key === feature) {
        self.profileFeatures[key] = true;
      } else {
        self.profileFeatures[key] = false;
      }
    });
  }


  /**
   * this function is used for hiding all the debugging messages and also used for unsubscribing the
   * observables.
   */

  ngOnDestroy() {
    this.helperService.hideLoggers();
    this.profileModel.subscription.unsubscribe();
  }

  get filterFormValidations() {
    return this.profileModel.filterForm.controls;
  }

  /**
   * this function is used to read the image file on selection from the pc storage.
   * @params event
   */

  uploadProfileImage(event) {
    this.profileModel.imageFile = <File>event.target.files[0];
    let blob = new Blob([this.profileModel.imageFile], {type: 'image/*'});
    let formData = new FormData();
    formData.append('profileImage', blob, this.profileModel.imageFile.name);
    this.profileService.profilePicUpdate(formData).subscribe((res) => {
      let userData = this.compiler.constructProfileData(res.data);
      this.navService.updateCurrentUser(userData);
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.PIC_UPLOADED_SUCCESS,
          this.helperService.constants.status.SUCCESS);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.helperService.createSnack(
          this.helperService.translated.MESSAGES.PIC_UPLOADED_FAILURE, this.helperService.constants.status.ERROR);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[1]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.PIC_EXCEEDS_LIMIT,
          this.helperService.constants.status.WARNING);

      }
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  /**
   * this function is used for getting the data for current user to show on the profile page.
   */

  getCurrentUser() {
    this.profile.getUser().subscribe((res) => {
      this.profileModel.dataRecieved = res;
      let userData = this.compiler.constructProfileData(this.profileModel.dataRecieved.data.user);
      this.navService.updateCurrentUser(userData);
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  viewActivities(filters, paginationData) {
    let data: ActivityFilterData = {
      days: filters.value.filter,
      dateTo: filters.value.dateTo,
      dateFrom: filters.value.dateFrom,
      userId: this.profileModel.userId
    };
    let pagination: PaginationData = {
      offset: paginationData * this.helperService.appConstants.paginationLimitForProfile,
      limit: this.helperService.appConstants.paginationLimitForProfile
    };
    this.profile.viewRecentActivities(data, pagination).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        if (res.data.recentActivities.length === 0) {
          this.profileModel.recentActivities = null;
        } else {
          this.profileModel.pageCount = res.data.pageCount;
          this.profileModel.activitiesCount = res.data.recentActivities.length;
          this.profileModel.recentActivities = this.compiler.constructRecentActivitiesData(res.data);
          this.profileModel.dataSource = new MatTableDataSource(this.profileModel.recentActivities);
        }
      } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.profileModel.recentActivities = null;
      } else {
        this.profileModel.recentActivities = null;
      }
    }, (error) => {
      this.profileModel.recentActivities = null;
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  filteredReport(value: number) {
    if (value !== -1) {
      this.filterFormValidations[this.helperService.appConstants.dateFrom].disable();
      this.filterFormValidations[this.helperService.appConstants.dateTo].disable();
    } else {
      this.filterFormValidations[this.helperService.appConstants.dateFrom].enable();
      this.filterFormValidations[this.helperService.appConstants.dateTo].enable();
    }
  }

  getUserConnections(userId: number) {
    this.profileModel.allConnectionsData = [];
    this.adminService.allConnections({userId: userId}).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.profileModel.connectionCount = res.data.length;
        this.profileModel.allConnectionsRes = res;
        this.profileModel.allConnectionsData = this.compiler.constructAllConnectionData(res);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.profileModel.noConnection = true;
      } else {
        this.profileModel.noConnection = true;
        this.helperService.createSnack(
          this.helperService.translated.MESSAGES.GET_CONNECTIONS_FAILURE, this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  removeConnection(sentToUserId: number) {
    this.profileModel.connectionCount = 0;
    this.helperService.createDialog(ConfirmationModalComponent,
      {data: {message: this.helperService.translated.CONFIRMATION.REMOVE_CONNECTION}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.memberService.removeConnection({receivedBy: sentToUserId}).subscribe((res) => {
          if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
            this.helperService.createSnack(this.helperService.translated.MESSAGES.REMOVE_CONNECTION_SUCCESS,
              this.helperService.constants.status.SUCCESS);
            this.getUserConnections(this.profileModel.userId);
          } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
            this.helperService.createSnack(this.helperService.translated.MESSAGES.REMOVE_CONNECTION_FAILURE,
              res.responseDetails.message);
          }
        }, (error) => {
          this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
        });
      }
    });
  }

  viewSite(site: Site) {
    this.helperService.createDialog(SiteMapComponent, {disableClose: true, data: {siteData: site, type: true}});
  }

  getFilters() {
    this.profileService.filter().subscribe((res) => {
      if (res) {
        this.profileModel.filters = res;
        this.profileModel.selectedFilter = this.helperService.find(this.profileModel.filters, function (obj) {
          return obj.name === 'Lifetime';
        });
        this.filteredReport(this.profileModel.selectedFilter);
        this.filterFormValidations['filter'].setValue(this.profileModel.selectedFilter.days);
        this.viewActivities(this.profileModel.filterForm, this.profileModel.firstIndex);
      }
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  /**
   * this function is used to get all the leave types
   */
  getLeaveTypes() {
    this.profileService.getLeaveTypes().subscribe((res) => {
      if (res) {
        this.profileModel.leaveTypes = res;
      }
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  addLeaves() {
    this.helperService.createDialog(AddleavesComponent, {
      disableClose: true,
      data: this.profileModel.leaveTypes
    });
    this.helperService.dialogRef.afterClosed().subscribe((res) => {
      if (res !== this.helperService.appConstants.no) {
        this.userLeaves(this.profileModel.userId);
      }
    });
  }

  userLeaves(userId: number) {
    let data = {
      userId: userId,
      entityId: this.helperService.getEntityId()
    };
    this.profileService.viewAllUserLeaves(data).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.profileModel.leavesCount = res.data.userLeaves.length;
        this.profileModel.userLeaves = res.data.userLeaves;
        let self = this;
        self.profileModel.events = [];
        this.helperService.iterations(self.profileModel.userLeaves, function (leaveData) {
          self.profileModel.eventData = {
            start: new Date(leaveData.dateFrom),
            end: new Date(leaveData.dateTo),
            title: leaveData.description,
            allDay: true,
            actions: leaveData.requestedBy,
            resizable: {
              beforeStart: true,
              afterEnd: true
            },
            draggable: true,
            meta: {
              type: 'calendarEvent'
            }
          };
          self.profileModel.events.push(self.profileModel.eventData);
          self.refresh.next();
        });
      } else {
        this.profileModel.userLeaves = null;
      }
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }
}
