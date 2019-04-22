import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AddSite} from '../../../../../../models/adminControl/addSite.model';
import {HelperService} from '../../../../../../shared/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {AdminControlService} from '../../../../services/adminControl.service';
import {NavigationService} from '../../../../../navigation/services/navigation.service';
import {CompilerProvider} from '../../../../../../shared/compiler/compiler';
import {SiteAddData} from '../../../../../../models/site.model';
import {EditSite} from '../../../../../../models/adminControl/editSite.model';

@Component({
  selector: 'app-editSiteModal',
  templateUrl: './editSiteModal.component.html',
  styleUrls: ['./editSiteModal.component.scss']
})
export class EditSiteModalComponent implements OnInit, OnDestroy {

  @ViewChild('gmap') gMapElement: ElementRef;
  editSiteObj: EditSite = <EditSite>{};

  constructor(
    public helperService: HelperService,
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditSiteModalComponent>,
    private render: Renderer2,
    private adminServices: AdminControlService,
    public compiler: CompilerProvider,
  ) {
    this.render.addClass(document.body, this.helperService.constants.config.theme.addSiteClass);
    this.editSiteObj.loading = false;

  }

  ngOnInit() {
    this.helperService.createMap(this.gMapElement);
    this.editSiteObj.editSiteForm = this.formBuilder.group({
      siteName: ['', Validators.required],
      siteSafetyPlan: ['', Validators.required],
      siteAddress: ['', Validators.required],
      safeZone: false
    });
  }

  ngOnDestroy() {
    this.render.removeClass(document.body, this.helperService.constants.config.theme.addSiteClass);
    this.helperService.hideLoggers();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get formValidation() {
    return this.editSiteObj.editSiteForm.controls;
  }

  addSite({value}: { value: SiteAddData }) {
    let siteData = {
      name: value.siteName,
      location: this.helperService.address,
      safeZone: value.safeZone,
      siteSafetyPlan: value.siteSafetyPlan,
      entity: ''
    };
    this.editSiteObj.loading = true;
    this.adminServices.addSite(siteData).subscribe((res) => {
      this.editSiteObj.editSiteResponse = res;
      if (this.editSiteObj.editSiteResponse.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.editSiteObj.loading = false;
        this.onNoClick();
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.helperService.translated.MESSAGES.SITE_CREATED);
      } else if (this.editSiteObj.editSiteResponse.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.editSiteObj.loading = false;
        this.onNoClick();
        this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.MESSAGES.SITE_FAILED);
      }
    });


  }
}
