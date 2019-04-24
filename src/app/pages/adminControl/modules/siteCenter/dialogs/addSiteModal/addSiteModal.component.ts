import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {SiteAddData} from 'src/app/models/site.model';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {AddSite} from 'src/app/models/adminControl/addSite.model';

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
    private navService: NavigationService,
    public compiler: CompilerProvider,
  ) {
    this.navService.selectedEntityData.subscribe((res) => {
      this.addSiteObj.entityData = res;
      this.addSiteObj.entityId = this.addSiteObj.entityData.entityInfo.id;
    });
    this.render.addClass(document.body, this.helperService.constants.config.theme.addSiteClass);
    this.addSiteObj.loading = false;

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
      safeZone: false
    });
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

  addSite({value}: { value: SiteAddData }) {
    let siteData = {
      name: value.siteName,
      location: this.helperService.address,
      safeZone: value.safeZone,
      siteSafetyPlan: value.siteSafetyPlan,
      entity: this.addSiteObj.entityId
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
