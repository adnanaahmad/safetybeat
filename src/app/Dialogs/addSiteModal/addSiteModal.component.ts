import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import { FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import { SiteAddData} from 'src/app/models/site.model';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {AddSite} from 'src/app/models/adminControl/addSite.model';

@Component({
  selector: 'app-addSiteModal',
  templateUrl: './addSiteModal.component.html',
  styleUrls: ['./addSiteModal.component.scss']
})
export class AddSiteModalComponent implements OnInit, OnDestroy {
  @ViewChild('gmap') gmapElement: ElementRef;
  addSiteModel: AddSite = <AddSite>{};

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
      this.addSiteModel.entityData = res;
      this.addSiteModel.entityId = this.addSiteModel.entityData.entityInfo.id;
    });
    this.addSiteModel.translated = this.helperService.translated;
    this.addSiteModel.appConstants = this.helperService.constants.appConstant;
    this.render.addClass(document.body, this.helperService.constants.config.theme.addSiteClass);
    this.addSiteModel.loading = false;

  }

  ngOnInit() {
    this.helperService.createMap(this.gmapElement);
    this.addSiteModel.addSiteForm = this.formBuilder.group({
      siteName: ['', Validators.required],
      siteSafetyPlan: ['', Validators.required],
      siteAddress: ['', Validators.required],
      safeZone: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.render.removeClass(document.body, this.helperService.constants.config.theme.addSiteClass);
    this.helperService.hideLoggers();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * this function  is used to...
   * @params value
   */
  setAddress(addrObj) {
    let onSelect: boolean = false;
    this.addSiteModel.displaySubmitButton = true;
    if (!this.helperService.isEmpty(addrObj)) {
      this.addSiteModel.addr = addrObj.formatted_address;
      onSelect = true;
    } else {
      this.addSiteModel.addr =  this.addSiteModel.addSiteForm.controls.siteAddress.value;
    }
    this.setMap({address: this.addSiteModel.addr, onSelect: onSelect});
  }

  get formValidation() {
    return this.addSiteModel.addSiteForm.controls;
  }

  addSite({value}: { value: SiteAddData }) {
    let siteData = {
      name: value.siteName,
      location: this.addSiteModel.addr,
      safeZone: value.safeZone,
      siteSafetyPlan: value.siteSafetyPlan,
      entity: this.addSiteModel.entityId
    };
    let data = {
      'entityId': this.addSiteModel.entityId
    };
    this.addSiteModel.loading = true;
    this.adminServices.addSite(siteData).subscribe((res) => {
      this.addSiteModel.addSiteResponse = res;
      if (this.addSiteModel.addSiteResponse.responseDetails.code === '0038') {
        this.adminServices.viewSites(data).subscribe((res) => {
          this.addSiteModel.sitesList = res;
          this.addSiteModel.sitesData = this.compiler.constructSiteData(this.addSiteModel.sitesList);
          this.adminServices.changeSites(this.addSiteModel.sitesData);
          this.addSiteModel.loading = false;
          this.onNoClick();
          this.helperService.appLogger(this.helperService.constants.status.SUCCESS, 'Site has been created successfully');
        });
      } else if (this.addSiteModel.addSiteResponse.responseDetails.code === '0037') {
        this.addSiteModel.loading = false;
        this.onNoClick();
        this.helperService.appLogger(this.helperService.constants.status.ERROR, 'Site Creation Failed')
      }
    });


  }

  setMap({address, onSelect}: { address: any, onSelect: boolean }) {
    this.addSiteModel.displaySubmitButton = onSelect;
    this.helperService.setLocationGeocode(address, this.helperService.createMap(this.gmapElement)).then(res => {
      this.addSiteModel.displaySubmitButton = true;
      return this.formValidation.siteAddress.setErrors(null);
    }).catch(err => {
      this.addSiteModel.displaySubmitButton = false;
      return this.formValidation.siteAddress.setErrors({invalid: true});
    });
  }

}
