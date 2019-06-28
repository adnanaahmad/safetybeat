import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { ProfileService } from 'src/app/pages/profile/services/profile.service';
import { HelperService } from 'src/app/shared/helperService/helper.service';
import { LoginRegistrationService } from 'src/app/pages/loginRegistration/services/LoginRegistrationService';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ProfileModel } from 'src/app/models/profile/profile.model';
import { NavigationService } from 'src/app/pages/navigation/services/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { AdminControlService } from 'src/app/pages/adminControl/services/adminControl.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MemberCenterService } from 'src/app/pages/adminControl/modules/memberCenter/services/member-center.service';
import { SiteMapComponent } from 'src/app/pages/adminControl/modules/siteCenter/dialogs/siteMap/siteMap.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, OnDestroy {
  profileModel: ProfileModel = <ProfileModel>{};
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // cards: any;


  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Activities', cols: 4, rows: 1 },
          { title: 'Connections', cols: 4, rows: 1 },
          { title: 'Leaves', cols: 4, rows: 1 },
          { title: 'Entities', cols: 4, rows: 1 }
        ];
      } else {
        return [
          { title: 'Activities', cols: 1, rows: 1 },
          { title: 'Connections', cols: 1, rows: 1 },
          { title: 'Leaves', cols: 1, rows: 1 },
          { title: 'Entities', cols: 1, rows: 1 }
        ];
      }
    })
  );

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
    public memberService: MemberCenterService
  ) {
    this.initialize();
    this.helperService.appLoggerDev(
      this.profileModel.translated.LOGGER.STATUS.SUCCESS,
      this.profileModel.translated.LOGGER.MESSAGES.PROFILE_COMPONENT
    );
    this.route.params.subscribe((data) => {
      if (!helperService.isEmpty(data)) {

        this.profileModel.receivedData = JSON.parse(data.data);
        this.profileModel.role = this.profileModel.receivedData.accessLevel;
        this.profileModel.userId = this.profileModel.receivedData.id;
        this.profileModel.currentUserProfile = false;
        this.getUserConnections(this.profileModel.receivedData.id);
        this.viewActivities(this.profileModel.receivedData.id);
        this.viewAllEntities(this.profileModel.userId);
      } else {
        this.profileModel.subscription = this.navService.selectedEntityData.subscribe((res) => {
          if (res !== 1) {
            this.profileModel.role = res.role;
            this.profileModel.entityName = res.entityInfo.name;
            this.profileModel.currentUserProfile = true;
          }
        });
      }
    });
  }

  /**
   * this function is called when this component initialize and in this function we have subscribed
   * to the behavior subject of the profile data.
   */
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.profileModel.subscription = this.navService.currentUserData.subscribe((res) => {
      if (res !== 1) {
        if (this.profileModel.currentUserProfile) {
          this.profileModel.profileData = res;
          this.profileModel.username = this.profileModel.profileData.username;
          this.profileModel.email = this.profileModel.profileData.email;
          this.profileModel.profileImage = this.profileModel.profileData.profileImage;
          this.profileModel.userId = this.profileModel.profileData.id;
          this.getUserConnections(this.profileModel.userId);
          this.viewActivities(this.profileModel.userId);
          this.viewAllEntities(this.profileModel.userId);
        } else {
          this.profileModel.profileData = this.profileModel.receivedData;
          this.profileModel.username = this.profileModel.receivedData.name;
          this.profileModel.email = this.profileModel.receivedData.email;
          this.profileModel.profileImage = this.profileModel.profileData.profileImage;
        }
      } else {
        this.getCurrentUser();
      }
    });

    // this.responsive();
  }


  initialize() {
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
    console.log('these are dimensions', this.helperService.dimensions);
  }

  /**
   * this function is used to return all the entities while subscribing to the behavior subject of the
   * viewALLEntities.
   */

  viewAllEntities(userId) {
    if (this.profileModel.currentUserProfile) {
      this.profileModel.subscription = this.navService.data.subscribe((res) => {
        if (res !== 1) {
          this.helperService.toggleLoader(false);
          this.profileModel.entitiesList = res;
          this.profileModel.dataSource = new MatTableDataSource(this.profileModel.entitiesList.entities);
          this.profileModel.dataSource.paginator = this.paginator;
        }
      });
    } else { }

  }
  /**
   * this function is used for hiding all the debugging messages and also used for unsubscribing the
   * observables.
   */

  ngOnDestroy() {
    this.helperService.hideLoggers();
    this.profileModel.subscription.unsubscribe();
  }

  /**
   * this function is used to read the image file on selection from the pc storage.
   * @params event
   */

  uploadProfileImage(event) {
    this.profileModel.imageFile = <File>event.target.files[0];
    let blob = new Blob([this.profileModel.imageFile], { type: 'image/*' });
    let formData = new FormData();
    formData.append('profileImage', blob, this.profileModel.imageFile.name);
    this.profileService.profilePicUpdate(formData).subscribe((res) => {
      let userData = this.compiler.constructProfileData(res.data);
      this.navService.updateCurrentUser(userData);
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
          this.helperService.translated.MESSAGES.PIC_UPLOADED_SUCCESS);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.helperService.appLogger(this.helperService.constants.status.ERROR,
          this.helperService.translated.MESSAGES.PIC_UPLOADED_FAILURE);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[1]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.PIC_EXCEEDS_LIMIT,
          this.helperService.constants.status.WARNING);

      }
    });
  }

  /**
   * this function is used for getting the data for current user to show on the profile page.
   */

  getCurrentUser() {
    this.profile.getUser().subscribe((res) => {
      this.profileModel.dataRecieved = res;
      let userData = this.compiler.constructProfileData(this.profileModel.dataRecieved.data.user);
      //   this.profileModel.userId = this.profileModel.dataRecieved.user.id;
      this.navService.updateCurrentUser(userData);
    });
  }

  viewActivities(userId: number) {
    this.profile.viewRecentActivities({ userId: userId }).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        if (res.data.length === 0) {
          this.profileModel.noActivity = true;
        } else {
          this.profileModel.recentActivities = this.compiler.constructRecentActivitiesData(res);
        }
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.profileModel.noActivity = true;
        this.helperService.appLogger(this.helperService.constants.status.ERROR,
          this.helperService.translated.MESSAGES.ACTIVITIES_FAIL);
      } else {
        this.profileModel.noActivity = true;
      }
    });
  }

  getUserConnections(userId: number) {

    this.adminService.allConnections({ userId: userId }).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.profileModel.allConnectionsRes = res;
        this.profileModel.allConnectionsData = this.compiler.constructAllConnectionData(res);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.profileModel.noConnection = true;
      } else {
        this.profileModel.noConnection = true;
        this.helperService.appLogger(this.helperService.constants.status.ERROR,
          this.helperService.translated.MESSAGES.GET_CONNECTIONS_FAILURE);
      }
    });
  }
  removeConnection(sentToUserId: number) {
    this.memberService.removeConnection({ receivedBy: sentToUserId }).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.REMOVE_CONNECTION_SUCCESS,
          this.helperService.constants.status.SUCCESS);
        this.getUserConnections(this.profileModel.userId);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.REMOVE_CONNECTION_FAILURE,
          res.responseDetails.message);
      }
    }, (error) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR, error);
      this.helperService.createSnack(this.helperService.translated.MESSAGES.REMOVE_CONNECTION_FAILURE,
        this.helperService.constants.status.ERROR);
    });

  }

  viewSite(longitude, latitude, siteName, location) {
    let data = { 'longitude': longitude, 'latitude': latitude, 'siteName': siteName, 'location': location }
    this.helperService.createDialog(SiteMapComponent, { disableClose: true, data: { siteData: data, type: true } });
  }
}



/**
 * below code is mocked data will be replaced when we will have data to change this.
 */
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];
