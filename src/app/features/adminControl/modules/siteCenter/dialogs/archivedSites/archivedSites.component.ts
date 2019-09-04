import {Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatBottomSheet, MatDialogRef} from '@angular/material';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {AddSite} from 'src/app/models/adminControl/addSite.model';
import {NavigationService} from '../../../../../navigation/services/navigation.service';

@Component({
  selector: 'app-archivedSites',
  templateUrl: './archivedSites.component.html',
  styleUrls: ['./archivedSites.component.scss']
})
export class ArchivedSitesComponent implements OnInit, OnDestroy {
  addSiteObj: AddSite = <AddSite>{};


  constructor(
    public helperService: HelperService,
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ArchivedSitesComponent>,
    public compiler: CompilerProvider,
    private render: Renderer2,
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

  ngOnInit() {}

  /**
   * this function is called when the component is destroyed and it removes the assigned body class to this particular
   * component so that this would not affect the other components and this function is also used for hiding the debugging messages.
   */
  ngOnDestroy() {
    this.render.removeClass(document.body, this.helperService.constants.config.theme.addSiteClass);
    this.helperService.hideLoggers();
    if (this.addSiteObj.entityId) {
      this.addSiteObj.subscription.unsubscribe();
    }
  }

  /**
   * this function is used to close the dialog when the user clicks on the cancel button.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
}
