import {Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource} from '@angular/material';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {SiteAddData} from 'src/app/models/site.model';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {AddSite} from 'src/app/models/adminControl/addSite.model';
import {ProfileService} from '../../../../../profile/services/profile.service';
import {MemberCenterService} from '../../../memberCenter/services/member-center.service';

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
    private memberService: MemberCenterService
  ) {
    this.render.addClass(document.body, this.helperService.constants.config.theme.addSiteClass);
    this.addSiteObj.loading = false;
    this.addSiteObj.modalType = data.Modal;
    this.addSiteObj.site = data.site;
    this.addSiteObj.siteSafetyManager = data.siteSafetyManager;
    this.addSiteObj.createdBy = data.createdBy;
  }

  /**
   * this function is called on the initialization of this component and is used to create the map from where user can see the
   * entered address on the map and in this function we also have created the addSiteForm in which all the input fields are declared
   * here that we need in the addSiteForm.
   */

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
    if (this.addSiteObj.modalType === false) {
      this.editSite(value);
    } else {
      this.addSite(value);
    }
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
    }
    this.memberService.entityUsers(data).subscribe((res) => {
      this.addSiteObj.entityUsers = this.compiler.entityUser(res);
    });
  }

  /**
   * this function is to call the api of edit site when user makes some changes and clicks on save button
   */

  editSite(value) {
    let siteData = {
      name: value.siteName,
      location: this.helperService.address,
      safeZone: value.safeZone,
      siteSafetyPlan: value.siteSafetyPlan,
      entity: JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
      createdBy: this.addSiteObj.site.createdBy,
      siteSafetyManager: this.addSiteObj.site.siteSafetyManager
    };
    this.adminServices.editSite(this.addSiteObj.site.id, siteData).subscribe((res) => {
      this.addSiteObj.loading = false;
      this.onNoClick();
      this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.helperService.translated.MESSAGES.SITE_EDIT_SUCCESS);
    }, (error) => {
      this.addSiteObj.loading = false;
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.MESSAGES.SITE_EDIT_FAILURE);
    });
  }

  /**
   * this function is to call the api of add site when user makes some changes and clicks on add button
   */

  addSite(value) {
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

}
