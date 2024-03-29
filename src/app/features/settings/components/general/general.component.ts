import {Component, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {GeneralInfo, GeneralModel} from 'src/app/models/general.model';
import {ProfileService} from 'src/app/features/profile/services/profile.service';
import {SettingsService} from 'src/app/features/settings/services/settings.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {MatDialogRef} from '@angular/material';

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
              public dialogRef: MatDialogRef<GeneralComponent>,
              private navService: NavigationService) {
    this.generalObj.enabled = false;
    this.generalObj.loading = false;
  }

  ngOnInit() {
    this.generalObj.generalForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contactNo: ['', Validators.required],
      countryCode: ['', [Validators.required,  Validators.maxLength(3)]]
    }, {validator: this.phoneNumberValid.bind(this)});
    this.setGeneralForm();
    this.generalViewForm['email'].disable();
  }

  get generalViewForm() {
    return this.generalObj.generalForm.controls;
  }

  setGeneralForm() {
    this.generalObj.loading = true;
    this.profile.getUser().subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.generalObj.resultData = this.compiler.constructGeneralInfoObject(res);
        this.generalObj.userData = this.compiler.constructProfileData(this.generalObj.resultData.user);
        this.navService.updateCurrentUser(this.generalObj.userData);
        this.generalViewForm['email'].setValue(this.generalObj.userData.email);
        this.generalViewForm['first_name'].setValue(this.generalObj.userData.first_name);
        this.generalViewForm['last_name'].setValue(this.generalObj.userData.last_name);
        let contact = (this.generalObj.userData.contactNo).split('-', 2);
        this.generalViewForm['contactNo'].setValue(contact[1]);
        contact[0] = contact[0].replace('+', '');
        this.generalViewForm['countryCode'].setValue(contact[0]);
        this.generalObj.loading = false;
      } else {
        this.generalObj.loading = false;
      }

    }, (error) => {
      this.generalObj.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
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
    this.generalObj.email = this.formBuilder.group({
      'email': [group.value.email, Validators.email]
    });
    if (this.generalObj.email.status === this.helperService.appConstants.emailValid) {
      const email = {email: group.value.email};
      this.navService.checkEmail(email).pipe().subscribe((res) => {
        this.generalObj.success = res;
        if (this.generalObj.success.responseDetails.code === this.helperService.appConstants.codeValidations[1]) {
          group.controls.email.setErrors({exists: true});
        }
      }, err => {
        this.helperService.logoutError(err.status);
      });
    }
  }

  updateGeneralInfo({value, valid}: { value: GeneralInfo; valid: boolean }): void {
    this.generalObj.enabled = false;
    this.generalObj.loading = true;
    this.generalObj.generalForm.disable();
    let data = {
      'username': this.generalObj.userData.username,
      'first_name': value.first_name,
      'last_name': value.last_name,
      'contactNo': value.countryCode + '-' + value.contactNo,
      'email': this.generalObj.userData.email
    };
    if (!valid) {
      this.generalObj.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.INVALID_DATA, this.helperService.translated.STATUS.ERROR);
      this.dialogRef.close();
      return;
    }
    this.settings.editProfile(this.generalObj.userData.id, data).subscribe((res) => {
        if (res) {
          this.generalObj.loading = false;
          this.dialogRef.close();
          this.helperService.createSnack(this.helperService.translated.MESSAGES.GENERAL_UPDATED,
            this.helperService.constants.status.SUCCESS);
        }
      }, (error) => {
        this.dialogRef.close();
        this.generalObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      }
    );
  }
}
