import {Component, OnInit} from '@angular/core';
import {HelperService} from '../../../../shared/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {CompilerProvider} from '../../../../shared/compiler/compiler';
import {GeneralInfo, GeneralModel} from '../../../../models/general.model';
import {ProfileService} from '../../../profile/services/profile.service';
import {SettingsService} from '../../services/settings.service';
import {error} from 'util';

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
              public profile: ProfileService) {
    this.generalObj.enabled = false;
  }

  ngOnInit() {
    this.generalObj.generalForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contactNo: ['', Validators.required]
    });
    this.setGeneralForm();
    this.generalObj.generalForm.disable();
  }

  get generalViewForm() {
    return this.generalObj.generalForm.controls;
  }

  editGeneralForm() {
    this.generalObj.enabled = true;
    this.generalObj.generalForm.enable();
    this.generalViewForm['username'].disable();
  }

  setGeneralForm() {
    this.settings.organizationData.subscribe((res) => {
      if (res === 1) {
        this.profile.getUser().subscribe((res) => {
          this.generalObj.resultData = this.compiler.constructGeneralInfoObject(res);
          this.generalObj.userData = this.compiler.constructProfileData(this.generalObj.resultData.user);
          this.profile.updateCurrenUser(this.generalObj.userData);
          this.generalViewForm['email'].setValue(this.generalObj.userData.email);
          this.generalViewForm['first_name'].setValue(this.generalObj.userData.first_name);
          this.generalViewForm['last_name'].setValue(this.generalObj.userData.last_name);
          this.generalViewForm['contactNo'].setValue(this.generalObj.userData.contactNo);
        });
      }
    });
  }

  cancelForm() {
    this.setGeneralForm();
    this.generalObj.enabled = false;
    this.generalObj.generalForm.disable();
  }

  // need to make changes to the parameter Organization
  updateGeneralInfo({value, valid}: { value: GeneralInfo; valid: boolean }): void {
    console.log(value);
    this.generalObj.enabled = false;
    this.generalObj.generalForm.disable();
    let data = {
      'username': this.generalObj.userData.username,
      'first_name': value.first_name,
      'last_name': value.last_name,
      'contactNo': value.contactNo,
      'email': value.email
    };
    if (!valid) {
      this.helperService.appLogger(this.helperService.translated.STATUS.ERROR, this.helperService.translated.MESSAGES.INVALID_DATA);
      return;
    }
    this.settings.editProfile(this.generalObj.userData.id, data).subscribe((res) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.GENERAL_UPDATED, this.helperService.constants.status.SUCCESS);
      }
      // , (error) => {
      //   this.helperService.createSnack(this.helperService.translated.MESSAGES.GENERAL_FAIL,
      //     this.helperService.constants.status.ERROR);
      // }
    );
  }
}
