import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import {ProfileService} from 'src/app/pages/profile/services/profile.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {EditUser} from 'src/app/models/profile.model';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {LoginRegistrationService} from 'src/app/pages/loginRegistration/services/LoginRegistrationService';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {ProfileModel} from 'src/app/models/profile/profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  profileFeatures = {
    general: false,
    entities: false,
    leaves: false,
    profile: true,
    changePassword: false
  };
  profileModel: ProfileModel = <ProfileModel>{};

  constructor(
    private profile: ProfileService,
    private loginService: LoginRegistrationService,
    private formBuilder: FormBuilder,
    public helperService: HelperService,
    private compiler: CompilerProvider
  ) {
    this.initialize();
    this.helperService.appLoggerDev(
      this.profileModel.translated.LOGGER.STATUS.SUCCESS,
      this.profileModel.translated.LOGGER.MESSAGES.PROFILE_COMPONENT
    );
  }


  @Input()
  ngOnInit() {
    this.profileModel.profileForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contactNo: ['', Validators.required]
    });
    this.profileModel.profileForm.disable();
  }

  initialize() {
    this.profileModel.translated = this.helperService.translated;
    this.profileModel.appIcons = this.helperService.constants.appIcons;
    this.profileModel.appConstants = this.helperService.constants.appConstant;
    this.profileModel.disabled = false;
    this.profileModel.profileFeatures.general = false;
    this.profileModel.profileFeatures.entities = false;
    this.profileModel.profileFeatures.leaves = false;
    this.profileModel.profileFeatures.profile = true;
    this.profileModel.profileFeatures.changePassword = false;
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
    return this.profileModel.profileForm.controls;
  }

  /**
   * this function ...
   */
  getUserData() {
    this.profileModel.profileData = this.loginService.profileData.subscribe(
      userDataResult => {
        if (userDataResult !== 1) {
          this.profileModel.userData = userDataResult;
          this.profileModel.userId = this.profileModel.userData.id;
          this.profileModel.username = this.profileModel.userData.first_name + this.profileModel.userData.last_name;
          this.profileModel.firstname = this.profileModel.userData.first_name;
          this.profileModel.lastname = this.profileModel.userData.last_name;
          this.profileModel.email = this.profileModel.userData.email;
          this.profileModel.contactNo = this.profileModel.userData.contactNo;
        } else {
          this.profile.getUser().subscribe(res => {
            this.profileModel.dataRecieved = res;
            this.profileModel.userData = this.compiler.constructUserData(
              this.profileModel.dataRecieved.data.user
            );
            this.profileModel.userId = this.profileModel.userData.id;
            this.profileModel.username = this.profileModel.userData.first_name + this.profileModel.userData.last_name;
            this.profileModel.firstname = this.profileModel.userData.first_name;
            this.profileModel.lastname = this.profileModel.userData.last_name;
            this.profileModel.email = this.profileModel.userData.email;
            this.profileModel.contactNo = this.profileModel.userData.contactNo;
            this.loginService.updateProfileData(this.profileModel.userData);
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
  editAccount() {
    this.profileModel.disabled = true;
    this.profileModel.profileForm.enable();
  }

  /**
   * this function ..
   */
  cancelEditAccount() {
    this.profileModel.disabled = false;
    this.profileModel.profileForm.disable();
    this.profileModel.userData = this.getUserData();
  }

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
  updateProfile({value, valid}: { value: EditUser; valid: boolean }): void {
    this.profileModel.disabled = false;
    this.profileModel.profileForm.disable();
    if (!valid) {
      this.helperService.appLoggerDev(
        this.profileModel.translated.LOGGER.STATUS.WARNING,
        valid
      );
      this.helperService.appLogger(
        this.profileModel.translated.LOGGER.STATUS.ERROR,
        this.profileModel.translated.LOGGER.MESSAGES.PROFILE_CREDENTIAL_REQ
      );
      return;
    }
    this.helperService.appLoggerDev(this.profileModel.translated.LOGGER.STATUS.INFO, valid);
    this.helperService.appLogger(
      this.profileModel.translated.LOGGER.STATUS.INFO,
      JSON.stringify(value)
    );
    value[this.profileModel.appConstants.userName] = this.profileModel.username;
    this.profile.editUser(this.profileModel.userId, value).subscribe(
      data => {
        this.helperService.appLoggerDev(
          this.profileModel.translated.LOGGER.STATUS.SUCCESS,
          valid
        );
        this.helperService.appLogger(
          this.profileModel.translated.LOGGER.STATUS.SUCCESS,
          this.profileModel.translated.LOGGER.MESSAGES.PROFILE_UPDATED
        );
        this.helperService.createSnack(this.profileModel.translated.LOGGER.STATUS.SUCCESS,
          this.profileModel.translated.LOGGER.MESSAGES.PROFILE_UPDATED, this.helperService.constants.status.SUCCESS);
        this.helperService.createSnack(this.profileModel.translated.LOGGER.STATUS.SUCCESS,
          this.profileModel.translated.LOGGER.MESSAGES.PROFILE_UPDATED, this.helperService.constants.status.SUCCESS);
        this.getUserData();
      },
      error => {
        this.helperService.appLoggerDev(
          this.profileModel.translated.LOGGER.STATUS.ERROR,
          `${error.error.detail +
          this.profileModel.translated.LOGGER.MESSAGES.STATUS +
          error.status}`
        );
        this.helperService.appLoggerDev(
          this.profileModel.translated.MESSAGES.LOGIN_FAIL,
          this.profileModel.translated.LOGGER.MESSAGES.PROFILE_NOTUPDATED
        );
        this.helperService.logoutError(error.status);
      }
    );
  }
}
