import { Component, OnInit, Renderer2 } from '@angular/core';
import { HelperService } from '../../../../shared/helperService/helper.service';
import { Translation } from '../../../../models/translate.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { AdminControlService } from '../../services/adminControl.service';
import { Site, SiteAddData, SitesInfo } from '../../../../models/site.model';
import { NavigationService } from '../../../navigation/services/navigation.service';
import { CompilerProvider } from '../../../../shared/compiler/compiler';

@Component({
  selector: 'app-addSiteModal',
  templateUrl: './addSiteModal.component.html',
  styleUrls: ['./addSiteModal.component.scss']
})
export class AddSiteModalComponent implements OnInit {

  translated: Translation;
  addSiteForm: FormGroup;
  appConstants: any;
  entityData: any;
  entityId: any;
  sitesList: any;
  sitesData: SitesInfo[];
  addSiteResponse: any;

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
      this.entityData = res;
      this.entityId = this.entityData.entityInfo.id;
    });
    this.translated = this.helperService.translation;
    this.appConstants = this.helperService.constants.appConstant;
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
      entity: this.entityId
    };
    let data = {
      'entityId': this.entityId
    };
    this.adminServices.addSite(siteData).subscribe((res) => {
      this.addSiteResponse = res;
      if (this.addSiteResponse.responseDetails.code == '0038') {
        this.adminServices.viewSites(data).subscribe((res) => {
          this.sitesList = res;
          this.sitesData = this.compiler.constructSiteData(this.sitesList);
          this.adminServices.changeSites(this.sitesData);
          this.onNoClick();
        });
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS, 'Site has been created successfully');
      }
      else if (this.addSiteResponse.responseDetails.code == '0037') {
        this.helperService.appLogger(this.helperService.constants.status.ERROR, 'Site Creation Failed')
      }
    });


  }

}
