import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import {ProfileService} from 'src/app/pages/profile/services/profile.service';
import {Translation} from 'src/app/models/translate.model';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {EditUser} from 'src/app/models/profile.model';
import {MatDialog} from '@angular/material';
import {ConstantService} from 'src/app/shared/constant/constant.service';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {LoginRegistrationService} from 'src/app/pages/loginRegistration/services/LoginRegistrationService';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  userData: any;
  @Input() profileForm: FormGroup;
  changePasswordForm: FormGroup;
  translated: Translation;
  profileData: any;
  userId: number;
  username: string;
  firstname: string;
  lastname: string;
  contactNo: string;
  dataRecieved: any;
  disabled: boolean = false;
  isEdited: boolean = false;
  currentPassword: string;
  password1: string;
  password2: string;
  appIcons: any;
  appConstants: any;
  profileFeatures = {
    general: false,
    entities: false,
    leaves: false,
    profile: true,
    changePassword: false
  };
  joinEntityData: { moduleName: string };
  allEntries: Object;
  entitiesList: any;
  email: any;

  constructor(
    private profile: ProfileService,
    private loginService: LoginRegistrationService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public adminServices: AdminControlService,
    public helperService: HelperService,
    private compiler: CompilerProvider
  ) {
    this.translated = this.helperService.translated;
    this.helperService.appLoggerDev(
      this.translated.LOGGER.STATUS.SUCCESS,
      this.translated.LOGGER.MESSAGES.PROFILE_COMPONENT
    );
    this.appIcons = ConstantService.appIcons;
    this.appConstants = ConstantService.appConstant;
    // this.profileData = JSON.parse(localStorage.getItem(ConstantService.localStorageKeys.entityUserData));
  }


  @Input()
  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contactNo: ['', Validators.required]
    });
    this.profileForm.disable();
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.helperService.hideLoggers();
  }

  ngAfterViewInit() {
    this.getUserData();
  }


  checkPasswords(group: FormGroup) {
    const pass = group.controls.password1.value;
    const confirmPass = group.controls.password2.value;
    return pass === confirmPass
      ? null
      : group.controls.password2.setErrors({notSame: true});
  }


  get profileDataForm() {
    return this.profileForm.controls;
  }

  /**
   * this function ...
   */
  getUserData() {
    this.profileData = this.loginService.profileData.subscribe(
      userDataResult => {
        if (userDataResult !== 1) {
          this.userData = userDataResult;
          this.userId = this.userData.id;
          this.username = this.userData.first_name + this.userData.last_name;
          this.firstname = this.userData.first_name;
          this.lastname = this.userData.last_name;
          this.email = this.userData.email;
          this.contactNo = this.userData.contactNo;
        } else {
          this.profile.getUser().subscribe(res => {
            this.dataRecieved = res;
            this.userData = this.compiler.constructUserData(
              this.dataRecieved.data.user
            );
            this.userId = this.userData.id;
            this.username = this.userData.first_name + this.userData.last_name;
            this.firstname = this.userData.first_name;
            this.lastname = this.userData.last_name;
            this.email = this.userData.email;
            this.contactNo = this.userData.contactNo;
            this.loginService.updateProfileData(this.userData);
          });
        }
      }
    );
  }

  // onCreate(feature: any) {
  //   var self = this;
  //   this.helperService.iterations(this.profileFeatures, function(value, key) {
  //     if (key === feature) {
  //       self.profileFeatures[key] = true;
  //     } else {
  //       self.profileFeatures[key] = false;
  //     }
  //   });
  // }
  /**
   * this function ..
   */
  // editAccount() {
  //   this.disabled = true;
  //   this.profileForm.enable();
  // }

  // /**
  //  * this function ..
  //  */
  // cancelEditAccount() {
  //   this.disabled = false;
  //   this.profileForm.disable();
  //   this.userData = this.getUserData();
  // }

  onLeaves() {
    this.profileFeatures.leaves = true;
  }

  onEntities() {
  }

  onActivities() {
  }

  /**
   * this function..
   * @params value
   * @params valid
   */
  updateProfile({ value, valid }: { value: EditUser; valid: boolean }): void {
    this.disabled = false;
    this.profileForm.disable();
    if (!valid) {
      this.helperService.appLoggerDev(
        this.translated.LOGGER.STATUS.WARNING,
        valid
      );
      this.helperService.appLogger(
        this.translated.LOGGER.STATUS.ERROR,
        this.translated.LOGGER.MESSAGES.PROFILE_CREDENTIAL_REQ
      );
      return;
    }
    this.helperService.appLoggerDev(this.translated.LOGGER.STATUS.INFO, valid);
    this.helperService.appLogger(
      this.translated.LOGGER.STATUS.INFO,
      JSON.stringify(value)
    );
    value[this.appConstants.userName] = this.username;
    this.profile.editUser(this.userId, value).subscribe(
      data => {
        this.helperService.appLoggerDev(
          this.translated.LOGGER.STATUS.SUCCESS,
          valid
        );
        this.helperService.appLogger(
          this.translated.LOGGER.STATUS.SUCCESS,
          this.translated.LOGGER.MESSAGES.PROFILE_UPDATED
        );
        this.helperService.createSnack(this.translated.LOGGER.STATUS.SUCCESS,
          this.translated.LOGGER.MESSAGES.PROFILE_UPDATED, this.helperService.constants.status.SUCCESS);
        this.helperService.createSnack(this.translated.LOGGER.STATUS.SUCCESS,
          this.translated.LOGGER.MESSAGES.PROFILE_UPDATED, this.helperService.constants.status.SUCCESS);
        this.getUserData();
      },
      error => {
        this.helperService.appLoggerDev(
          this.translated.LOGGER.STATUS.ERROR,
          `${error.error.detail +
          this.translated.LOGGER.MESSAGES.STATUS +
          error.status}`
        );
        this.helperService.appLoggerDev(
          this.translated.MESSAGES.LOGIN_FAIL,
          this.translated.LOGGER.MESSAGES.PROFILE_NOTUPDATED
        );
        this.helperService.logoutError(error.status);
      }
    );
  }
  
}
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];
