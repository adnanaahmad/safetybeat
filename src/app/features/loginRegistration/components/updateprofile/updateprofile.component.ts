import {Component, OnInit} from '@angular/core';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {CoreService} from 'src/app/services/core/authorization/core.service';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProfileService} from 'src/app/features/profile/services/profile.service';
import {SettingsService} from 'src/app/features/settings/services/settings.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {GeneralInfo} from 'src/app/models/general.model';
import {User} from 'src/app/models/user.model';

const phoneNumberUtil = HelperService.getPhoneNumberUtil();

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.component.html',
  styleUrls: ['./updateprofile.component.scss']
})
export class UpdateprofileComponent implements OnInit {
  logoutDisable: boolean;
  logoutResponse: any;
  generalForm: FormGroup;
  resultData: GeneralInfo;
  userData: User;
  success: any;
  email: any;
  loading: boolean = false;

  constructor(
    private navService: NavigationService,
    private coreService: CoreService,
    private helperService: HelperService,
    private formBuilder: FormBuilder,
    private profile: ProfileService,
    private settings: SettingsService,
    public compiler: CompilerProvider
  ) {
  }


  ngOnInit() {
    this.generalForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contactNo: ['', Validators.required],
      countryCode: ['', Validators.required],
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]]
    }, {validator: [this.phoneNumberValid.bind(this), this.checkPasswords]});
    this.setGeneralForm();
    this.generalViewForm['email'].disable();
  }

  get generalViewForm() {
    return this.generalForm.controls;
  }

  checkPasswords(group: FormGroup) {
    const currentPass = group.controls.currentPassword.value;
    const savedPass = this.helperService.decrypt(localStorage.getItem('pas'), this.helperService.appConstants.key);
    if (currentPass !== savedPass) {
      group.controls.currentPassword.setErrors({notSame: true});
    }
    const pass = group.controls.password1.value;
    const confirmPass = group.controls.password2.value;
    return pass === confirmPass ? null : group.controls.password2.setErrors({notSame: true});
  }

  setGeneralForm() {
    this.settings.generalData.subscribe((res) => {
      if (res && res === 1) {
        this.profile.getUser().subscribe((res) => {
          if (res) {
            this.userData = this.compiler.constructProfileData(res.data.user);
            this.navService.updateCurrentUser(this.userData);
            this.generalViewForm['email'].setValue(this.userData.email);
            this.generalViewForm['first_name'].setValue(this.userData.first_name);
            this.generalViewForm['last_name'].setValue(this.userData.last_name);
            let contact = (this.userData.contactNo).split('-', 2);
            this.generalViewForm['contactNo'].setValue(contact[1]);
            contact[0] = contact[0].replace('+', '');
            this.generalViewForm['countryCode'].setValue(contact[0]);
          }
        }, (error) => {
          this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
        });
      }
    });
  }

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

  characterOnly(event): boolean {
    return this.compiler.charactersOnly(event);
  }

  numberOnly(event): boolean {
    return this.compiler.numberOnly(event);
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
    this.navService.logoutUser().subscribe((res) => {
      this.logoutDisable = true;
      this.logoutResponse = res;
      if (this.logoutResponse.detail === this.helperService.translated.AUTH.LOGOUTSUCCESSION) {
        this.coreService.logoutUser();
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.LOGOUT_FAIL_MSG,
        this.helperService.translated.MESSAGES.LOGOUT_FAIL_MSG);
    });
  }

}
