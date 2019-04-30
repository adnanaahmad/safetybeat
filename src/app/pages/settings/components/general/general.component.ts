import {Component, OnInit} from '@angular/core';
import {HelperService} from '../../../../shared/helperService/helper.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CompilerProvider} from '../../../../shared/compiler/compiler';
import {GeneralInfo, GeneralModel} from '../../../../models/general.model';
import {ProfileService} from '../../../profile/services/profile.service';
import {SettingsService} from '../../services/settings.service';
import {NavigationService} from '../../../navigation/services/navigation.service';

const phoneNumberUtil = HelperService.getPhoneNumberUtil();

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  generalObj: GeneralModel = <GeneralModel>{};

  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              private settings: SettingsService,
              public compiler: CompilerProvider,
              public profile: ProfileService,
              private navService: NavigationService) {
    this.generalObj.enabled = false;
  }

  ngOnInit() {
    this.generalObj.generalForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contactNo: ['', Validators.required],
      countryCode: ['', Validators.required]
    }, {validator: this.phoneNumberValid.bind(this)});
    this.setGeneralForm();
    this.generalObj.generalForm.disable();
  }

  get generalViewForm() {
    return this.generalObj.generalForm.controls;
  }

  editGeneralForm() {
    this.generalObj.enabled = true;
    this.generalObj.generalForm.enable();
    this.generalViewForm['email'].disable();
  }

  setGeneralForm() {
    this.settings.generalData.subscribe((res) => {
      if (res === 1) {
        this.profile.getUser().subscribe((res) => {
          console.log(res);
          this.generalObj.resultData = this.compiler.constructGeneralInfoObject(res);
          this.generalObj.userData = this.compiler.constructProfileData(this.generalObj.resultData.user);
          this.profile.updateCurrenUser(this.generalObj.userData);
          this.generalViewForm['email'].setValue(this.generalObj.userData.email);
          this.generalViewForm['first_name'].setValue(this.generalObj.userData.first_name);
          this.generalViewForm['last_name'].setValue(this.generalObj.userData.last_name);
          let contact = (this.generalObj.userData.contactNo).split('-', 2);
          this.generalViewForm['contactNo'].setValue(contact[1]);
          this.generalViewForm['countryCode'].setValue(contact[0]);
        });
      }
    });
  }

  cancelForm() {
    this.setGeneralForm();
    this.generalObj.enabled = false;
    this.generalObj.generalForm.disable();
  }

  phoneNumberValid(group: FormGroup) {
    try {
      const phoneNumber = phoneNumberUtil.parseAndKeepRawInput(
        '+' + group.value.countryCode  + group.value.contactNo, undefined
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
    this.generalObj.email = this.formBuilder.group({
      'email': [group.value.email, Validators.email]
    });
    if (this.generalObj.email.status === this.helperService.appConstants.emailValid) {
      const email = {email: group.value.email};
      this.navService.checkEmail(email).pipe().subscribe((res) => {
        console.log(res);
        this.generalObj.success = res;
        if (this.generalObj.success.responseDetails.code === this.helperService.appConstants.codeValidations[1]) {
          group.controls.email.setErrors({exists: true});
        }
      }, err => {
        this.helperService.logoutError(err.status);
      });
    }
  }

  // need to make changes to the parameter Organization
  updateGeneralInfo({value, valid}: { value: GeneralInfo; valid: boolean }): void {
    this.generalObj.enabled = false;
    this.generalObj.generalForm.disable();
    let data = {
      'username': this.generalObj.userData.username,
      'first_name': value.first_name,
      'last_name': value.last_name,
      'contactNo': value.countryCode + '-' + value.contactNo,
      'email': this.generalObj.userData.email
    };
    console.log(data);
    if (!valid) {
      this.helperService.appLogger(this.helperService.translated.STATUS.ERROR, this.helperService.translated.MESSAGES.INVALID_DATA);
      return;
    }
    this.settings.editProfile(this.generalObj.userData.id, data).subscribe((res) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.GENERAL_UPDATED, this.helperService.constants.status.SUCCESS);
      }, (error) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.GENERAL_FAIL,
          this.helperService.constants.status.ERROR);
      }
    );
  }
}
