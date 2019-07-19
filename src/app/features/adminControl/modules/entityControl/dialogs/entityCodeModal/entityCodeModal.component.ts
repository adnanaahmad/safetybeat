import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {EntityCodeModel} from 'src/app/models/code.model';

@Component({
  selector: 'app-entityCodeModal',
  templateUrl: './entityCodeModal.component.html',
  styleUrls: ['./entityCodeModal.component.scss']
})
export class EntityCodeModalComponent implements OnInit, OnDestroy {
  private loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EntityCodeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EntityCodeModel,
    public helperService: HelperService,
    private navService: NavigationService,
    private adminServices: AdminControlService
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.onNoClick();
  }

  /**
   * this function is used to close the dialog
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * this function is used for refreshing the entity code
   */

  refreshEntityCode() {
    let data = {
      entityId: this.data.entity.id
    };
    this.loading = true;
    this.adminServices.refreshEntityCode(data).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.data.entity.code = res.data.entityCode;
        this.loading = false;
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.SUCCESS);
      } else {
        this.loading = false;
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.loading = false;
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    })
  }
}
