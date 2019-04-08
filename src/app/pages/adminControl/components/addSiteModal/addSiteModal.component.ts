import { Component, OnInit, Renderer2 } from '@angular/core';
import { HelperService } from '../../../../shared/helperService/helper.service';
import { Translation } from '../../../../models/translate.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { AdminControlService } from '../../services/adminControl.service';
import { Site, SiteAddData, SitesInfo } from '../../../../models/site.model';
import { NavigationService } from '../../../navigation/services/navigation.service';
import { CompilerProvider } from '../../../../shared/compiler/compiler';
import { AddSite } from '../../../../models/adminControl/addSite.model';

@Component({
  selector: 'app-addSiteModal',
  templateUrl: './addSiteModal.component.html',
  styleUrls: ['./addSiteModal.component.scss']
})
export class AddSiteModalComponent implements OnInit {

  
  addSiteForm: FormGroup;
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
    this.addSiteModel.translated = this.helperService.translation;
    this.addSiteModel.appConstants = this.helperService.constants.appConstant;
    this.render.addClass(document.body, this.helperService.constants.config.theme.addSiteClass);

  }

  ngOnInit() {
    this.addSiteForm = this.formBuilder.group({
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

  addSite({ value }: { value: SiteAddData }) {
    let siteData = {
      name: value.siteName,
      location: value.siteAddress,
      safeZone: value.safeZone,
      siteSafetyPlan: value.siteSafetyPlan,
      entity: this.addSiteModel.entityId
    };
    let data = {
      'entityId': this.addSiteModel.entityId
    };
    this.adminServices.addSite(siteData).subscribe((res) => {
      this.addSiteModel.addSiteResponse = res;
      if (this.addSiteModel.addSiteResponse.responseDetails.code === '0038') {
        this.adminServices.viewSites(data).subscribe((res) => {
          this.addSiteModel.sitesList = res;
          this.addSiteModel.sitesData = this.compiler.constructSiteData(this.addSiteModel.sitesList);
          this.adminServices.changeSites(this.addSiteModel.sitesData);
          this.onNoClick();
        });
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS, 'Site has been created successfully');
      }
      else if (this.addSiteModel.addSiteResponse.responseDetails.code === '0037') {
        this.helperService.appLogger(this.helperService.constants.status.ERROR, 'Site Creation Failed')
      }
    });


  }

}
