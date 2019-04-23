import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Organization} from 'src/app/models/settings/setting.model';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {SettingsService} from 'src/app/pages/settings/services/settings.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';

@Component({
  selector: 'app-organization-info',
  templateUrl: './organizationInfo.component.html',
  styleUrls: ['./organizationInfo.component.scss']
})
export class OrganizationInfoComponent implements OnInit {

  organizationForm: FormGroup;
  orgID: any;
  disabled: boolean = false;

  constructor(public helperService: HelperService,
              public settingService: SettingsService,
              public formBuilder: FormBuilder,
              public compiler: CompilerProvider) {
  }

  ngOnInit() {
    this.organizationForm = this.formBuilder.group({
      name: [''],
      accountNo: [''],
      address: [''],
      billingEmail: [''],
      dateJoined: [''],
      phoneNo: ['']
    });
    this.getOrganizationInfo();
  }

  /**
   * handling forms validations
   */
  get organizationViewForm() {
    return this.organizationForm.controls;
  }

  getOrganizationInfo() {
    this.settingService.organizationData.subscribe((res) => {
      if (res === 1) {
        // it means page is refreshed we need to call the API
        this.settingService.getOrganization().subscribe((res) => {
          console.log(res);
          let orgObj = this.compiler.constructOrganizationObject(res);
          this.organizationViewForm['name'].setValue(orgObj.name);
          this.organizationViewForm['accountNo'].setValue(orgObj.accountNo);
          this.organizationViewForm['address'].setValue(orgObj.address);
          this.organizationViewForm['billingEmail'].setValue(orgObj.billingEmail);
          this.organizationViewForm['dateJoined'].setValue(orgObj.dateJoined);
          this.organizationViewForm['phoneNo'].setValue(orgObj.phoneNo);
          this.orgID = orgObj.id;
          this.organizationForm.disable();
        });
      } else {
        // it means that we dont need to call API
      }
    });
  }

  editOrgForm() {
    this.disabled = true;
    this.organizationForm.enable();
  }

  cancelOrgForm() {
    this.disabled = false;
    this.organizationForm.disable();
  }

  updateOrganization({value, valid}: { value: Organization; valid: boolean }): void {
    this.disabled = false;
    this.organizationForm.disable();
    let data = {
      'name': value.name,
      'accountNo': value.accountNo,
      'address': value.address,
      'dateJoined': value.dateJoined,
      'phoneNo': value.phoneNo,
      'billingEmail': value.billingEmail,
      'type': 2
    };
    if (!valid) {
      this.helperService.appLogger(this.helperService.translated.STATUS.ERROR, 'Invalid Fields');
      return;
    }
    this.settingService.editOrganization(this.orgID, data).subscribe((res) => {
      this.helperService.createSnack('Entity has been updated Successfully', 'Entity Updated', this.helperService.constants.status.SUCCESS);
    });
  }


}
