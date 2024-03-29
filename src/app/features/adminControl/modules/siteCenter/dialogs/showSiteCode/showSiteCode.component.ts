import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SiteCentre} from 'src/app/models/adminControl/siteCentre.model';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {SiteCodeModel} from 'src/app/models/code.model';

@Component({
  selector: 'app-showSiteCode',
  templateUrl: './showSiteCode.component.html',
  styleUrls: ['./showSiteCode.component.scss']
})
export class ShowSiteCodeComponent implements OnInit, OnDestroy {
  siteCentreObj: SiteCentre = <SiteCentre>{};

  constructor(
    public dialogRef: MatDialogRef<ShowSiteCodeComponent>,
    public helperService: HelperService,
    private adminServices: AdminControlService,
    @Inject(MAT_DIALOG_DATA) public data: SiteCodeModel,
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.onNoClick();
  }

  onNoClick(): void {
    this.dialogRef.close();

  }

  /**
   * this function is used to refresh the site code
   */

  refreshSiteCode() {
    let data = {
      siteId: this.data.site.id
    };
    this.siteCentreObj.loading = true;
    this.adminServices.refreshSiteCode(data).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.data.site.code = res.data.code;
        this.siteCentreObj.loading = false;
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.SUCCESS);
      } else {
        this.siteCentreObj.loading = false;
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.siteCentreObj.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    })
  }
}
