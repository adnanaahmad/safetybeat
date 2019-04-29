import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {SettingsService} from 'src/app/pages/settings/services/settings.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {Organization, OrganizationInfo} from '../../../../models/Settings/organizationInfo.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-organization-info',
  templateUrl: './organizationInfo.component.html',
  styleUrls: ['./organizationInfo.component.scss']
})
export class OrganizationInfoComponent implements OnInit {
  orgObj: OrganizationInfo = <OrganizationInfo>{};
  @ViewChild('gmap') gMapElement: ElementRef;

  constructor(public helperService: HelperService,
              public settingService: SettingsService,
              public formBuilder: FormBuilder,
              public compiler: CompilerProvider) {
    this.orgObj.enabled = false;
    this.orgObj.pipe = new DatePipe('en-US');
  }

  ngOnInit() {
    this.orgObj.organizationForm = this.formBuilder.group({
      name: ['', Validators.required],
      accountNo: ['', Validators.required],
      address: ['', Validators.required],
      billingEmail: ['', [Validators.required, Validators.email]],
      dateJoined: ['', Validators.required],
      phoneNo: ['', Validators.required],
      type: ['', Validators.required]
    });
    this.getOrganizationInfo();
    this.getOrganizationTypes();
  }

  /**
   * handling forms validations
   */
  get organizationViewForm() {
    return this.orgObj.organizationForm.controls;
  }

  getOrganizationTypes() {
    this.settingService.getTypes().subscribe((res) => {
      this.orgObj.types = res;
    });
  }

  getOrganizationInfo() {
    this.settingService.organizationData.subscribe((res) => {
      if (res === 1) {
        this.settingService.getOrganization().subscribe((res) => {
          let orgObject = this.compiler.constructOrganizationObject(res);
          this.organizationViewForm['name'].setValue(orgObject.name);
          this.organizationViewForm['accountNo'].setValue(orgObject.accountNo);
          this.organizationViewForm['address'].setValue(orgObject.address);
          this.organizationViewForm['billingEmail'].setValue(orgObject.billingEmail);
          this.organizationViewForm['dateJoined'].setValue(this.orgObj.pipe.transform(orgObject.dateJoined));
          this.organizationViewForm['phoneNo'].setValue(orgObject.phoneNo);
          this.organizationViewForm['type'].setValue(orgObject.type);
          this.helperService.setLocationGeocode(orgObject.address,
            this.helperService.createMap(this.gMapElement)).then();
          this.orgObj.orgID = orgObject.id;
          this.orgObj.organizationForm.disable();
        });
      } else {
        // it means that we dont need to call API
      }
    });
  }

  editOrgForm() {
    this.orgObj.enabled = true;
    this.orgObj.organizationForm.enable();
  }

  cancelOrgForm() {
    this.orgObj.enabled = false;
    this.orgObj.organizationForm.disable();
    this.getOrganizationInfo();
  }

  updateOrganization({value, valid}: { value: Organization; valid: boolean }): void {
    this.orgObj.enabled = false;
    this.orgObj.organizationForm.disable();
    let data = {
      'name': value.name,
      'accountNo': value.accountNo,
      'address': value.address,
      'dateJoined': value.dateJoined,
      'phoneNo': value.phoneNo,
      'billingEmail': value.billingEmail,
      'type': value.type
    };
    if (!valid) {
      this.helperService.appLogger(this.helperService.translated.STATUS.ERROR, this.helperService.translated.MESSAGES.INVALID_DATA);
      return;
    }
    this.settingService.editOrganization(this.orgObj.orgID, data).subscribe((res) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ORG_DETAILS,
        this.helperService.translated.LOGGER.MESSAGES.ORG_SUCCESS, this.helperService.constants.status.SUCCESS);
    });
  }
}