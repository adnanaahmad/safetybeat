import {Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {SiteAddData} from 'src/app/models/site.model';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {AddSite} from 'src/app/models/adminControl/addSite.model';
import {ProfileService} from '../../../../../profile/services/profile.service';

@Component({
  selector: 'app-addSiteModal',
  templateUrl: './addSiteModal.component.html',
  styleUrls: ['./addSiteModal.component.scss']
})
export class AddSiteModalComponent implements OnInit, OnDestroy {
  @ViewChild('gmap') gMapElement: ElementRef;
  addSiteObj: AddSite = <AddSite>{};


  constructor(
    public helperService: HelperService,
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddSiteModalComponent>,
    private render: Renderer2,
    private adminServices: AdminControlService,
    public compiler: CompilerProvider,
    @Inject(MAT_DIALOG_DATA) public data,
    public  profileService: ProfileService
  ) {
    this.render.addClass(document.body, this.helperService.constants.config.theme.addSiteClass);
    this.addSiteObj.loading = false;
    this.addSiteObj.modalType = data.Modal;
    this.addSiteObj.site = data.site;
    this.addSiteObj.siteSafetyManager = data.siteSafetyManager;
    this.addSiteObj.createdBy = data.createdBy;
  }

  ngOnInit() {
    this.helperService.createMap(this.gMapElement);
    this.addSiteObj.addSiteForm = this.formBuilder.group({
      siteName: ['', Validators.required],
      siteSafetyPlan: ['', Validators.required],
      siteAddress: ['', Validators.required],
      safeZone: false,
      siteSafetyManager: ['', Validators.required],
    });
    if (this.addSiteObj.modalType === false) {
      this.viewSiteInfo();
    }
  }

  ngOnDestroy() {
    this.render.removeClass(document.body, this.helperService.constants.config.theme.addSiteClass);
    this.helperService.hideLoggers();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get formValidation() {
    return this.addSiteObj.addSiteForm.controls;
  }

  addSite({value}: { value: SiteAddData }) {
    let siteData = {
      name: value.siteName,
      location: this.helperService.address,
      safeZone: value.safeZone,
      siteSafetyPlan: value.siteSafetyPlan,
      entity: JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
    };
    this.addSiteObj.loading = true;
    this.adminServices.addSite(siteData).subscribe((res) => {
      this.addSiteObj.addSiteResponse = res;
      if (this.addSiteObj.addSiteResponse.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.addSiteObj.loading = false;
        this.onNoClick();
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.helperService.translated.MESSAGES.SITE_CREATED);
      } else if (this.addSiteObj.addSiteResponse.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.addSiteObj.loading = false;
        this.onNoClick();
        this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.MESSAGES.SITE_FAILED);
      }
    });

  }

  viewSiteInfo() {
    this.addSiteObj.addSiteForm = this.formBuilder.group({
      siteName: this.addSiteObj.site.name,
      siteSafetyPlan: this.addSiteObj.site.siteSafetyPlan,
      siteAddress: this.addSiteObj.site.location,
      safeZone: this.addSiteObj.site.safeZone,
      siteSafetyManager: this.addSiteObj.siteSafetyManager.first_name + ' ' + this.addSiteObj.siteSafetyManager.last_name
    });
    this.helperService.setLocationGeocode(this.addSiteObj.site.location, this.helperService.createMap(this.gMapElement));
  }
}
