import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
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
import {PermissionsModel} from 'src/app/models/adminControl/permissions.model';
import {SubSink} from 'subsink';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, OnDestroy {
  profileModel: ProfileModel = <ProfileModel>{};
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  activitiesColumn: string[] = ['name', 'checkIn', 'checkOut', 'duration'];
  connectionsColumns: string[];
  excludeDays: number[] = [0, 6];
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
  private subs = new SubSink();
  rangeAt: any;

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
    this.subs.add(
      this.route.params.subscribe((data) => {
        if (!helperService.isEmpty(data)) {
          this.profileModel.receivedData = JSON.parse(data.data);
          this.profileModel.entityId = this.profileModel.receivedData.entityId;
          this.profileModel.role = this.profileModel.receivedData.accessLevel;
          this.profileModel.userId = this.profileModel.receivedData.id;
          this.profileModel.currentUserProfile = false;
          this.getUserConnections(this.profileModel.receivedData.id, this.profileModel.firstIndex);
          this.subs.add(
            this.navService.selectedEntityData.subscribe((res) => {
              if (res && res !== 1) {
                this.profileModel.entityId = res.entityInfo.id;
                let entityId = {
                  entityId: res.entityInfo.id
                };
                if (!this.profileModel.currentUserProfile) {
                  this.subs.add(
                    this.memberService.entityAllUsers(entityId).subscribe((res) => {
                      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
                        if (!(res.data.allUser.find(x => x.user.id === this.profileModel.userId))) {
                          this.removeActivities();
                          this.removeLeaves();
                          this.profileModel.role = 'none';
                        } else {
                          this.profileModel.role = this.profileModel.receivedData.accessLevel;
                          this.getFilters();
                          this.userLeaves(this.profileModel.profileData.id);
                        }
                      }
                    }, (error) => {
                      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG,
                        this.helperService.constants.status.ERROR);
                    }));
                }
              }
            }));
        } else {
          this.profileModel.currentUserProfile = true;
          this.getCurrentUser();
          this.getFilters();
        }
      }),
      this.navService.entityPermissions.subscribe((data: PermissionsModel) => {
        if (data) {
          this.profileModel.permissions = data;
        }
      }));
  }

  /**
   * this function is called when this component initialize and in this function we have subscribed
   * to the behavior subject of the profile data.
   */
  ngOnInit() {
    //this.profileModel.loading = true;
    this.subs.add(
      this.navService.currentUserData.subscribe((res) => {
        if (res !== 1) {
          if (this.profileModel.currentUserProfile) {
            this.connectionsColumns = ['img', 'name', 'email', 'contact', 'remove_connection'];
            this.profileModel.profileData = res;
            this.profileModel.contactNo = this.profileModel.profileData.contactNo;
            this.profileModel.name = this.profileModel.profileData.first_name + ' ' + this.profileModel.profileData.last_name;
            this.profileModel.username = this.profileModel.profileData.username;
            this.profileModel.email = this.profileModel.profileData.email;
            this.profileModel.profileImage = this.profileModel.profileData.thumbnail;
            this.profileModel.userId = this.profileModel.profileData.id;
            this.getUserConnections(this.profileModel.userId, this.profileModel.firstIndex);
            this.subs.add(
              this.navService.selectedEntityData.subscribe((res) => {
                if (res !== 1) {
                  this.profileModel.currentUserProfile = true;
                  this.profileModel.role = res.role;
                  this.profileModel.entityName = res.entityInfo.name;
                  this.profileModel.entityId = res.entityInfo.id;
                  this.userLeaves(this.profileModel.userId);
                }
              }));
          } else {
            this.connectionsColumns = ['img', 'name', 'email', 'contact'];
            this.profileModel.contactNo = this.profileModel.receivedData.contact;
            this.profileModel.profileData = this.profileModel.receivedData;
            this.profileModel.name = this.profileModel.receivedData.name;
            this.profileModel.email = this.profileModel.receivedData.email;
            this.profileModel.profileImage = this.profileModel.profileData.thumbnail;
            this.userLeaves(this.profileModel.profileData.id);
          }
        } else {
          this.getCurrentUser();
        }
      }));
    this.profileModel.filterForm = this.formBuilder.group({
      filter: [''],
      dateTo: ['', Validators.required],
      dateFrom: ['', Validators.required]
    });
    this.getLeaveTypes();
  }


  initialize() {
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
    //
    // this.profileModel.loading = false;
  }

  /**
   * this function will be overrided that's why we have keep this here
   * @params date
   * @params events
   */
  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }, isEdit?: boolean): void {
    this.profileModel.userLeavesData = [];
    if (events.length !== 0) {
      let self = this;
      self.helperService.iterations(events, function (obj) {
        let data: Leaveinfodata = {
          actions: obj.meta.requestedUserData,
          end: new Date(obj.end).toDateString(),
          start: new Date(obj.start).toDateString(),
          title: obj.title,
          leaveType: obj.meta.leavesType,
          leaveId: obj.meta.leaveId,
          approved: obj.meta.approved,
          rejected: obj.meta.rejected
        };
        self.profileModel.userLeavesData.push(data);
      });
      this.helperService.createDialog(LeaveinfoComponent, {disableClose: true, data: this.profileModel.userLeavesData});
      this.subs.add(
        this.helperService.dialogRef.afterClosed().subscribe(result => {
          if (this.profileModel.userLeavesData && !this.profileModel.userLeavesData[0].approved && result !== 'NO' && !result.delete) {
            this.editLeaveDate(result.leaveData);
          } else if (this.profileModel.userLeavesData && result.delete) {
            this.deleteLeaveDate(result.leaveData);
          }
        }));
    }
  }

  /**
   * this function will be delete leave
   * @params date
   * @params events
   */
  deleteLeaveDate(dataObj): void {
    this.helperService.createDialog(ConfirmationModalComponent,
      {data: {message: this.helperService.translated.CONFIRMATION.DELETE_LEAVE}});
    this.subs.add(
      this.helperService.dialogRef.afterClosed().subscribe(res => {
        if (res === this.helperService.appConstants.yes) {
          this.helperService.toggleLoader(true);
          this.subs.add(
            this.profileService.deleteLeave(dataObj.leaveId).subscribe((res) => {
              if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
                this.helperService.createSnack(this.helperService.translated.MESSAGES.REMOVE_LEAVE_SUCCESS,
                  this.helperService.constants.status.SUCCESS);
                this.userLeaves(this.profileModel.userId);
              } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
                this.helperService.createSnack(this.helperService.translated.MESSAGES.REMOVE_LEAVE_FAILURE,
                  res.responseDetails.message);
                this.userLeaves(this.profileModel.userId);
              }
            }, (error) => {
              this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
            }));
        }
      }));
  }


  /**
   * this function will edit leave
   * @params date
   * @params events
   */
  editLeaveDate(dataObj): void {
    this.helperService.createDialog(AddleavesComponent, {
      disableClose: true,
      data: {
        leaveTypes: this.profileModel.leaveTypes,
        currentData: dataObj
      }
    });
    this.subs.add(
      this.helperService.dialogRef.afterClosed().subscribe((res) => {
        if (res !== this.helperService.appConstants.no) {
          this.userLeaves(this.profileModel.userId);
        }
      }));
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
    this.subs.unsubscribe();
    // if (this.profileModel.subscription !== null && this.profileModel.subscription !== undefined) {
    //   this.profileModel.subscription.unsubscribe();
    // }
    //this.profileModel.selectedEntitySubscription.unsubscribe();
  }

  get filterFormValidations() {
    return this.profileModel.filterForm.controls;
  }

  /**
   * this function is used to read the image file on selection from the pc storage.
   * @params event
   */

  uploadProfileImage(event) {
    //this.profileModel.loading = true;
    this.profileModel.imageFile = <File>event.target.files[0];
    let blob = new Blob([this.profileModel.imageFile], {type: 'image/*'});
    let formData = new FormData();
    formData.append('profileImage', blob, this.profileModel.imageFile.name);
    this.subs.add(
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
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      }));
  }

  dateSelected(data, event) {
    this.rangeAt = event.value;
    this.filterFormValidations[this.helperService.appConstants.dateTo].enable();
  }

  /**
   * this function is used for getting the data for current user to show on the profile page.
   */

  getCurrentUser() {
    this.subs.add(
      this.profile.getUser().subscribe((res) => {
        this.profileModel.dataRecieved = res;
        let userData = this.compiler.constructProfileData(this.profileModel.dataRecieved.data.user);
        this.navService.updateCurrentUser(userData);
      }, (error) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      }));
  }

  viewActivities(filters, paginationData) {
    this.profileModel.loading = true;
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
    this.subs.add(
      this.profile.viewRecentActivities(data, pagination).subscribe((res) => {
        if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          if (res.data.recentActivities.length === 0) {
            this.profileModel.recentActivities = null;
            this.profileModel.dataSource = null;
            this.profileModel.loading = false;
            this.profileModel.activitiesCount = res.data.pageCount;
            this.paginator.pageIndex = paginationData;
          } else {
            this.profileModel.activitiesCount = res.data.pageCount;
            this.profileModel.recentActivities = this.compiler.constructRecentActivitiesData(res.data);
            this.profileModel.dataSource = new MatTableDataSource(this.profileModel.recentActivities);
            this.profileModel.loading = false;
            this.profileModel.activitiesCount = res.data.pageCount;
            this.paginator.pageIndex = paginationData;
          }
        } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.profileModel.recentActivities = null;
          this.profileModel.loading = false;
          this.profileModel.dataSource = null;
          this.profileModel.activitiesCount = res.data.pageCount;
          this.paginator.pageIndex = paginationData;
        } else {
          this.profileModel.recentActivities = null;
          this.profileModel.loading = false;
          this.profileModel.dataSource = null
          this.profileModel.activitiesCount = res.data.pageCount;
          this.paginator.pageIndex = paginationData;
        }
      }, (error) => {
        this.profileModel.recentActivities = null;
        this.profileModel.dataSource = null;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
        this.profileModel.loading = false;
      }));
  }

  filteredReport(value: number) {
    if (value !== -1) {
      this.filterFormValidations[this.helperService.appConstants.dateFrom].reset();
      this.filterFormValidations[this.helperService.appConstants.dateTo].reset();
      this.filterFormValidations[this.helperService.appConstants.dateFrom].disable();
      this.filterFormValidations[this.helperService.appConstants.dateTo].disable();
    } else {
      this.filterFormValidations[this.helperService.appConstants.dateFrom].enable();
      this.filterFormValidations[this.helperService.appConstants.dateTo].disable();
    }
  }

  getUserConnections(userId: number, paginationData) {
    //this.profileModel.loading = true;
    this.profileModel.allConnectionsData = [];
    let pagination: PaginationData = {
      offset: paginationData * this.helperService.appConstants.paginationLimitForProfile,
      limit: this.helperService.appConstants.paginationLimitForProfile
    };
    this.subs.add(
      this.adminService.allConnections({userId: userId}, pagination).subscribe((res) => {
        if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.profileModel.connectionCount = res.data.pageCount;
          this.profileModel.allConnectionsRes = res;
          this.profileModel.allConnectionsData = this.compiler.constructAllConnectionData(res);
          //this.profileModel.loading = false;
        } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.profileModel.noConnection = true;
          //this.profileModel.loading = false;
        } else {
          this.profileModel.noConnection = true;
          this.helperService.createSnack(
            this.helperService.translated.MESSAGES.GET_CONNECTIONS_FAILURE, this.helperService.constants.status.ERROR);
          //this.profileModel.loading = false;
        }
      }, (error) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
        //this.profileModel.loading = false;
      }));
  }

  removeConnection(sentToUserId: number) {
    this.profileModel.connectionCount = 0;
    this.helperService.createDialog(ConfirmationModalComponent,
      {data: {message: this.helperService.translated.CONFIRMATION.REMOVE_CONNECTION}});
    this.subs.add(
      this.helperService.dialogRef.afterClosed().subscribe(res => {
        if (res === this.helperService.appConstants.yes) {
          this.helperService.toggleLoader(true);
          this.subs.add(
            this.memberService.removeConnection({receivedBy: sentToUserId}).subscribe((res) => {
              if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
                this.helperService.createSnack(this.helperService.translated.MESSAGES.REMOVE_CONNECTION_SUCCESS,
                  this.helperService.constants.status.SUCCESS);
                this.getUserConnections(this.profileModel.userId, this.profileModel.firstIndex);
              } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
                this.helperService.createSnack(this.helperService.translated.MESSAGES.REMOVE_CONNECTION_FAILURE,
                  res.responseDetails.message);
              }
            }, (error) => {
              this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
            }));
        }
      }));
  }

  viewSite(site: Site) {
    this.helperService.createDialog(SiteMapComponent, {disableClose: true, data: {siteData: site, type: true}});
  }

  getFilters() {
    this.subs.add(
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
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      }));
  }

  /**
   * this function is used to get all the leave types
   */
  getLeaveTypes() {
    this.subs.add(
      this.profileService.getLeaveTypes().subscribe((res) => {
        if (res) {
          this.profileModel.leaveTypes = res;
        }
      }, (error) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      }));
  }

  addLeaves() {
    this.helperService.createDialog(AddleavesComponent, {
      disableClose: true,
      data: {
        leaveTypes: this.profileModel.leaveTypes,
        currentData: null
      }
    });
    this.subs.add(
      this.helperService.dialogRef.afterClosed().subscribe((res) => {
        if (res !== this.helperService.appConstants.no) {
          this.userLeaves(this.profileModel.userId);
        }
      }));
  }

  userLeaves(userId: number) {
    //this.profileModel.loading = true;
    let data = {
      userId: userId,
      entityId: this.profileModel.entityId
    };
    this.subs.add(
      this.profileService.viewAllUserLeaves(data).subscribe((res) => {
        if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.profileModel.leavesCount = res.data.length;
          this.profileModel.userLeaves = res.data;
          let self = this;
          self.profileModel.events = [];
          this.helperService.iterations(self.profileModel.userLeaves, function (leaveData) {
            self.profileModel.eventData = {
              start: new Date(leaveData.dateFrom),
              end: new Date(leaveData.dateTo),
              title: leaveData.description,
              allDay: true,
              resizable: {
                beforeStart: true,
                afterEnd: true
              },
              draggable: true,
              meta: {
                type: 'calendarEvent',
                leaveId: leaveData.id,
                approved: leaveData.approved,
                rejected: leaveData.rejected,
                leavesType: leaveData.leaveType,
                requestedUserData: leaveData.requestedBy
              }
            };
            self.profileModel.events.push(self.profileModel.eventData);
            self.refresh.next();
          });
          //this.profileModel.loading = false;
        } else {
          this.removeLeaves();
        }
      }, (error) => {
        //this.profileModel.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      }));
  }

  removeActivities() {
    this.profileModel.recentActivities = null;
    this.profileModel.activitiesCount = 0;
    this.profileModel.dataSource = new MatTableDataSource(this.profileModel.recentActivities);
  }

  removeLeaves() {
    this.profileModel.userLeaves = null;
    this.profileModel.leavesCount = 0;
    this.profileModel.events = [];
    this.profileModel.loading = false
  }

  onImageLoad() {
    this.profileModel.loading = false;
  }
}
