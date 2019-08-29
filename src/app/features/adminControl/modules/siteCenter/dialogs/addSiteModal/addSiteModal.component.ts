import {Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatBottomSheet, MatDialogRef} from '@angular/material';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {AddSiteData, SiteAddData} from 'src/app/models/site.model';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {AddSite} from 'src/app/models/adminControl/addSite.model';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import {NavigationService} from '../../../../../navigation/services/navigation.service';

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
    public compiler: CompilerProvider,
    private render: Renderer2,
    private adminServices: AdminControlService,
    private memberService: MemberCenterService,
    private navService: NavigationService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.render.addClass(document.body, this.helperService.constants.config.theme.addSiteClass);
    this.addSiteObj.loading = false;
    this.addSiteObj.modalType = data.Modal;
    this.addSiteObj.enableRadius = false;
    if (data && data.site) {
      this.addSiteObj.site = data.site;
      this.addSiteObj.siteSafetyManager = data.site.siteSafetyManager;
      this.addSiteObj.createdBy = data.site.createdBy;
      this.addSiteObj.radius = data.site.radius;
      this.addSiteObj.gpsTrackEnabled = data.site.gpsTrackEnabled;
    }
    this.addSiteObj.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res && res !== 1) {
        this.addSiteObj.entityId = res.entityInfo.id;
      }
    })
  }

  /**
   * this function is called on the initialization of this component and is used to create the map from where user can see the
   * entered address on the map and in this function we also have created the addSiteForm in which all the input fields are declared
   * here that we need in the addSiteForm.
   */

  ngOnInit() {
    this.helperService.displayButton = false;
    this.helperService.createMap(this.gMapElement);
    this.addSiteObj.addSiteForm = this.formBuilder.group({
      siteName: ['', Validators.required],
      siteSafetyPlan: ['', Validators.required],
      siteAddress: ['', Validators.required],
      safeZone: false,
      siteSafetyManager: [''],
      radius: ['', Validators.required],
      gpsTrackEnabled: ['']
    });
    if (this.addSiteObj.modalType === false) {
      this.viewSiteInfo();
      this.getAllUsers();
    }
  }

  setRadius(mapProp, radius) {
    this.helperService.setLocationGeocode(this.helperService.address, this.helperService.createMap(this.gMapElement), parseInt(radius, 10));
  }

  /**
   * this function is called when the component is destroyed and it removes the assigned body class to this particular
   * component so that this would not affect the other components and this function is also used for hiding the debugging messages.
   */

  ngOnDestroy() {
    this.render.removeClass(document.body, this.helperService.constants.config.theme.addSiteClass);
    this.helperService.hideLoggers();
    this.addSiteObj.subscription.unsubscribe();
  }

  /**
   * this function is used to close the dialog when the user clicks on the cancel button.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * this function is used to check the form validation of the addSiteForm whether the data entered is valid or not and whether the
   * user has entered the data or not.
   */

  get formValidation() {
    return this.addSiteObj.addSiteForm.controls;
  }

  /**
   * this function is used to add the site in the sites list of the particular entity.
   * @params value
   */

  siteFormSubmit({value}: { value: SiteAddData }) {
    this.addSiteObj.modalType ? this.addSite(value) : this.editSite(value);
  }

  /**
   * this function is called to assign the values of site fields in the modal when user clicks on edit the site
   */

  viewSiteInfo() {
    this.addSiteObj.addSiteForm = this.formBuilder.group({
      siteName: this.addSiteObj.site.name,
      siteSafetyPlan: this.addSiteObj.site.siteSafetyPlan,
      siteAddress: this.addSiteObj.site.location,
      safeZone: this.addSiteObj.site.safeZone,
      siteSafetyManager: this.addSiteObj.siteSafetyManager.id,
      radius: this.addSiteObj.site.radius,
      gpsTrackEnabled: this.addSiteObj.site.gpsTrackEnabled
    });
    this.setRadiusEnabled(this.addSiteObj.site.location);
    this.helperService.address = this.addSiteObj.site.location;
    this.helperService.setLocationGeocode(this.addSiteObj.site.location,
      this.helperService.createMap(this.gMapElement), this.addSiteObj.site.radius);
  }

  /**
   * this function is to call the api for getting all the users of entity
   */

  getAllUsers() {
    let data = {
      entityId: this.helperService.getEntityId()
    };
    this.memberService.allEntityUsers(data).subscribe((res) => {
      if (res) {
        this.addSiteObj.entityUsers = this.compiler.constructDataForTeams(res.data);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  /**
   * this function is used to generate site's data according to the edit or add site function
   * @params value
   * @params editSite
   */

  generateSiteData(value, editSite) {
    let siteData: AddSiteData = {
      name: value.siteName,
      location: this.helperService.address,
      longitude: this.helperService.longitude,
      latitude: this.helperService.latitude,
      safeZone: value.safeZone,
      siteSafetyPlan: value.siteSafetyPlan,
      radius: value.radius,
      gpsTrackEnabled: value.gpsTrackEnabled,
      entity: this.addSiteObj.entityId,
    };
    if (editSite) {
      siteData.createdBy = this.addSiteObj.site.createdBy.id;
      siteData.siteSafetyManager = value.siteSafetyManager;
    }
    return siteData;
  }

  /**
   * this function is to call the api of edit site when user makes some changes and clicks on save button
   */

  editSite(value: SiteAddData) {
    this.addSiteObj.loading = true;
    this.adminServices.editSite(this.addSiteObj.site.id, this.generateSiteData(value, true)).subscribe((res) => {
      this.onNoClick();
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.addSiteObj.loading = false;
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.helperService.translated.MESSAGES.SITE_EDIT_SUCCESS);
      } else {
        this.addSiteObj.loading = false;
        this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.MESSAGES.SITE_EDIT_FAILURE);
      }
    }, (error) => {
      this.addSiteObj.loading = false;
      this.onNoClick();
      this.helperService.appLogger(error.error, this.helperService.translated.MESSAGES.SITE_EDIT_FAILURE);
    });
  }

  /**
   * this function is to call the api of add site when user makes some changes and clicks on add button
   */

  addSite(value: SiteAddData) {
    this.addSiteObj.loading = true;
    this.adminServices.addSite(this.generateSiteData(value, false)).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.addSiteObj.loading = false;
        this.onNoClick();
        this.helperService.createSnack(this.helperService.translated.MESSAGES.SITE_CREATED, this.helperService.constants.status.SUCCESS);
      } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.addSiteObj.loading = false;
        this.onNoClick();
      } else {
        this.addSiteObj.loading = false;
        this.onNoClick();
      }
    }, error => {
      this.onNoClick();
      this.addSiteObj.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.SITE_FAILED, this.helperService.constants.status.ERROR);
    });
  }

  setRadiusEnabled(value: string) {
    this.addSiteObj.enableRadius = value ? true : false;
  }
}
