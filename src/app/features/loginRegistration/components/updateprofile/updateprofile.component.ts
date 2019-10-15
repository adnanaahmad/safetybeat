import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {CoreService} from 'src/app/services/core/authorization/core.service';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProfileService} from 'src/app/features/profile/services/profile.service';
import {SettingsService} from 'src/app/features/settings/services/settings.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {GeneralInfo} from 'src/app/models/general.model';
import {User} from 'src/app/models/user.model';
import {LoginRegistrationService} from 'src/app/features/loginRegistration/services/LoginRegistrationService';
import {Subscription} from 'rxjs';

const phoneNumberUtil = HelperService.getPhoneNumberUtil();

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.component.html',
  styleUrls: ['./updateprofile.component.scss']
})
export class UpdateprofileComponent implements OnInit, OnDestroy {
  logoutDisable: boolean = false;
  logoutResponse: any;
  generalForm: FormGroup;
  resultData: GeneralInfo;
  userData: User;
  success: any;
  email: any;
  loading: boolean = false;
  private subscription: Subscription;

  constructor(
    private navService: NavigationService,
    private coreService: CoreService,
    public helperService: HelperService,
    private formBuilder: FormBuilder,
    private profile: ProfileService,
    private settings: SettingsService,
    public compiler: CompilerProvider,
    private loginRegService: LoginRegistrationService
  ) {
  }

  get generalViewForm() {
    return this.generalForm.controls;
  }


  ngOnInit() {
    this.generalForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      countryCode: ['', Validators.required],
      contactNo: ['', Validators.required],
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]]
    }, {validator: Validators.compose([this.checkPasswords.bind(this), this.phoneNumberValid.bind(this)])});
    this.setGeneralForm();
  }

  ngOnDestroy(): void {
    if (this.subscription !== null && this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

  numberOnly(event: Event): boolean {
    return this.compiler.numberOnly(event);
  }

  /**
   * this function is used for entering only the characters in the input fields.
   * @params event
   */

  characterOnly(event: Event): boolean {
    return this.compiler.charactersOnly(event);
  }

  /**
   * to check if password and confirm password is same
   * @param group formGroup for user form
   */
  checkPasswords(group: FormGroup) {
    const pass = group.value.password1;
    const confirmPass = group.value.password2;
    return pass === confirmPass ? null : group.controls.password2.setErrors({notSame: true});
  }

  setGeneralForm() {
    this.loading = true;
    this.settings.generalData.subscribe((res) => {
      if (res && res === 1) {
        this.profile.getUser().subscribe((res) => {
          if (res) {
            this.userData = this.compiler.constructProfileData(res.data.user);
            this.navService.updateCurrentUser(this.userData);
            this.generalViewForm['first_name'].setValue(this.userData.first_name);
            this.generalViewForm['last_name'].setValue(this.userData.last_name);
            if (this.userData.contactNo !== null) {
              let contact = (this.userData.contactNo).split('-', 2);
              this.generalViewForm['contactNo'].setValue(contact[1]);
              contact[0] = contact[0].replace('+', '');
              this.generalViewForm['countryCode'].setValue(contact[0]);
            }
            this.loading = false;
          }
          this.loading = false;
        }, (error) => {
          this.loading = false;
          this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
        });
      }
    });
  }

  /**
   * this function is used for checking the validation of the phone number that the user will add.
   * @params group
   */

  phoneNumberValid(group: FormGroup) {
    try {
      const phoneNumber = phoneNumberUtil.parseAndKeepRawInput(
        '+' + group.value.countryCode + group.value.contactNo, undefined
      );
      return phoneNumberUtil.isValidNumber(phoneNumber) ? group.controls.contactNo.setErrors(null) :
        group.controls.contactNo.setErrors({inValid: true});
    } catch (e) {
      return group.controls.contactNo.setErrors({inValid: true});
    }
  }


  checkEmail(group) {
    this.email = this.formBuilder.group({
      'email': [group.value.email, Validators.email]
    });
    if (this.email.status === this.helperService.appConstants.emailValid) {
      const email = {email: group.value.email};
      this.navService.checkEmail(email).pipe().subscribe((res) => {
        this.success = res;
        if (this.success.responseDetails.code === this.helperService.appConstants.codeValidations[1]) {
          group.controls.email.setErrors({exists: true});
        }
      }, err => {
        this.helperService.logoutError(err.status);
      });
    }
  }

  logoutUser() {
    this.loading = true;
    this.navService.logoutUser().subscribe((res) => {
      this.logoutDisable = true;
      this.logoutResponse = res;
      if (this.logoutResponse.detail === this.helperService.translated.AUTH.LOGOUTSUCCESSION) {
        this.coreService.logoutUser();
      }
      this.loading = false;
    }, (error) => {
      this.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.LOGOUT_FAIL_MSG,
        this.helperService.translated.MESSAGES.LOGOUT_FAIL_MSG);
    });
  }


  updateProfile(data: FormGroup) {
    if (data.invalid) {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.INVALID_DATA, this.helperService.translated.STATUS.ERROR);
      return;
    }
    this.loading = true;
    let userData = {
      username: this.userData.username,
      first_name: data.value.first_name,
      last_name: data.value.last_name,
      email: this.userData.email,
      contactNo: '+' + data.value.countryCode + '-' + data.value.contactNo,
      password: data.value.password1,
    };

    this.loginRegService.updateProfile(this.userData.id, userData).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.loading = false;
        this.logoutUser();
        this.helperService.createSnack(this.helperService.translated.LOGGER.MESSAGES.PROFILE_UPDATED,
          this.helperService.constants.status.SUCCESS);
      } else {
        this.loading = false;
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  permissionBasedNavigation() {
    this.subscription = this.navService.entityPermissions.subscribe((res) => {
      if (res !== 1 && res.dashboard) {
        this.helperService.navigateTo(['home/adminControl/dashboard']);
      } else if (res !== 1 && res.entityControl) {
        this.helperService.navigateTo(['home/adminControl/entityControl']);
      }
    });
  }

}
