import {Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {AddSiteData, SiteAddData} from 'src/app/models/site.model';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {AddSite} from 'src/app/models/adminControl/addSite.model';
import {MemberCenterService} from 'src/app/pages/adminControl/modules/memberCenter/services/member-center.service';

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
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.render.addClass(document.body, this.helperService.constants.config.theme.addSiteClass);
    this.addSiteObj.loading = false;
    this.addSiteObj.modalType = data.Modal;
    if (data && data.site) {
      this.addSiteObj.site = data.site;
      this.addSiteObj.siteSafetyManager = data.site.siteSafetyManager;
      this.addSiteObj.createdBy = data.site.createdBy;
    }
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
      siteSafetyManager: ['', Validators.required],
    });
    if (this.addSiteObj.modalType === false) {
      this.viewSiteInfo();
      this.getAllUsers();
    }
  }

  /**
   * this function is called when the component is destroyed and it removes the assigned body class to this particular
   * component so that this would not affect the other components and this function is also used for hiding the debugging messages.
   */

  ngOnDestroy() {
    this.render.removeClass(document.body, this.helperService.constants.config.theme.addSiteClass);
    this.helperService.hideLoggers();
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
      siteSafetyManager: this.addSiteObj.siteSafetyManager.id
    });
    this.helperService.address = this.addSiteObj.site.location;
    this.helperService.setLocationGeocode(this.addSiteObj.site.location, this.helperService.createMap(this.gMapElement));
  }

  /**
   * this function is to call the api for getting all the users of entity
   */

  getAllUsers() {
    let data = {
      entityId: JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key))
    };
    this.memberService.allEntityUsers(data).subscribe((res) => {
      if (res) {
        this.addSiteObj.entityUsers = this.compiler.entityUser(res.data);
      }
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
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
      entity: JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
    };
    if (editSite) {
      siteData.createdBy = this.addSiteObj.site.createdBy;
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
      this.addSiteObj.loading = false;
      this.onNoClick();
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.helperService.translated.MESSAGES.SITE_EDIT_SUCCESS);
      } else {
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
      this.addSiteObj.loading = false;
      this.onNoClick();
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.helperService.translated.MESSAGES.SITE_CREATED);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.MESSAGES.SITE_FAILED);
      } else {
        this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.MESSAGES.SITE_FAILED);
      }
    }, error => {
      this.onNoClick();
      this.addSiteObj.loading = false;
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.MESSAGES.SITE_FAILED);
    });
  }

}
