import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {EntityCodeData} from 'src/app/models/adminControl/entityControl.model';

@Component({
  selector: 'app-entityCodeModal',
  templateUrl: './entityCodeModal.component.html',
  styleUrls: ['./entityCodeModal.component.scss']
})
export class EntityCodeModalComponent implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<EntityCodeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EntityCodeData,
    public helperService: HelperService
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

}
